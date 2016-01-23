/* */ 
var baseSet = require('./internal/baseSet');
function fromPairs(pairs) {
  var index = -1,
      length = pairs ? pairs.length : 0,
      result = {};
  while (++index < length) {
    var pair = pairs[index];
    baseSet(result, pair[0], pair[1]);
  }
  return result;
}
module.exports = fromPairs;
