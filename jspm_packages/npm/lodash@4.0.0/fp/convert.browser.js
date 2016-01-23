/* */ 
var baseConvert = require('./baseConvert');
function browserConvert(lodash) {
  return baseConvert(lodash, lodash);
}
module.exports = browserConvert;
