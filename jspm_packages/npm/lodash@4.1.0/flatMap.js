/* */ 
var arrayMap = require('./_arrayMap'),
    baseFlatten = require('./_baseFlatten'),
    baseIteratee = require('./_baseIteratee');
function flatMap(array, iteratee) {
  var length = array ? array.length : 0;
  return length ? baseFlatten(arrayMap(array, baseIteratee(iteratee, 3))) : [];
}
module.exports = flatMap;
