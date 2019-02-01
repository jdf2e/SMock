<div align="center">
  <h1>JDCFE SMock</h1>
  <p>分析需要mock的文档，例如swagger文档，输出相应的mock数据，并启动node服务，供前端开发时调试使用，提高前端开发效率，支持跨域访问</p>
</div>

### 安装

```bash
npm install jdcfe-smock -g
```

### 初始化SMock.json文件

<p>
1. 在对应的项目根目录下执行smock init命令<br>
2. 按照提示输入相应的配置，如果不知道请一路填空<br>
3. 检查SMock.json里的配置是否正确<br>
</p>

### 参数说明

|Attributes|forma|describe
|---|---|---|
|host| string| 需要mock的文档地址ip或者域名
|domain|string| 需要mock的文档访问域名。一般和host配合使用，如果文档是IP不能直接访问的形式，那么此处需要传入相应的值
|path|string| 需要mock的文档数据请求路径，在swagger文档页面可以找到，如：/v2/api-docs
|port| integer| 需要mock的文档地址端口号， 默认80，如果协议配置为https，此参数则变为443
|projectName| string| 项目名，默认值swaggermock
|mockPort| string| 本地mock服务启动后的端口，默认为3000
|customProtocol| string| swagger文档支持的协议请求 http/https
|override| boolean| 是否每次启动服务都覆盖原有json数据文件，默认为false，不覆盖

### 运行

<p>
1. 在项目根目录下执行smock run，也可以执行smock run -o，此种情况表示更新所有的模拟数据，请谨慎操作。<br>
2. 在项目中调用mock服务<br>
</p>

### 使用说明

<p>
访问如下形式的真实地址，即可看到模拟数据,端口默认为3000，可配置为其他值
</p>

```bash
http://127.0.0.1:3000/xxx/xxx/xxx.do
```

<p>
所有的接口路径请求，都生成在${projectName}/urlsReal.js里
</p>
