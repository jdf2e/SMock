"use strict";
/**
 *
 * 使用Swagger时，处理数据的文件
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../../server/server");
const utils_1 = require("../../utils/utils");
const model_1 = require("./model");//Swagger处理数据模型 
const mock_1 = require("./../../utils/mock");
let clone = require('clone');
class Swagger {
    constructor(opts) {
        this.config = utils_1.dealConfig(opts);
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let d;
            yield self.getDataFromServer()
                .then((data) => {
                    d = self.convertData(clone(data));
                });
            return d;
        });
    }
    getDataFromServer() {
        return __awaiter(this, void 0, void 0, function* () {
            let server = new server_1.Server(this.config);
            let result;
            let url = `${this.config.customProtocol}://${this.config.docPath}:${this.config.docPort}${this.config.path}`;
            console.log(url, 'swagger');

            yield server.fetchData({
                url: url
            })
                .then((data) => {
                    console.log(data, 'swagger1');
                    result = data;
                });
            return result;
        });
    }
    convertData(data) {
        console.log(data, 'swagger');

        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                let allDealDataPromises = [];
                // 格式规划
                let apis = data.paths;
                let definitions = data.definitions;
                let result = [];
                for (let prop in apis) {
                    let d = {};
                    let item = apis[prop];
                    d.url = prop;
                    // if(d.url != '/api/service/{serviceId}') continue;
                    let dataModelFlag = '';
                    for (let type in item) {
                        // let descs:any = [];
                        d.type = type;
                        d.id = item[type].operationId;
                        d.desc = item[type].summary;

                        dataModelFlag = model_1.getJsonDataKey(item[type].responses);
                        if (dataModelFlag) {
                            let promise = model_1.dealData({
                                prevKey: dataModelFlag,
                                definition: definitions[dataModelFlag],
                                definitionMap: definitions
                            }).then((data) => {
                                d.data = data.data;
                                d.responseDesc = data.desc;
                                if (!utils_1.keyInData(item[type].operationId, result)) {
                                    result.push(d);
                                }
                            }).then((err) => {
                                console.log(err, 'swagger-err');

                            }).catch((err) => {
                                console.log(err, 'swagger-err');
                            });
                            console.log(promise, 'promise');

                            allDealDataPromises.push(promise);
                        }
                        else {
                            d.data = mock_1.setString();
                            if (!utils_1.keyInData(item[type].operationId, result)) {
                                result.push(d);
                            }
                        }
                        if (item[type].parameters) {
                            d.params = model_1.getParamData(item[type].parameters, definitions);
                        }
                        else {
                            d.params = null;
                        }
                    }
                }
                Promise.all(allDealDataPromises).then(() => {
                    resolve(result);
                });
            });
        });
    }
}
exports.Swagger = Swagger;
