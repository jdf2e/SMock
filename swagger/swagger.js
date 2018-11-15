/**
 * swagger文档主逻辑
 * author: liaoyanli
 */
let utils = require('./../common/utils');
let pathDeal = require('./../common/path');
let file = require('./../common/file');
let namespace = require('./../common/namespace');
// let express = require('express');
// let app = express();
let configJS = require('./config');
let serverJS = require('./server');
let modelJS = require('./model');

let Config = {}; //获取到用户的相关配置
let UrlsReal = {}; //urls
let UrlCounter = 0; //接口数量计数器
let SucCounter = 0; //成功计数器
let ErrorCounter = 0; //失败计数器
let ErrorUrls = []; //文件生成失败对应的路径
let GlobalDefinitions = {}; //
let MakeFilePromiseArray = []; //用于检测异步json文件写入是否全部完成

function init(c) {
    Config = configJS.dealConfig(c);
    getJsonData();
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
    utils.log(`状态码: ${res.statusCode}`);
    utils.log(`响应头: ${JSON.stringify(res.headers)}`);
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
        serverJS.runServer(Config.mockPort, () => {
            utils.log(`【${new Date()}】服务器启动!`);
            utils.log(`http://127.0.0.1:${Config.mockPort}`);
        })
    }).catch((e) => {
        utils.error(e);
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
        makeMockJson(pathKey, typecontent, typekey, key); //生成单个文件的json数据并生成json文件

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

//生成url聚合文件,此处不需要写入成功或失败回调，所以用同步
function makeUrlsFile() {
    let jsContent = customJsTpl();
    let mockDirName = Config.mockDirName; //默认mock相关文件目录名
    let jsFilePath = pathDeal.join2(process.cwd(), mockDirName, `${namespace.urlsRealName}.js`); //默认生成位置，如果用户配置则生成至用户配置的位置

    if (Config.jsPath) { //用户如果有自定义文件目录，则需要生成至用户自定义目录
        let customFileDir = pathDeal.join(process.cwd(), Config.jsPath);
        createCustomDir(customFilePath);
        jsFilePath = pathDeal.join(customFileDir, `${namespace.urlsRealName}.js`);

    }
    file.makeFileSync(jsFilePath, jsContent); //生成一个js文件

    let jsonFilePath = pathDeal.join2(process.cwd(), mockDirName, `${namespace.urlsRealName}.json`); //生成一个json文件，只有全部url
    let jsonContent = utils.toStr(UrlsReal); //将要写入文件的内容串
    file.makeFileSync(jsonFilePath, jsonContent); //生成一个json文件只有url
}

//根据用户定义的参数，生成指定格式的url聚合文件
function customJsTpl() {
    let tpl = require('./urlTpl');
    let hostname = Config.hostname;
    let host = hostname ? hostname : Config.host;
    return tpl.getTpl(UrlsReal, Config.mockPort, host);
}

//生成接口mock数据json内容
function makeMockJson(jsonFileName, typecontent, typekey, url) {
    let mockJson = {};
    let schema = typecontent.responses['200'].schema;
    let mockJsonKey = schema ? schema['$ref'] : ''; //此数据用于查询数据模型
    if (mockJsonKey) {
        let tempkey = utils.queryData(mockJsonKey);
        mockJson = modelJS.dealModel(GlobalDefinitions[tempkey], GlobalDefinitions, tempkey);
    } else {
        let model = schema ? schema : typecontent.responses['200'];
        mockJson = modelJS.dealModel(model, GlobalDefinitions);
    }
    makeJsonFile(mockJson, jsonFileName, typekey, url,typecontent); //只有json生成完成后才会将服务启动
}

//生成json文件
function makeJsonFile(jsonData, fileName, typekey, url,typecontent) {
    let content = utils.toStr(jsonData);
    let jsonFileName = `${fileName}.json`;
    let filePath = pathDeal.join2(process.cwd(), Config.mockDirName, jsonFileName);

    //此处需要用成功或者失败的回调，所以用异步，异步才有回调
    let makeFilePromise = file.makeFile(filePath, content).then(() => {
        //文件生成成功后，像express中插入服务
        SucCounter++;
        serverJS.createServer(url, filePath, typekey,typecontent)
    }, (err) => {
        ErrorCounter++;
        errorUrls.push(url);
        utils.error(err);
    });
    MakeFilePromiseArray.push(makeFilePromise); //此处
}

module.exports = {
    init: init
};