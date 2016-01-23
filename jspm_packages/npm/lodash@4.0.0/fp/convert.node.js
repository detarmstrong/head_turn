/* */ 
var baseConvert = require('./baseConvert'),
    util = require('./util');
function nodeConvert(name, func) {
  return baseConvert(util, name, func);
}
module.exports = nodeConvert;
