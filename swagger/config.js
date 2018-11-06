/**
 * 参数处理 
 * author：liaoyanli
 */
//默认参数
let defaultConfig = {
    host: '', //接口文档ip
    domain: '', //接口文档域名
    port: 80, //接口文档端口
    path: '/v2/api-docs',
    method: 'GET',
    projectName: 'swagger', //项目名称
    mockPort: 3000, //模块数据服务端口
    customProtocol: 'http', //接口文档协议
    jsPath: '' //指定生成的URL文件创建路径，相对当前项目根目录
};

//处理参数
function dealConfig(c) {
    if (c.domain) {
        c.headers = {
            host: c.domain
        };
    }
    if (c.customProtocol == 'https') {
        c.port = 443;
    }
    //mock文件夹名
    c.mockDirName = `${c.projectName?c.projectName:defaultConfig.projectName}mock`;
    return Object.assign(defaultConfig, c);
}

//抛出用户默认参数，抛出处理后参数，如：header.host不需要用户自己再配置一遍
module.exports = {
    defaultConfig,
    dealConfig
}