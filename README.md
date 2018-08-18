<div align="center">
  <h1>JD Swagger Mock</h1>
  <p>分析Swagger文档，输出相应的mock数据，并启动node服务，供前端开发时调试使用，提高前端开发效率，支持跨域访问</p>
</div>

### 安装

```bash
npm install --save-dev jdsmock
```

### 初始化SMock.json文件

<p>
1. 在对应的项目根目录下执行jdsmock init命令
2. 按照提示输入相应的配置，如果不知道请一路填空
3. 检查SMock.json里的配置是否正确
</p>

### 参数说明

|Attributes|forma|describe
|---|---|---|
|host| string| swagger文档地址ip,必填
|hostname|string| swagger文档访问域名，如果此处传入任何值，host字段则不生效
|path|string| swagger文档数据请求路径，在swagger文档页面可以找到
|port| integer| swagger文档地址端口号, 默认80
|projectName| string| 项目名，默认值swaggermock
|mockPort| string| 本地mock服务启动后的端口，默认为3001
|headers| object| 一般用于host的配置


### 运行

<p>
1. 在项目根目录下执行jdsmock run
2. 在项目中调用mock服务
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

# jdsmock
