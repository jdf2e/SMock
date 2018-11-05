/** 
 * 工具
 * author: liaoyanli
 */

function log(msg) {
    console.log(msg);
};
//警告打印
function warn(msg) {
    console.log(`warn:${msg}`);
};

function error(msg) {
    console.log(`error:${msg}`);
};

//将buffer或者字符串转换成json串
function toJson(str) {
    return JSON.parse(str);
};

//将对象变成格式化串
function toStr(json) {
    return JSON.stringify(json, null, 2);
}

//将含有花括号的url，替换成对应的数据
function dealUrl(url) {
    return url.replace(/\{.*?\}/g, function(d) {
        let key = d.substring(1, d.length - 1);
        return `:${key}`;
    }); //此正则很重要
}

//数据查找路径，针对swagger返回数据的特殊处理
function queryData(hash) {
    let result = '';
    result = (hash.substring(2, hash.length)).split('/');
    return result[1];
}
module.exports = {
    warn,
    log,
    toJson,
    toStr,
    error,
    dealUrl,
    queryData
}