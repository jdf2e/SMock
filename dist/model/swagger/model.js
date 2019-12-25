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
const mock_1 = require("./../../utils/mock");
//数据查找路径，针对swagger返回数据的特殊处理
function queryData(hash) {
    let result = '';
    if (hash) {
        result = (hash.substring(2, hash.length)).split('/');
    }
    return result[1] || '';
}
//递归替换
function dealData(def) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = {};
        //保存接口返回参数的描述
        let desc = [];
        let definition = def.definition;
        let type = definition && definition.type ? definition.type : '';
        if (type) {
            if (type == 'string') {
                result = mock_1.setString();
                let varDesc = {};
                varDesc.key = def.prevKey;
                varDesc.desc = definition.description || '暂无定义';
                varDesc.type = definition.type;
                desc.push(varDesc);
            }
            if (type == 'integer') {
                result = mock_1.setInteger();
                let varDesc = {};
                varDesc.key = def.prevKey;
                varDesc.desc = definition.description || '暂无定义';
                varDesc.type = definition.type;
                desc.push(varDesc);
            }
            if (type == 'boolean') {
                result = mock_1.setBoolean();
                let varDesc = {};
                varDesc.key = def.prevKey;
                varDesc.desc = definition.description || '暂无定义';
                varDesc.type = definition.type;
                desc.push(varDesc);
            }
            if (type == 'object') {
                if (definition.properties) {
                    result = definition.properties;
                    for (let key in result) {
                        //防止递归数据造成死循环
                        if (result[key].type && result[key].type == 'array' && result[key]['$ref'] && (queryData(result[key]['$ref']) == def.prevKey)) {
                            result[key] = {};
                        }
                        else {
                            dealData({
                                prevKey: key,
                                definition: result[key],
                                definitionMap: def.definitionMap
                            }).then((data) => {
                                result[key] = data.data;
                                desc = desc.concat(data.desc);
                            });
                        }
                    }
                }
                else {
                    result = {};
                }
            }
            if (type == 'array') {
                let items = def.definition.items;
                if (items.type) {
                }
                else {
                    let objKey = queryData(items['$ref']);
                    //防止递归数据造成死循环
                    if (objKey != def.prevKey) {
                        dealData({
                            prevKey: objKey,
                            definition: def.definitionMap[objKey],
                            definitionMap: def.definitionMap
                        }).then((data) => {
                            result = data.data;
                            desc = desc.concat(data.desc);
                        });
                    }
                    else {
                        result = {};
                    }
                }
            }
        }
        else {
            let goObject = def.definition && def.definition['$ref'] ? def.definition['$ref'] : '';
            if (goObject) {
                let objKey = queryData(goObject);
                dealData({
                    prevKey: objKey,
                    definition: def.definitionMap[objKey],
                    definitionMap: def.definitionMap
                }).then((data) => {
                    result = Object.assign(result, data.data);
                    desc = desc.concat(data.desc);
                });
            }
            else {
                result = mock_1.setString();
            }
        }
        return {
            data: result,
            desc: []
        };
    });
}
exports.dealData = dealData;
//解析API参数
function getParamData(params, definitions) {
    let result = [];
    for (let i = 0; i < params.length; i++) {
        let param = params[i];
        let p = {};
        if (param.schema) {
            p.type = 'object';
            p.value = param.name;
            if (param.schema['$ref']) {
                p.child = getParamSchemaData(param.schema['$ref'], definitions);
            }
            else {
                p.type = param.schema.type;
            }
            p.required = param.required;
        }
        else {
            p.type = param.type ? param.type : 'string';
            p.value = param.name;
            p.required = param.required;
        }
        p.in = param.in;
        p.required = param.required;
        p.desc = param.description;
        result.push(p);
    }
    return result;
}
exports.getParamData = getParamData;
function getParamSchemaData(key, definitionMap) {
    let validResult = [];
    let defineKey = queryData(key);
    let props = definitionMap[defineKey].properties;
    for (let key in props) {
        let prop = props[key];
        let validItem = {};
        if (prop.$ref) {
            validItem.type = 'object';
            validItem.desc = prop.description;
            validItem.param = getParamSchemaData(prop.$ref, definitionMap);
        }
        else {
            validItem.name = key;
            validItem.type = prop.type;
            validItem.desc = prop.description;
        }
        validResult.push(validItem);
    }
    return validResult;
    // definitionMap[key];
}
//获取json数据的key
function getJsonDataKey(responses) {
    let schema = responses['200'].schema;
    let mockJsonKey = schema ? schema['$ref'] : '';
    return queryData(mockJsonKey);
}
exports.getJsonDataKey = getJsonDataKey;
