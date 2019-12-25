const fs = require('fs');
const path = require('path');
const readline = require('readline');
let namespace = require('../common/namespace');
let pathUrl = path.join(path.resolve(), namespace.configName);

let text = {
    docPath: "",
    realHostName: ""
}
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let getDocPath = () => {
    let promise = new Promise((resolve, reject) => {
        rl.question('需要mock的Swagger文档访问路径(docPath):', (answer) => {
            text.docPath = (answer === "") ? text.docPath : answer;
            resolve();
        });
    });
    return promise;
}
let realHostName = () => {
    let promise = new Promise((resolve, reject) => {
        rl.question('上线之后的真实域名（realHostName）:', (answer) => {
            text.realHostName = (answer === "") ? text.realHostName : answer;
            resolve();
        });
    });
    return promise;
}
let create = () => {
    fs.writeFile(pathUrl, JSON.stringify(text, null, '\t'), err => {
        if (err) return console.error(err);
        console.log('启动超级变换形态~');
        console.log(text);
        rl.close();
    })
}
let generateParameters = () => {
    getDocPath()
        .then(() => {
            return realHostName();
        })
        .then(() => {
            return create();
        })
}
generateParameters();