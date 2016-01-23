/* */ 
var baseForIn = require('./baseForIn');
function basePickBy(object, predicate) {
  var result = {};
  baseForIn(object, function(value, key) {
    if (predicate(value)) {
      result[key] = value;
    }
  });
  return result;
}
module.exports = basePickBy;
