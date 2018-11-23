/** 
 * 处理数据模型 
 * author: liaoyanli
 */
let utils = require('./../common/utils');
let mockjs = require('./../common/mockjs');

//递归替换
function dealModel(definitions, GlobalDefinitions, prevKey) {
    let result = {};
    let type = definitions && definitions.type ? definitions.type : '';
    if (type) {
        if (type == 'string') {
            result = mockjs.setString();
        }
        if (type == 'integer') {
            result = mockjs.setInteger();
        }
        if (type == 'boolean') {
            result = mockjs.setBoolean();
        }
        if (type == 'object') {
            if (definitions.properties) {
                result = definitions.properties;
                for (let key in result) {
                    //防止递归数据造成死循环
                    if (result[key].type && result[key].type == 'array' && result[key].items['$ref'] && (utils.queryData(result[key].items['$ref']) == prevKey)) {
                        result[key] = {};
                    } else {
                        result[key] = dealModel(result[key], GlobalDefinitions, key);
                    }

                }
            } else {
                result = {};
            }
        }
        if (type == 'array') {
            let items = definitions.items;
            if (items.type) {
                dealModel(items, GlobalDefinitions);
            } else {
                let objkey = utils.queryData(definitions.items['$ref']);
                //防止递归数据造成死循环
                if (objkey != prevKey) {
                    result = [dealModel(GlobalDefinitions[objkey], GlobalDefinitions, objkey)];
                } else {
                    result = {};
                }

            }

        }
    } else {
        let goObject = definitions['$ref'] ? definitions['$ref'] : '';
        if (goObject) {
            let objkey = utils.queryData(goObject);
            result = dealModel(GlobalDefinitions[objkey], GlobalDefinitions);
        } else {
            result = mockjs.setString();
        }

    }
    return result;
}

module.exports = {
    dealModel
}