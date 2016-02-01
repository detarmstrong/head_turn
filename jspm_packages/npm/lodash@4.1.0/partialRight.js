/* */ 
var createWrapper = require('./_createWrapper'),
    replaceHolders = require('./_replaceHolders'),
    rest = require('./rest');
var PARTIAL_RIGHT_FLAG = 64;
var partialRight = rest(function(func, partials) {
  var holders = replaceHolders(partials, partialRight.placeholder);
  return createWrapper(func, PARTIAL_RIGHT_FLAG, undefined, partials, holders);
});
module.exports = partialRight;