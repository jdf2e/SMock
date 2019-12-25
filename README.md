

<div align="center">
  <h1>smock-core</h1>
  <p>SMock的核心代码，smock run的主要逻辑</p>
</div>

### 版本命名规范
  采用银河系九大行星的顺序来命名。
- 1.0->mercury
- 2.0->venus

### 安装

```bash
npm install smock-core --save-dev
```

### 调用

```bash
let Core = require('smock-core').Core;
new Core({
  docPath:'xxx.xxx.xx.xx',
  docPort:'80',
  path:''
})
```

### 参数说明

|Attributes|forma|describe|default|
|---|---|---|---|
|type|String|文档数据源类型，暂只支持swagger|swagger|
|docPath|String|type为swagger时，swagger文档访问路径|-|
|docPort|Number|type为swagger时，swagger的文档端口号|80|
|path|String|type为swagger时，swagger模式接口路径|/v2/api-docs|
|method|String|type为swagger时，文档数据请求方式|GET|
|realHostName|String|项目上线后访问的真实域名|-|
|mockPort|Number|启动服务的端口号|3000|
|customProtocol|String|type为swagger时，具体文档服务器协议http或https|http|
|headers|Object|创建本地服务器时接口header附加参数|-|
|jsPath|String|创建服务器时抽取Url路径文件的存储路径|-|
|descInclude|Array|调用接口时展示接口文档的白名单|-|
|override|Boolean|重启服务时是否重新刷新数据|false|

## 代码架构

代码采用 typescript。
代码校验：ESLint

## 项目命令

npm run dev: 执行Demo,可热更新，使用VSCode来调试开发即可
npm run build: 打包编译
npm run test: 运行单元测试js
