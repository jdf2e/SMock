let fs = require('fs');
//文件是否存在
let existsSync = (url) => {
    return fs.existsSync(url)
}

//读文件
let readFileSync = (url) => {
    return fs.readFileSync(url);
}

module.exports = {
    existsSync,
    readFileSync
}