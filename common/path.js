let path = require('path');
let join = (a, b) => {
    return path.resolve(a, b);
}
module.exports = {
    join
}