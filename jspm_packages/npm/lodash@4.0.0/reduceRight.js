/* */ 
var arrayReduceRight = require('./internal/arrayReduceRight'),
    baseEachRight = require('./internal/baseEachRight'),
    baseIteratee = require('./internal/baseIteratee'),
    baseReduce = require('./internal/baseReduce'),
    isArray = require('./isArray');
function reduceRight(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduceRight : baseReduce,
      initFromCollection = arguments.length < 3;
  return func(collection, baseIteratee(iteratee, 4), accumulator, initFromCollection, baseEachRight);
}
module.exports = reduceRight;
