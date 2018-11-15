/** 
 * 参数类型验证
 * author: liaoyanli
 */
let utils = require('./utils');
let modelJS = require('./../swagger/model');
//params 入参，checkObj 验证对象
function validate(params, rules, GlobalDefinitions) {
    let errCount = 0; //类型不正确计数
    let more = []; //多余的参数
    let newRules = '';
    if (rules && (rules.length > 0) && (rules[0].in == 'body')) {
        let modelKey = rules[0].schema.$ref;
        let tempkey = utils.queryData(modelKey);
        newRules = modelJS.dealModel(GlobalDefinitions[tempkey], GlobalDefinitions, tempkey); //不要放到里面去循环
    }

    for (let key in params) {
        let arr = [];
        let paramType = typeof params[key];


        //入参为query类型
        if (rules && (rules.length > 0) && (rules[0].in == 'query')) {
            arr = rules.filter((item) => {
                return (item.name == key) && (item.in == 'query');
            });
            if (arr.length > 0) {
                if (paramType == 'object' || paramType == 'function' || paramType == 'undefined') {
                    utils.error(`请求参数${key}数据类型不正确，应该为${arr[0].type}`);
                    errCount++;
                }
            } else {
                more.push(key);
            }
        }

        //入参为body类型
        if (rules && (rules.length > 0) && (rules[0].in == 'body')) {
            if (newRules[key]) {
                let ruleType = typeof newRules[key];
                if (ruleType != paramType) {
                    utils.error(`请求参数${key}数据类型不正确，应该为${ruleType}`);
                    errCount++;
                }
            } else {
                more.push(key);
            }
        }
    }
    if (more.length > 0) {
        utils.log(`传入了多余的请求参数：${more.join(',')}`);
    }
    return errCount == 0;
}



module.exports = {
    validate
}