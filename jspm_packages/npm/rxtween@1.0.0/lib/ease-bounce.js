/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
'use strict';
var _require = require('./ease-common');
var createEasing = _require.createEasing;
var PARAM1 = 7.5625;
var PARAM2 = 2.75;
function easeOutFn(x) {
  var z = x;
  if (z < 1 / PARAM2) {
    return PARAM1 * z * z;
  } else if (z < 2 / PARAM2) {
    return PARAM1 * (z -= 1.5 / PARAM2) * z + 0.75;
  } else if (z < 2.5 / PARAM2) {
    return PARAM1 * (z -= 2.25 / PARAM2) * z + 0.9375;
  } else {
    return PARAM1 * (z -= 2.625 / PARAM2) * z + 0.984375;
  }
}
exports['default'] = {EasingBounce: createEasing(function(x) {
    return 1 - easeOutFn(1 - x);
  })};
module.exports = exports['default'];
