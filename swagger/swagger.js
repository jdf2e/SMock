//默认参数
let defaultConfig = {
    host: '', //接口文档ip
    hostname: '', //接口文档域名
    port: 80, //接口文档端口
    path: '/v2/api-docs',
    method: 'GET',
    projectName: 'swagger', //项目名称
    mockPort: 3000, //模块数据服务端口
    customProtocol: 'http',
    jsPath: '/' //指定生成的URL文件创建路径
}

//处理参数
let dealConfig = (config) => {
    if (config.hostname) {
        config.headers = {
            host: config.hostname
        };
    }
    return Object.assign(defaultConfig, config);
};

let init = (config) => {
    console.log(config)
    let httpConfig = dealConfig(config);
};

module.exports = {
    init: init
}