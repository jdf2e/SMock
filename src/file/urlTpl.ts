let urls: any, port: string, hostname: string;

export function getTpl(_urls: any, _port: string, _hostname: string) {
	urls = _urls;
	port = _port;
	hostname = _hostname;
	let tpl = `
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.SMOCK = {}));
}(this, (function(exports) { 'use strict';
    ${hostTpl()}
    ${restfulTpl()}
    var url = {
        ${urlTpl()}
    }
${moduleTpl()}
})))`;
	return tpl;
}

//创建host部分
function hostTpl() {
	let tpl = `var isDebug = (window.location.href).indexOf('debug') > -1;
    var host = isDebug?'//127.0.0.1:${port}':'//${hostname}';`;
	return tpl;
}

//创建RESTful函数
function restfulTpl() {
    let tpl = `var restfulURL = function(url, param) {
        let result = url;
        for(var prop in param) {
            result = result.replace('{'+prop+'}', param[prop]);
        }
        return result;
    }`
    return tpl;
}

//创建url对象
function urlTpl() {
	let urlTpl = '';
	for (let key in urls) {
		urlTpl += `'${urls[key].id}': {
            url: host + '${urls[key].url}',
            type: '${urls[key].type}'
        },`;
	}
	return urlTpl.substr(0, urlTpl.length - 1);
}

//创建模块依赖部分
function moduleTpl() {
	let moduleTpl = `
    exports.isDebug = isDebug;
    exports.host = host;
    exports.url = url;
    exports.restfulURL = restfulURL;

    Object.defineProperty(exports, '__esModule', { value: true });
`;
	return moduleTpl;
}
