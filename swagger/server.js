/**
 * 服务相关express
 * author: liaoyanli
 */
let utils = require('jdcfe-smock/common/utils');
let paramsNumRule = require('./../common/param-num-rule');
let paramsTypeRule = require('./../common/param-type-rule');
let express = require('express');
let app = express();
//待所有mock的json文件创建或者修改完成后，再启动server
function runServer(port, cal) {
    app.listen(port, () => {
        if (cal) cal(); //启动成功
    });
}

//创建server链接
function createServer(url, mockDir, type) {
    let requreMockJson = require(mockDir);
    let realUrl = utils.dealUrl(url);

    app[type](realUrl, function(req, res) {
        utils.log('请求时间：' + new Date());
        utils.log('请求路径：' + url);
        utils.log('请求方式：' + type);
        utils.log('请求参数：' + JSON.stringify(req.params));
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

        // if () { //验证参数个数
        //     res.send('缺少必输参数');
        // } else if () {
        //     res.send('参数类型不正确')
        // } else {
        res.send(JSON.stringify(requreMockJson));
        // }

    });
}

module.exports = {
    createServer,
    runServer
}