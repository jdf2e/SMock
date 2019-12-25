"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 模拟数据动态化，引入mockjs.js来处理
 * author: liaoyanli
 */
let Mock = require('mockjs');
var Random = Mock.Random;
function setString() {
    Random.word(3, 8);
    return Mock.mock('@word(3, 8)');
}
exports.setString = setString;
function setBoolean() {
    Random.boolean();
    return Mock.mock('@boolean');
}
exports.setBoolean = setBoolean;
function setInteger() {
    Random.integer(1, 100);
    return Mock.mock('@integer(1, 100)');
}
exports.setInteger = setInteger;
