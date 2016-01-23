/* */ 
var baseMerge = require('./internal/baseMerge'),
    createAssigner = require('./internal/createAssigner');
var merge = createAssigner(function(object, source) {
  baseMerge(object, source);
});
module.exports = merge;
