/**
 * 服务相关express
 * author: liaoyanli
 */
let utils = require('jdcfe-smock/common/utils');
let paramsNumRule = require('jdcfe-smock/swagger/param-num-rule');
let paramsTypeRule = require('jdcfe-smock/swagger/param-type-rule');
let express = require('express');
var bodyParser = require("body-parser");
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));

//待所有mock的json文件创建或者修改完成后，再启动server
function runServer(port, cal) {
    app.listen(port, () => {
        if (cal) cal(); //启动成功
    });
}

//创建server链接
function createServer(url, mockDir, type, typecontent, GlobalDefinitions) {
    let requreMockJson = require(mockDir);
    let realUrl = utils.dealUrl(url);

    app[type](realUrl, function(req, res) {
        utils.log(' ');
        utils.log('--------------------------');
        utils.log('请求时间：' + new Date());
        utils.log('请求路径：' + url);
        utils.log('请求方式：' + type);
        let params = getParamByType(type, req);
        utils.log('请求参数：' + JSON.stringify(params));
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

        //验证参数个数
        typecontent.parameters = typecontent.parameters || [];

        let parametersArr = typecontent.parameters,
            urlParameArr = Object.keys(params),
            requiredParamsArr = [];

        let isNotBody = parametersArr.some(function(item) {
            return item.in !== 'body';
        })

        parametersArr.forEach(item => {
            item.required && requiredParamsArr.push(item.name);
        });

        if (isNotBody) {
            if (!paramsNumRule.isInclude(requiredParamsArr, urlParameArr)) {
                res.send('缺少必输参数');
                return;
            }
        }

        if (!paramsTypeRule.validate(params, typecontent.parameters, GlobalDefinitions)) {
            res.send('有参数类型不正确，请查看服务台日志');
            return;
        }
        res.send(JSON.stringify(requreMockJson));
    });
}

//根据类型取参数
function getParamByType(type, req) {
    let params = {};
    type = type.toLowerCase();
    switch (type) {
        case 'get':
            params = req.query;
            break;
        case 'post':
            params = req.body;
            break;
        default:
            break;
    }
    return params;
}

module.exports = {
    createServer,
    runServer
}