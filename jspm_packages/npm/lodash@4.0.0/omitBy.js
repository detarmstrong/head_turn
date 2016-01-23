/* */ 
var baseIteratee = require('./internal/baseIteratee'),
    basePickBy = require('./internal/basePickBy');
function omitBy(object, predicate) {
  predicate = baseIteratee(predicate);
  return basePickBy(object, function(value) {
    return !predicate(value);
  });
}
module.exports = omitBy;
