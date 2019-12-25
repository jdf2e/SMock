"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let fs = require('fs');
let path = require('path');
const dict_1 = require("./dict");
function dealConfig(c) {
    if (c.docPath) {
        c.docPath = parseURL(c.docPath);
    }
    if (c.domain) {
        c.headers = {
            host: c.domain
        };
    }
    if (c.customProtocol == 'https') {
        c.port = 443;
    }
    //mock文件夹名
    // c.mockDirName = `${c.projectName?c.projectName:defaultConfig.projectName}mock`;
    return c; // Object.assign(defaultConfig, c);
}
exports.dealConfig = dealConfig;
function parseURL(url) {
    var a = url.replace("http://", "").replace("https://", "");
    return a.substring(0, a.indexOf("/") > 0 ? a.indexOf("/") : a.length);
}
exports.parseURL = parseURL;
function log(msg) {
    console.log(msg);
}
exports.log = log;
//警告打印
function warn(msg) {
    console.log(`warn:${msg}`);
}
exports.warn = warn;
function error(msg) {
    console.log(`error:${msg}`);
}
exports.error = error;
//将buffer或者字符串转换成json串
function toJson(str) {
    return JSON.parse(str);
}
exports.toJson = toJson;
//将对象变成格式化串
function toStr(json) {
    return JSON.stringify(json, null, 2);
}
exports.toStr = toStr;
//将含有花括号的url，替换成对应的数据
function dealUrl(url) {
    return url.replace(/\{.*?\}/g, function (d) {
        let key = d.substring(1, d.length - 1);
        return `:${key}`;
    }); //此正则很重要
}
exports.dealUrl = dealUrl;
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
exports.getParamByType = getParamByType;
// Data中获取对应ID的数据
function getDataFromArrayById(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if (item.id === id) {
            return item;
        }
    }
    return null;
}
exports.getDataFromArrayById = getDataFromArrayById;
//文件操作
function existsSync(url) {
    return fs.existsSync(url);
}
exports.existsSync = existsSync;
//读文件
function readFileSync(url) {
    return fs.readFileSync(url);
}
exports.readFileSync = readFileSync;
//创建目录
function createDir(dir) {
    var stat = fs.existsSync(dir);
    if (!stat) {
        //为true的话那么存在，如果为false不存在
        fs.mkdirSync(dir);
    }
}
exports.createDir = createDir;
//创建文件并写入内容（异步）
function makeFile(filePath, content) {
    return new Promise((resolve, reject) => {
        var stat = existsSync(filePath);
        if (stat) {
            //为true的话那么存在，如果为false不存在
            // utils.log(`${filePath} 已存在，内容已覆盖`);
        }
        fs.writeFile(filePath, content, (err) => {
            if (!err) {
                resolve(filePath);
            }
            else {
                reject(err);
            }
        });
    });
}
exports.makeFile = makeFile;
//创建文件并写入内容（同步无回调）
function makeFileSync(filePath, content) {
    var stat = existsSync(filePath);
    if (stat) {
        //为true的话那么存在，如果为false不存在
        log(`${filePath} 已存在，内容已覆盖`);
    }
    // else {
    fs.writeFileSync(filePath, content);
}
exports.makeFileSync = makeFileSync;
////判断是否存在json文件
function isNew() {
    return !existsSync(join(process.cwd(), dict_1.mockDirName));
}
exports.isNew = isNew;
//合并
function join(a, b) {
    return path.resolve(a, b);
}
exports.join = join;
function join2(a, b, c) {
    return path.join(a, b, c);
}
exports.join2 = join2;
// 判断对象中是否存在值
function keyInData(id, arr) {
    let result = false;
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if (item.id == id) {
            result = true;
        }
    }
    return result;
}
exports.keyInData = keyInData;
function getHost(url) {
}
exports.getHost = getHost;
