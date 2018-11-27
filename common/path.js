/** 
 * path
 * author: liaoyanli
 */
let path = require('path');

function join(a, b) {
    return path.resolve(a, b);
}

function join2(a, b, c) {
    return path.join(a, b, c);
}
module.exports = {
    join,
    join2
}