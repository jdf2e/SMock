/** 
 * Swagger处理数据模型 
 * author: Yang Lei
 */
import { log } from './../../utils/utils';
import {setString, setInteger, setBoolean } from './../../utils/mock';
interface Definition {
    prevKey: String;
    definition: any; //当前数据格式
    definitionMap: any;//全部数据格式Map
}
//数据查找路径，针对swagger返回数据的特殊处理
function queryData(hash: any) {
    let result = '';
    if(hash) {
        result = (hash.substring(2, hash.length)).split('/');
    }
    return result[1] || '';
}

//递归替换
export async function dealData(def: Definition): Promise<any> {
    let result: any = {};
    //保存接口返回参数的描述
    let desc: any = [];
    let definition =def.definition;
    let type = definition && definition.type ? definition.type : '';
    if (type) {
        if (type == 'string') {
            result = setString();
            let varDesc:any = {};
            varDesc.key = def.prevKey;
            varDesc.desc = definition.description || '暂无定义';
            varDesc.type = definition.type;
            desc.push(varDesc);
        }
        if (type == 'integer') {
            result = setInteger();
            let varDesc:any = {};
            varDesc.key = def.prevKey;
            varDesc.desc = definition.description || '暂无定义';
            varDesc.type = definition.type;
            desc.push(varDesc);
        }
        if (type == 'boolean') {
            result = setBoolean();
            let varDesc:any = {};
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
                    } else {
                        dealData({
                            prevKey: key,
                            definition: result[key],
                            definitionMap: def.definitionMap
                        }).then((data) => {
                            result[key] = data.data;
                            desc = desc.concat(data.desc);
                        })
                    }
                }
            } else {
                result = {};
            }
        }
        if (type == 'array') {
            let items = def.definition.items;
            if (items.type) {
            } else {
                let objKey: string = queryData(items['$ref']);
                //防止递归数据造成死循环
                if (objKey != def.prevKey) {
                    dealData({
                        prevKey: objKey,
                        definition: def.definitionMap[objKey],
                        definitionMap: def.definitionMap
                    }).then((data) => {
                        result = data.data;
                        desc = desc.concat(data.desc);
                    })
                } else {
                    result = {};
                }
            }
        }
    } else {
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
            })
        } else {
            result = setString();
        }
    }
    return {
        data: result,
        desc: []
    }
}
//解析API参数
export function getParamData(params:any, definitions:any):any {
    let result = [];
    for(let i = 0; i < params.length; i++) {
        let param = params[i];
        let p: any = {};     
        if(param.schema) {
            p.type = 'object';
            p.value = param.name;
            if(param.schema['$ref']){
                p.child = getParamSchemaData(param.schema['$ref'], definitions);
            }else {
                p.type = param.schema.type;
            }
            p.required = param.required;
        }else {
            p.type = param.type? param.type: 'string';
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

function getParamSchemaData(key:string, definitionMap: any):any {
    let validResult:any = [];
    let defineKey = queryData(key);
    let props = definitionMap[defineKey].properties;
    for( let key in props) {
        let prop = props[key];
        let validItem:any = {};
        if(prop.$ref) {
            validItem.type = 'object';
            validItem.desc = prop.description;
            validItem.param = getParamSchemaData(prop.$ref, definitionMap);
        }else {
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
export function getJsonDataKey(responses: any):any {
    let schema = responses['200'].schema;
    let mockJsonKey = schema ? schema['$ref'] : '';
    return queryData(mockJsonKey);
}
