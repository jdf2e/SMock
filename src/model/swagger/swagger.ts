/**
 * 
 * 使用Swagger时，处理数据的文件
 */

import { Config, Data } from '../dataModel';
import { Server } from '../../server/server'
import { dealConfig, log, keyInData } from '../../utils/utils';
import { dealData, getJsonDataKey, getParamData } from './model';
import { setString } from './../../utils/mock';
// 一个npm 包
let clone = require('clone');
class Swagger {
    config: Config;
    constructor(opts: Config) {
        this.config = dealConfig(opts);
    }
    async getData(): Promise<Object> {
        let self = this;
        let d;
        await self.getDataFromServer()
            .then((data: any) => {
                d = self.convertData(clone(data));
                console.log(d, data);

            })
        return d;
    }
    // 从swagger中拿到数据
    async getDataFromServer(): Promise<Object> {
        let server = new Server(this.config);
        let result;
        let url = `${this.config.customProtocol}://${this.config.docPath}:${this.config.docPort}${this.config.path}`;
        await server.fetchData(
            {
                url: url
            }
        )
            .then((data) => {
                // console.log(data);
                result = data;
            })
        return result;
    }
    // 转化数据
    async convertData(data: any): Promise<any> {
        return await new Promise((resolve, reject) => {
            let allDealDataPromises = [];
            // 格式规划
            let apis = data.paths;
            let definitions = data.definitions;
            let result: any[] = [];
            for (let prop in apis) {
                let d: Data = {};
                let item = apis[prop];
                d.url = prop;
                // if(d.url != '/api/service/{serviceId}') continue;
                let dataModelFlag = '';
                for (let type in item) {
                    // let descs:any = [];
                    d.type = type;
                    d.id = item[type].operationId;
                    d.desc = item[type].summary;
                    dataModelFlag = getJsonDataKey(item[type].responses);
                    if (dataModelFlag) {
                        let promise = dealData({
                            prevKey: dataModelFlag,
                            definition: definitions[dataModelFlag],
                            definitionMap: definitions
                        }).then((data) => {
                            d.data = data.data;
                            d.responseDesc = data.desc;

                            if (!keyInData(item[type].operationId, result)) {
                                result.push(d);
                            }
                        }).then((err) => {
                        }).catch((err) => {

                        });
                        allDealDataPromises.push(promise);
                    } else {
                        d.data = setString();
                        if (!keyInData(item[type].operationId, result)) {
                            result.push(d);
                        }
                    }
                    if (item[type].parameters) {
                        d.params = getParamData(item[type].parameters, definitions);
                    } else {
                        d.params = null;
                    }
                }
            }
            Promise.all(allDealDataPromises).then(() => {
                resolve(result);
            })
        })
    }
}
export { Swagger };