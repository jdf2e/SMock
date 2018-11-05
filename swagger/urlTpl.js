/**
 * js模板
 * author: yanglei
 */
let tpl = module.exports;
let urls, port, hostname;

function jsTpl() {
    let tpl =
        `
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.SMOCK = {})));
}(this, (function(exports) { 'use strict';
    ${hostTpl()}
    var url = {
        ${urlTpl()}
    }
${moduleTpl('urlModule')}
})))`;
    return tpl;
}
//创建host部分
function hostTpl() {
    let tpl = `var isDebug = (window.location.href).indexOf('debug') > -1;
    var host = isDebug?'127.0.0.1:${port}':'${hostname}';`;
    return tpl;
}
//创建url对象
function urlTpl() {
    let urlTpl = '';
    for (let key in urls) {
        urlTpl += `'${key}': {
            url: host + '${urls[key].url}',
            type: '${urls[key].type}'
        },
        `;
    }
    return urlTpl.substr(0, urlTpl.length - 1);
}

//创建模块依赖部分
function moduleTpl() {
    let moduleTpl = `
    exports.idDebug = isDebug;
    exports.host = host;
    exports.url = url;

    Object.defineProperty(exports, '__esModule', { value: true });
`
    return moduleTpl;
}

tpl.getTpl = function(_urls, _port, _hostname) {
    urls = _urls;
    port = _port;
    hostname = _hostname;
    return jsTpl();
}