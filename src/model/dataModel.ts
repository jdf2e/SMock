interface Config {
    type: String,
    docPath: String, //swagger文档访问路径
    docPort: Number, //swagger文档端口号
    path: String,    //swagger模式路径
    method: String, //文档数据请求方式
    realHostName: String, // 项目上线后访问的真实域名
    mockPort: Number,  //启动服务的端口号
    customProtocol: String, //指定协议
    headers: any,           //创建服务时的请求头
    jsPath: String,
    descInclude: any,     //是否自动弹出接口描述
    override: Boolean      //是否每次启动服务都覆盖数据
    
}
interface Data {
    id?: any; //唯一ID
    url?: any; //接口路径
    type?: any; //请求类型
    [propName: string]: any;
}

interface UrlData {
    url: String
}
export { Config, Data, UrlData };