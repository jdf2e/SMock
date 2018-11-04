let fs = require('fs');
let utils = require('./utils');
//文件是否存在
function existsSync(url) {
    return fs.existsSync(url)
}

//读文件
function readFileSync(url) {
    return fs.readFileSync(url);
}

//创建目录
function createDir(dir) {
    var stat = fs.existsSync(dir);
    if (!stat) { //为true的话那么存在，如果为false不存在
        fs.mkdirSync(dir);
    }
}

//创建文件并写入内容（异步）
function makeFile(filePath, content) {
    return new Promise((resolve, reject) => {
        var stat = existsSync(filePath);
        if (stat) { //为true的话那么存在，如果为false不存在
            utils.log(`${filePath} 已存在，内容已覆盖`);
        }
        fs.writeFile(filePath, content, (err) => {
            if (!err) {
                resolve(filePath);
            } else {
                reject(err);
            }
        });
    });
}

//创建文件并写入内容（同步无回调）
function makeFileSync(filePath, content, resolve, reject) {
    var stat = existsSync(filePath);
    if (stat) { //为true的话那么存在，如果为false不存在
        utils.log(`${filePath} 已存在，内容已覆盖`);
    }
    // else {
    fs.writeFileSync(filePath, content);
}

module.exports = {
    existsSync,
    readFileSync,
    makeFileSync,
    makeFile,
    createDir
}