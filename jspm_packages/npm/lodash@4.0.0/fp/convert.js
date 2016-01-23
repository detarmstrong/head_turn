/* */ 
var _ = require('../lodash'),
    baseConvert = require('./baseConvert'),
    util = require('./util');
function convert() {
  var args = arguments,
      name = args.length ? args[0] : _.noConflict().runInContext(),
      func = args[1];
  return baseConvert(util, name, func);
}
module.exports = convert;
