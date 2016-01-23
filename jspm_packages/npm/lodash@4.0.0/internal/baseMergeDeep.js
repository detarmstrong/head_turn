/* */ 
var assignMergeValue = require('./assignMergeValue'),
    baseClone = require('./baseClone'),
    copyArray = require('./copyArray'),
    isArguments = require('../isArguments'),
    isArray = require('../isArray'),
    isArrayLikeObject = require('../isArrayLikeObject'),
    isFunction = require('../isFunction'),
    isObject = require('../isObject'),
    isPlainObject = require('../isPlainObject'),
    isTypedArray = require('../isTypedArray'),
    toPlainObject = require('../toPlainObject');
function baseMergeDeep(object, source, key, mergeFunc, customizer, stack) {
  var objValue = object[key],
      srcValue = source[key],
      stacked = stack.get(srcValue) || stack.get(objValue);
  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, (key + ''), object, source, stack) : undefined,
      isCommon = newValue === undefined;
  if (isCommon) {
    newValue = srcValue;
    if (isArray(srcValue) || isTypedArray(srcValue)) {
      newValue = isArray(objValue) ? objValue : ((isArrayLikeObject(objValue)) ? copyArray(objValue) : baseClone(srcValue));
    } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = isArguments(objValue) ? toPlainObject(objValue) : (isObject(objValue) ? objValue : baseClone(srcValue));
    } else {
      isCommon = isFunction(srcValue);
    }
  }
  stack.set(srcValue, newValue);
  if (isCommon) {
    mergeFunc(newValue, srcValue, customizer, stack);
  }
  assignMergeValue(object, key, newValue);
}
module.exports = baseMergeDeep;
