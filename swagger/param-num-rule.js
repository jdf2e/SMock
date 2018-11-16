//判断一个数组是否包含另一个数组
function  isInclude(ary0, ary1) {
    var itemAry = [];

    ary0.forEach(function(p1) {
        if(ary1.indexOf(p1) !== -1){
            itemAry.push(p1)     
        }
    })

    if(itemAry.length === ary0.length){
        return true;
    } else {
        return false;
    }
}

module.exports = {
    isInclude
};