let utils = require('./../common/utils');
let pathDeal = require('./../common/path');
let file = require('./../common/file');
let namespace = require('./../common/namespace');
let express = require('express');
let app = express();
//默认参数
let defaultConfig = {
    host: '', //接口文档ip
    hostname: '', //接口文档域名
    port: 80, //接口文档端口
    path: '/v2/api-docs',
    method: 'GET',
    projectName: 'swagger', //项目名称
    mockPort: 3000, //模块数据服务端口
    customProtocol: 'http', //接口文档协议
    jsPath: '' //指定生成的URL文件创建路径，相对当前项目根目录
};

let Config = {}; //获取到用户的相关配置
let UrlsReal = {}; //urls
let UrlCounter = 0; //接口数量计数器
let SucCounter = 0; //成功计数器
let ErrorCounter = 0; //失败计数器
let ErrorUrls = []; //文件生成失败对应的路径
let GlobalDefinitions = {}; //
let MakeFilePromiseArray = []; //用于检测异步json文件写入是否全部完成

function init(c) {
    Config = dealConfig(c);
    getJsonData();
}

//处理参数
function dealConfig(c) {
    if (c.hostname) {
        c.headers = {
            host: c.hostname
        };
    }
    if (c.customProtocol == 'https') {
        c.port = 443;
    }
    //mock文件夹名
    c.mockDirName = `${c.projectName?c.projectName:defaultConfig.projectName}mock`;
    return Object.assign(defaultConfig, c);
}

//获取swagger接口数据
function getJsonData() {
    let protocol = Config.customProtocol; //默认为http
    let req = require(protocol).request(Config, (res) => {
        getJsonCallback(res);
    });

    req.on('error', (e) => {
        utils.error(`请求遇到问题: ${e.message}`);
    });

    req.end();
}

//数据请求回调
function getJsonCallback(res) {
    res.setEncoding('utf8');
    if (res.statusCode != 200) {
        utils.error('请检查配置是否设置正确！');
        return;
    }

    let result = '';
    res.on('data', (chunk) => {
        result += chunk;
        // analysisData(result);//不能放在这里处理数据，会报错
    });

    res.on('end', () => {
        analysisData(result);
    });
}

//分析swagger数据
function analysisData(data) {
    let jsonResult = utils.toJson(data); //串变成对象
    swaggerToJson(jsonResult); //将swagger改造成所需要的json数据
}

//将swagger改造成所需要的json数据
function swaggerToJson(data) {
    let paths = data.paths; //所有路径
    GlobalDefinitions = data.definitions;
    createMockDir(); //创建mock文件夹
    looppath(paths); //遍历path，生成相应的文件
    makeUrlsFile(); //产生urls汇聚文件
    startServer(); //待所有mock的json文件创建或者修改完成后，再启动server
}

//待所有mock的json文件创建或者修改完成后，再启动server
function startServer() {
    Promise.all(MakeFilePromiseArray).then((values) => { //文件创建完成后，再启动服务
        utils.log(`共产生${UrlCounter}个url`);
        utils.log(`共创建了${SucCounter}个json文件`);
        if (ErrorCounter > 0) {
            utils.log(`${ErrorCounter}个文件创建失败了，请检查相应的数据`);
            for (let i = 0; i < errorUrls.length; i++) {
                utils.warn(errorUrls[i]);
            }
        }
        app.listen(Config.mockPort, () => {
            utils.log(`【${new Date()}】服务器启动!`);
            utils.log(`http://127.0.0.1:${Config.mockPort}`);
        });
    }).catch((e) => {
        utils.error(e);
    });
}

//创建server链接
function createServer(url, mockDir, type) {
    let requreMockJson = require(mockDir);
    let realUrl = utils.dealUrl(url)
    app[type](realUrl, function(req, res) {
        console.log('请求时间：' + new Date());
        console.log('请求路径：' + url);
        console.log('请求方式：' + type);
        console.log('请求参数：' + JSON.stringify(req.params));
        // res.header('Content-type', 'application/json');
        // res.header('Charset', 'utf8');
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header('Access-Control-Allow-Credentials', true); //告诉客户端可以在HTTP请求中带上Cookie
        res.header("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, " +
            "Last-Modified, Cache-Control, Expires, Content-Type, Content-Language, Cache-Control, X-E4M-With,X_FILENAME");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.1')
        res.header("Content-Type", "application/json;charset=utf-8");
        // res.send(req.query.callback + '(' + JSON.stringify(requreMockJson) + ');');
        res.send(JSON.stringify(requreMockJson));
    });
}

//遍历tag，产生按模块数据
function loopTags(tags) {
    //遍历tags
    for (let i = 0; i < tags.length; i++) {
        let tagName = tags[i].name; //模块名
        let urlMockKey = tagName.toLowerCase(); //按模块对象key
        UrlsReal[urlMockKey] = {};
    }
}

//遍历paths，产生路径
function looppath(paths) {
    for (let key in paths) {
        //当前path是属于哪个模块tag，并遍历所有类型
        loopType(key, paths[key]);
    }
}

//查找当前path是属于哪个模块的
function loopType(key, obj) {
    let pathKey = '';
    for (let typekey in obj) { //可能会有get、post、put等
        let typecontent = obj[typekey];
        UrlCounter++;
        pathKey = typecontent.operationId; //接口的唯一名
        makeUrlsReal(pathKey, key, typekey); //pathKey为url信息的关键字,key为接口请求url路径、 typekey为接口请求类型， 请结合数据看
        makeMockJson(pathKey, typecontent, typekey); //生成单个文件的json数据并生成json文件

    }

}

//创建mock默认位置文件夹
function createMockDir() {
    let mockDirName = Config.mockDirName; //默认mock相关文件目录名
    let mockDir = pathDeal.join(process.cwd(), mockDirName);
    file.createDir(mockDir);
}

//生成自定义指定文件目录
function createCustomDir(dir) {
    file.createDir(dir);
}

//生成接口请求聚合文件内容
function makeUrlsReal(pathKey, url, type) {
    UrlsReal[pathKey] = {
        url: url,
        type: type
    }; //此数据用户汇聚所有接口请求路径及对应请求
}

//生成url聚合文件
function makeUrlsFile() {
    let content = utils.toStr(UrlsReal); //将要写入文件的内容串
    let mockDirName = Config.mockDirName; //默认mock相关文件目录名
    let filePath = pathDeal.join2(process.cwd(), mockDirName, namespace.urlsRealName); //默认生成位置，如果用户配置则生成至用户配置的位置

    if (Config.jsPath) { //用户如果有自定义文件目录
        let customFilePath = pathDeal.join(process.cwd(), Config.jsPath);
        createCustomDir(customFilePath);
        filePath = pathDeal.join(customFilePath, namespace.urlsRealName);
    }
    file.makeFileSync(filePath, content); //此处不需要写入成功或失败回调，所以用同步
}

//生成接口mock数据json内容
function makeMockJson(pathkey, typecontent, typekey) {
    let mockJson = {};
    let schema = typecontent.responses['200'].schema;
    let mockJsonKey = schema ? schema['$ref'] : ''; //此数据用于查询数据模型
    if (mockJsonKey) {
        let tempkey = queryData(mockJsonKey);
        mockJson = dealModel(GlobalDefinitions[tempkey], GlobalDefinitions, tempkey);
    } else {
        let model = schema ? schema : typecontent.responses['200'];
        mockJson = dealModel(model, GlobalDefinitions);
    }
    makeJsonFile(mockJson, pathkey, typekey); //只有json生成完成后才会将服务启动
}

//生成json文件
function makeJsonFile(jsonData, pathkey, typekey) {
    let content = utils.toStr(jsonData);
    let jsonFileName = `${pathkey}.json`;
    let filePath = pathDeal.join2(process.cwd(), Config.mockDirName, jsonFileName);

    //此处需要用成功或者失败的回调，所以用异步，异步才有回调
    let makeFilePromise = file.makeFile(filePath, content).then(() => {
        //文件生成成功后，像express中插入服务
        SucCounter++;
        createServer(pathkey, filePath, typekey)
    }, (err) => {
        ErrorCounter++;
        errorUrls.push(pathkey);
        utils.error(err);
    });
    MakeFilePromiseArray.push(makeFilePromise); //此处
}

//处理数据模型
function dealModel(definitions, GlobalDefinitions, prevKey) {
    let result = {};
    let type = definitions && definitions.type ? definitions.type : '';
    if (type) {
        if (type == 'string') {
            result = 'string';
        }
        if (type == 'integer') {
            result = 0;
        }
        if (type == 'boolean') {
            result = false;
        }
        if (type == 'object') {
            if (definitions.properties) {
                result = definitions.properties;
                for (let key in result) {
                    //防止递归数据造成死循环
                    if (result[key].type && result[key].type == 'array' && result[key].items['$ref'] && (queryData(result[key].items['$ref']) == prevKey)) {
                        result[key] = {};
                    } else {
                        result[key] = dealModel(result[key], GlobalDefinitions, key);
                    }

                }
            } else {
                result = {};
            }
        }
        if (type == 'array') {
            let items = definitions.items;
            if (items.type) {
                dealModel(items, GlobalDefinitions);
            } else {
                let objkey = queryData(definitions.items['$ref']);
                //防止递归数据造成死循环
                if (objkey != prevKey) {
                    result = [dealModel(GlobalDefinitions[objkey], GlobalDefinitions, objkey)];
                } else {
                    result = {};
                }

            }

        }
    } else {
        let goObject = definitions['$ref'] ? definitions['$ref'] : '';
        if (goObject) {
            let objkey = queryData(goObject);
            result = dealModel(GlobalDefinitions[objkey], GlobalDefinitions);
        } else {
            result = 'OK';
        }

    }
    return result;
}



//数据查找路径
function queryData(hash) {
    let result = '';
    result = (hash.substring(2, hash.length)).split('/');
    return result[1];
}


module.exports = {
    init: init
};