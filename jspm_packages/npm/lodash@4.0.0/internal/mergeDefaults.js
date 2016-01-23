/* */ 
var baseClone = require('./baseClone'),
    baseMerge = require('./baseMerge'),
    isObject = require('../isObject');
function mergeDefaults(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    stack.set(srcValue, objValue);
    baseMerge(objValue, srcValue, mergeDefaults, stack);
  }
  return objValue === undefined ? baseClone(srcValue) : objValue;
}
module.exports = mergeDefaults;
