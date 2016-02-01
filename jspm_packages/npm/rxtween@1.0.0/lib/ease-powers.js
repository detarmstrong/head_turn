/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
'use strict';
var _require = require('./ease-common');
var createEasing = _require.createEasing;
var EasingPower2 = createEasing(function(x) {
  return x * x;
});
var EasingPower3 = createEasing(function(x) {
  return x * x * x;
});
var EasingPower4 = createEasing(function(x) {
  var xx = x * x;
  return xx * xx;
});
exports['default'] = {
  EasingPower2: EasingPower2,
  EasingPower3: EasingPower3,
  EasingPower4: EasingPower4
};
module.exports = exports['default'];