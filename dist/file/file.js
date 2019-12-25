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
const dict_1 = require("./../utils/dict");
const utils_1 = require("./../utils/utils");
const log_1 = require("./../model/log");
class File extends base_1.Base {
    constructor(opts, data) {
        super(opts, data);
    }
    //创建JSON文件
    createJSONFile() {
        return __awaiter(this, void 0, void 0, function* () {
            let filePromise = [];
            let customFileDir = utils_1.join(process.cwd(), dict_1.mockDirName); //默认mock相关文件目录名
            utils_1.createDir(customFileDir);
            for (let fileIndex = 0; fileIndex < this.data.length; fileIndex++) {
                let item = this.data[fileIndex];
                let data = JSON.stringify(item.data);
                let fileUrl = utils_1.join2(process.cwd(), dict_1.mockDirName, item.id + ".json");
                filePromise.push(utils_1.makeFileSync(fileUrl, data));
            }
            Promise.all(filePromise).then((data) => {
                return;
            });
        });
    }
    // 创建URL文件
    createUrlFile() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                let option = this.option, urlDatas = this.data;
                let jsContent = this.customJsTpl(urlDatas);
                let customFileDir = utils_1.join(process.cwd(), dict_1.mockDirName); //默认mock相关文件目录名
                let jsFilePath = utils_1.join2(process.cwd(), dict_1.mockDirName, `${dict_1.urlsRealName}.js`); //默认生成位置，如果用户配置则生成至用户配置的位置
                if (option.jsPath) {
                    //用户如果有自定义文件目录，则需要生成至用户自定义目录
                    customFileDir = utils_1.join(process.cwd(), option.jsPath);
                    if (!utils_1.existsSync(customFileDir))
                        return utils_1.error(log_1.jsPathError);
                    jsFilePath = utils_1.join(customFileDir, `${dict_1.urlsRealName}.js`);
                }
                utils_1.createDir(customFileDir);
                utils_1.makeFileSync(jsFilePath, jsContent); //生成一个js文件
                let jsonFilePath = utils_1.join2(process.cwd(), dict_1.mockDirName, `${dict_1.urlsRealName}.json`); //生成一个json文件，只有全部url
                let jsonContent = utils_1.toStr(this.jsonDeal(urlDatas)); //将要写入文件的内容串
                utils_1.makeFileSync(jsonFilePath, jsonContent); //生成一个json文件只有url
                resolve();
            });
        });
    }
    //根据用户定义的参数，生成指定格式的url聚合文件
    customJsTpl(data) {
        let tpl = require('./urlTpl'), option = this.option, host = option.realHostName;
        return tpl.getTpl(data, option.mockPort, host);
    }
    //处理json数据
    jsonDeal(urls) {
        let pathKey = '', obj = {};
        for (let key in urls) {
            let item = urls[key];
            pathKey = item.id;
            obj[pathKey] = {
                url: item.url,
                type: item.type
            };
        }
        return obj;
    }
}
exports.File = File;
