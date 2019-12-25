"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = require("./model/swagger/swagger");
const file_1 = require("./file/file");
const server_1 = require("./server/server");
const utils_1 = require("./utils/utils");
const log_1 = require("./model/log");
class Core {
  constructor(opts) {
    // let config = Config;
    this.options = Object.assign({
      type: 'swagger',
      docPath: '',
      docPort: 80,
      path: '/v2/api-docs',
      method: 'GET',
      realHostName: '',
      mockPort: 3000,
      customProtocol: 'http',
      headers: {},
      jsPath: '',
      descInclude: [],
      override: false
    }, opts);
    //确保地址存在
    if (this.options.docPath == "") {
      utils_1.log(log_1.docPathError);
      return;
    }
    //不同类型跳转到不同数据层
    switch (this.options.type) {
      case 'swagger':
        let swagger = new swagger_1.Swagger(this.options);
        console.log(swagger, swagger.getData(), 'hello');
        // 这里为什么一直是pending状态
        this.dataPromise = swagger.getData();
        break;
    }
    this.workflow();
    process.on('unhandledRejection', (error) => {
      console.error('unhandledRejection', error);
      process.exit(1); // To exit with a 'failure' code
    });
  }
  // SMock主流程
  workflow() {

    this.dataPromise.then((data) => {
      console.log(data, 'hello');

      let process = [];
      this.data = data;
      //声明变量
      var server = new server_1.Server(this.options, this.data);
      if (!utils_1.isNew() && !this.options.override) {
      }
      else {
        let file = new file_1.File(this.options, this.data);
        //创建文件
        let filePromise = file.createJSONFile();
        process.push(filePromise);
        //创建URL
        let urlPromise = file.createUrlFile();
        process.push(urlPromise);
      }
      //插入接口
      let apiPromise = server.addAPI();
      process.push(apiPromise);
      //全部过程执行完毕，执行启动服务
      Promise.all(process).then(() => {
        server.startServer(() => {
          utils_1.log(`【${new Date()}】服务器启动!`);
          // log(`http://127.0.0.1:${this.options.mockPort}`);
        });
      });
    });
  }
}
exports.Core = Core;
