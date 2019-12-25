
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.SMOCK = {})));
}(this, (function(exports) { 'use strict';
    var isDebug = (window.location.href).indexOf('debug') > -1;
    var host = isDebug?'//127.0.0.1:3000':'//192.168.128.83';
    var restfulURL = function(url, param) {
        let result = url;
        for(var prop in param) {
            result = result.replace('{'+prop+'}', param[prop]);
        }
        return result;
    }
    var url = {
        'getBannersUsingGET': {
            url: host + '/stryview/v1/banner',
            type: 'get'
        },'getProjectProgressUsingGET': {
            url: host + '/stryview/v1/jobProgress',
            type: 'get'
        },'loginInfoUsingGET': {
            url: host + '/stryview/v1/loginInfo',
            type: 'get'
        },'menusUsingGET': {
            url: host + '/stryview/v1/menus',
            type: 'get'
        },'getMyStrategyUsingGET': {
            url: host + '/stryview/v1/myStrategyHouse',
            type: 'get'
        },'strategyUsingPOST': {
            url: host + '/stryview/v1/strategy',
            type: 'post'
        },'strategy01UsingPOST': {
            url: host + '/stryview/v1/strategy01',
            type: 'post'
        },'strategy02UsingPOST': {
            url: host + '/stryview/v1/strategy02',
            type: 'post'
        },'strategy03UsingPOST': {
            url: host + '/stryview/v1/strategy03',
            type: 'post'
        },'strategy04UsingPOST': {
            url: host + '/stryview/v1/strategy04',
            type: 'post'
        },'strategy05UsingPOST': {
            url: host + '/stryview/v1/strategy05',
            type: 'post'
        },'strategy06UsingPOST': {
            url: host + '/stryview/v1/strategy06',
            type: 'post'
        },'strategy07UsingPOST': {
            url: host + '/stryview/v1/strategy07',
            type: 'post'
        },'getStrategyUsingGET': {
            url: host + '/stryview/v1/strategyHouse',
            type: 'get'
        },'strategyHouseNavUsingGET': {
            url: host + '/stryview/v1/strategyHouseNav',
            type: 'get'
        },'strategyHouseUserUsingGET': {
            url: host + '/stryview/v1/strategyHouseUser',
            type: 'get'
        },'saveStrategyPmoUsingPOST': {
            url: host + '/stryview/v1/strategyPmo',
            type: 'post'
        },'deleteStrategyUserUsingDELETE': {
            url: host + '/stryview/v1/strategyUser',
            type: 'delete'
        },'deleteStrategyUserUsingDELETE': {
            url: host + '/stryview/v1/strategyUser',
            type: 'delete'
        },'getStrategyUserRoleUsingGET': {
            url: host + '/stryview/v1/strategyUserRole',
            type: 'get'
        },'getStrategyWinDataUsingGET': {
            url: host + '/stryview/v1/strategyWin',
            type: 'get'
        },'getStrategyWinNavUsingGET': {
            url: host + '/stryview/v1/strategyWinNav',
            type: 'get'
        },'subDeptUsingGET': {
            url: host + '/stryview/v1/subDept',
            type: 'get'
        },'switchStrategyUsingPOST': {
            url: host + '/stryview/v1/switchStrategyHouse',
            type: 'post'
        },'saveTimeLineUsingPOST': {
            url: host + '/stryview/v1/timeLine',
            type: 'post'
        },'userUsingGET': {
            url: host + '/stryview/v1/user',
            type: 'get'
        },'yesOrNoUsingGET': {
            url: host + '/stryview/v1/yesOrNo',
            type: 'get'
        }
    }

    exports.isDebug = isDebug;
    exports.host = host;
    exports.url = url;
    exports.restfulURL = restfulURL;

    Object.defineProperty(exports, '__esModule', { value: true });

})))