"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./../base/base");
const utils_1 = require("./../utils/utils");
const dict_1 = require("./../utils/dict");
const describe_1 = require("./describe");
const valid_1 = require("./valid");
let express = require('express');
var bodyParser = require("body-parser");
let axios = require('axios');
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
class Server extends base_1.Base {
    constructor(opts, data) {
        super(opts, data);
    }
    //启动服务
    startServer(cal) {
        app.listen(this.option.mockPort, () => {
            if (cal)
                cal(); //启动成功
            this.addStatic();
        });
    }
    // 托管静态页面，如接口描述页等
    addStatic() {
        app.use(express.static(utils_1.join(__dirname, './../html')));
    }
    // 注入接口
    addAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let desc = new describe_1.Describe(this.option, this.data);
            let data = this.data;
            return yield new Promise((resolve, reject) => {
                app.get('/desc/:id', function (req, res) {
                    let id = req.params.id;
                    res.send(desc.createHtml(id));
                });
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    let realUrl = utils_1.dealUrl(element.url);
                    app[element.type](realUrl, function (req, res) {
                        res.header("Access-Control-Allow-Origin", req.headers.origin);
                        res.header('Access-Control-Allow-Credentials', true); //告诉客户端可以在HTTP请求中带上Cookie
                        res.header("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, " +
                            "Last-Modified, Cache-Control, Expires, Content-Type, Content-Language, Cache-Control, X-E4M-With,X_FILENAME");
                        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
                        res.header("X-Powered-By", ' 3.2.1');
                        res.header("Content-Type", "application/json;charset=utf-8");
                        //创建接口描述页面
                        let descUrl = desc.getDescribeHtmlUrl(element.id);
                        utils_1.log('调用接口的文档链接：' + descUrl);
                        if (self.isInclude(element.id, self.option.descInclude)) {
                            desc.openAPIDesc(descUrl);
                        }
                        let params = self.getParamByType(req);
                        let errMsg = valid_1.validParam(params, element);
                        if (errMsg === '') {
                            let fileUrl = utils_1.join2(process.cwd(), dict_1.mockDirName, element.id + ".json");
                            res.send(require(fileUrl));
                        }
                        else {
                            res.send(`
    ${errMsg}
    接口描述参考：${descUrl}
                        `);
                        }
                    });
                }
                resolve();
            });
            // return 1;
            //TODO: 注入SMock的接口服务
        });
    }
    getParamByType(req) {
        let params = {};
        if (req.params) {
            params = Object.assign(params, req.params);
        }
        if (req.query) {
            params = Object.assign(params, req.query);
        }
        if (req.body) {
            params = Object.assign(params, req.body);
        }
        return params;
    }
    isInclude(urlId, includes) {
        let exist = false;
        exist = includes.indexOf(urlId) > -1;
        return exist;
    }
    //获取数据
    fetchData(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            // let swaggerUtl = getHost(opts.url);
            return yield new Promise((resolve, reject) => {
                let header = {};
                for (let prop in self.option.headers) {
                    header(prop, self.option.headers[prop]);
                }
                axios({
                    url: opts.url,
                    headers: header
                })
                    .then((data) => {
                    resolve(data.data);
                });
            });
        });
    }
}
exports.Server = Server;
