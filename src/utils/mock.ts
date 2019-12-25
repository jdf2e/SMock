/** 
 * 模拟数据动态化，引入mockjs.js来处理
 * author: liaoyanli
 */
let Mock = require('mockjs');
var Random = Mock.Random;
export function setString() {
    Random.word(3, 8);
    return Mock.mock('@word(3, 8)');
}

export function setBoolean() {
    Random.boolean();
    return Mock.mock('@boolean');
}

export function setInteger() {
    Random.integer(1, 100);
    return Mock.mock('@integer(1, 100)')
}