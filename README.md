<div align="center">
  <h1>smock-webpack-plugin</h1>
  <p>SMock的webpack插件</p>
</div>

本webpack插件功能：
分析需要mock的文档，例如swagger文档，输出相应的mock数据，并启动node服务，供前端开发时调试使用，提高前端开发效率，支持跨域访问


### 安装

```bash
npm install smock-webpack-plugin --save-dev
```

### 调用

```bash
const Smock = require('smock-webpack-plugin');

plugins: [
    new Smock({
        host:'',
        domain:'',
        projectName:''
    })
]

```

### 参数说明

|Attributes|forma|describe
|---|---|---|
|host| string| 需要mock的文档地址ip或者域名
|domain|string| 需要mock的文档访问域名。一般和host配合使用，如果文档是IP不能直接访问的形式，那么此处需要传入相应的值
|projectName| string| 项目名，默认值swaggermock
