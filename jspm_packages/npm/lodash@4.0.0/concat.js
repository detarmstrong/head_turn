/* */ 
var arrayConcat = require('./internal/arrayConcat'),
    baseFlatten = require('./internal/baseFlatten'),
    isArray = require('./isArray'),
    rest = require('./rest');
var concat = rest(function(array, values) {
  values = baseFlatten(values);
  return arrayConcat(isArray(array) ? array : [Object(array)], values);
});
module.exports = concat;
