<div align="center">
  <h1>JDCFE SMock</h1>
</div>

## 简介
>分析需要mock的文档，例如swagger文档，输出相应的mock数据，并启动node服务，供前端开发时调试使用，提高前端开发效率，支持跨域访问

<video src="https://jdvod.300hu.com/4c1f7a6atransbjngwcloud1oss/1610597a113300169256079361/v.f30.mp4" width="100%" height="640" controls="controls">
Your browser does not support the video tag.
</video>

## 快速开始

### 安装
> 使用 NPM 需要提前安装好 [Node.js](https://nodejs.org/en/)
```bash
npm install jdcfe-smock -g
```
### 创建配置文件

1. 在对应的项目根目录下执行smock init命令
```bash
smock init
```
<img src="//img30.360buyimg.com/uba/jfs/t1/3524/29/8582/115957/5ba9fb4dEc4b4bc92/1a959e4c729ffb8e.png" alt="">

2. 按照提示输入相应的配置，如果不知道请一路填空，init命令执行完成后，所在项目会自动生成一个名为SMock.json的配置文件<br>
   
<img src="//img30.360buyimg.com/uba/jfs/t1/237/40/8780/85097/5ba9fb4dE3c9a3211/f3c1245569a0d899.png" alt="">

3. 检查SMock.json里的配置是否正确，如果默认配置项不够，可阅读下面的配置参数说明表格，并添加配置项  todo哪些是必传的<br>

<img src="//img20.360buyimg.com/uba/jfs/t1/2404/26/8621/86299/5ba9fc51Ed55709cc/7ff83d96cf6a48f3.png" alt="">

4. 启动服务 todo哪些是必传的
```bash
smock run
```
如果参数配置没有问题，可以正常启动，那么在相应的项目中可以看到多出了一个文件夹。命名是options.projectName+'mock'，同时开启了配置端口的服务,如下图所示：

<img src="//img14.360buyimg.com/uba/jfs/t1/3093/12/8740/149983/5ba9fb4dE8cb56269/1a17bcb3a896b120.png" alt="">

5. 调试运用    
访问如下形式的host地址，即可看到模拟数据,端口默认为3000，可配置为其他值。如下链接所示：<br>
http://127.0.0.1:3000/xxx/xxx/xxx.do/

<img src="//img11.360buyimg.com/uba/jfs/t1/1890/5/8717/227920/5ba9fb4dE96cf8785/22ebc27582f91df8.png" alt=""><br>
所有的接口路径请求，都生成在${projectName}/urlsReal.js里，可直接应用于项目中作为请求后台数据的链接使用。<br>
```js
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.SMOCK = {})));
}(this, (function(exports) { 'use strict';
    var isDebug = (window.location.href).indexOf('debug') > -1;
    var host = isDebug?'127.0.0.1:4000':'111.206.228.111';
    var url = {
        'sayHiUsingGET': {
            url: host + '/hi',
            type: 'get'
        },
    }
    exports.idDebug = isDebug;
    exports.host = host;
    exports.url = url;
    Object.defineProperty(exports, '__esModule', { value: true });
})))
```

## 配置文件
>通过快速开始我们默认生成了配置文件，这里提供了对配置文件参数的描述，满足使用者在不同情况下的需求

### 文件格式
- .json<br>
例如：
```
SMock.json
```

### 配置项
|属性名|类型|描述
|---|---|---|
|host| String| 需要mock的文档地址ip或者域名
|domain|String| 需要mock的文档访问域名。一般和host配合使用，如果文档是IP不能直接访问的形式，那么此处需要传入相应的值
|path|String| 需要mock的文档数据请求路径，在swagger文档页面可以找到，如：/v2/api-docs
|port| integer| 需要mock的文档地址端口号， 默认80，如果协议配置为https，此参数则变为443
|jsPath| String| 程序运行起来之后自动生成URL整合文件的输入路径
|projectName| String| 项目名，默认值swaggermock
|mockPort| String| 本地mock服务启动后的端口，默认为3000
|customProtocol| String| swagger文档支持的协议请求 http/https
|override| boolean|是否每次启动服务都覆盖原有json数据文件，默认为false，不覆盖

### SMock命令文档
| 命令文档 | 描述
| ---| ---
| smock init | 初始化SMock的配置文件，可快速配置SMock的必填参数，并创建创实话文件。
| smock run | 启动SMock服务，并抓取接口URL输出到jsPath配置的路径下。
| smock run -o| 启动SMock服务，并抓取接口URL输出到jsPath配置的路径下，不管配置项中的override配置为任何值，在启动服务之前强制覆盖所有的模拟文件数据。
| smock -version | 现在SMock版本号
| smock -help | 展示SMock帮助文档

## 生成的模板
### 运行

启动SMock没有位置限制，可在项目根目录下也可在任何路径启动，执行以下命令：

```bash
smock run
```
<img src="http://img13.360buyimg.com/uba/jfs/t26611/110/1585181953/26635/35b59371/5be6858cNc1bc63df.png" alt="">

如上图启动的服务host和请求链接，例如：http://127.0.0.1:3000/xxx/xxx/xxx.do ,这样就可以直接请求swagger中配置的数据。

### 模板说明
所有的接口路径请求，都生成在${projectName}/urlsReal.js里,并且可以通过在访问链接里配置isDebug关键字来切换访问后端线上和测试的环境，生成的urlsReal.js文件可以通过jsPath来指定输出的位置，如配置输出路径不会影响demo文件夹下urlsReal的完整性。

具体urlsReal.js文件格式如下：
```
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.SMOCK = {})));
}(this, (function(exports) { 'use strict';
    var isDebug = (window.location.href).indexOf('debug') > -1;
    var host = isDebug?'127.0.0.1:4000':'111.206.228.111';
    var url = {
        'sayHiUsingGET': {
            url: host + '/hi',
            type: 'get'
        },    
    }
    exports.idDebug = isDebug;
    exports.host = host;
    exports.url = url;

    Object.defineProperty(exports, '__esModule', { value: true });

})))
```
导出的URL提供了一下三个参数：
- isDebug： 是否为测试环境。
- host： 当前使用的host，根据isdebug来动态变换。
- url: 整个系统中所有的url数据：

    每个url数据对象包括：
    - url：接口使用的API
    - type: 接口的请求类型

## Webpack插件

当前项目技术选型vue与React偏多，并且依赖于Webpack，因SMock也会启动服务，所以我们把SMock与Webpack进行了整合，使其启动的服务并入到Webpack服务中，保证了项目只需要开启一个服务即可。

### 安装webpack插件

```javascript
npm install smock-webpack-plugin --save-dev
```

### Webpack中使用

引入之后，直接配置参数即可，参数具体可参考SMock的参数介绍，内容一致。
```javascript
const Smock = require('smock-webpack-plugin');
 
plugins: [
    new Smock({
        host:'',
        domain:'',
        projectName:''
    })
]
```