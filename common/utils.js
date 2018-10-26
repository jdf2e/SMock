//日志打印
let log = (msg) => {
    console.log(msg);
};
//警告打印
let warn = (msg) => {
    console.log(msg)
};

//将buffer转换成json春
let buffer2json = (buf) => {
    return JSON.parse(buf);
};
module.exports = {
    warn,
    log,
    buffer2json
}