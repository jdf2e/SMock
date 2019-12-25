"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validParam(params, data) {
    let result = '';
    let errorRequired = validRequired(params, data);
    let errorType = validType(params, data);
    if (errorRequired.length > 0) {
        result += `【${errorRequired.join('、')}】必须传入`;
    }
    if (errorType.length > 0) {
        result += `
            【${errorType.join('、')}】传入类型错误
            `;
    }
    return result;
}
exports.validParam = validParam;
//校验必填
function validRequired(inParams, data) {
    let error = [];
    if (!data.params)
        return error;
    for (let idx = 0; idx < data.params.length; idx++) {
        let item = data.params[idx];
        if (item.required && !inParams[item.value]) {
            //检查传参中是不是存在必填项
            error.push(item.value);
        }
    }
    return error;
}
//校验入参格式
function validType(inParams, data) {
    let error = [];
    if (!data.params)
        return error;
    for (let prop in inParams) {
        let param = getParamByName(prop, data.params);
        if (!param)
            return error;
        if (typeof inParams[prop] != param.type) {
            //如果类型为int，但url的方式传参会自动转换为字符串，我们要转换
            console.log(param.type, inParams[prop], isNaN(parseInt(inParams[prop])));
            if (!(param.type == 'integer' && !isNaN(parseInt(inParams[prop])))) {
                error.push(param.value);
            }
        }
    }
    return error;
}
//获取对应参数的值
function getParamByName(key, params) {
    let result = null;
    for (let idx = 0; idx < params.length; idx++) {
        let param = params[idx];
        if (key === param.value) {
            result = param;
        }
    }
    return result;
}
