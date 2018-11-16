/** 
 * 参数个数验证
 * author: yangjinjun
 */
let utils = require('jdcfe-smock/common/utils');

//判断一个数组是否包含另一个数组
function  isInclude(ary0, ary1) {
    let itemAry = [],
        lackParamsArr=[];

    ary0.forEach(function(p1) {
        if(ary1.indexOf(p1) !== -1){
            itemAry.push(p1);  
        } else {
            lackParamsArr.push(p1);
        }
    })

    if(itemAry.length === ary0.length){
        return true;
    } else {
        utils.log(`缺少必输参数${lackParamsArr.toString()}`);
        return false;
    }
}

module.exports = {
    isInclude
};