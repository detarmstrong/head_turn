/* */ 
var baseMerge = require('./internal/baseMerge'),
    createAssigner = require('./internal/createAssigner');
var mergeWith = createAssigner(function(object, source, customizer) {
  baseMerge(object, source, customizer);
});
module.exports = mergeWith;
