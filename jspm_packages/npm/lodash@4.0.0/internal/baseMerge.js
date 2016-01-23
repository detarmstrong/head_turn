/* */ 
var Stack = require('./Stack'),
    arrayEach = require('./arrayEach'),
    assignMergeValue = require('./assignMergeValue'),
    baseMergeDeep = require('./baseMergeDeep'),
    isArray = require('../isArray'),
    isObject = require('../isObject'),
    isTypedArray = require('../isTypedArray'),
    keysIn = require('../keysIn');
function baseMerge(object, source, customizer, stack) {
  if (object === source) {
    return;
  }
  var props = (isArray(source) || isTypedArray(source)) ? undefined : keysIn(source);
  arrayEach(props || source, function(srcValue, key) {
    if (props) {
      key = srcValue;
      srcValue = source[key];
    }
    if (isObject(srcValue)) {
      stack || (stack = new Stack);
      baseMergeDeep(object, source, key, baseMerge, customizer, stack);
    } else {
      var newValue = customizer ? customizer(object[key], srcValue, (key + ''), object, source, stack) : undefined;
      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  });
}
module.exports = baseMerge;
