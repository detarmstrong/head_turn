/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
'use strict';
var _require = require('./ease-common');
var createEasing = _require.createEasing;
var EXP_WEIGHT = 6;
var EXP_MAX = Math.exp(EXP_WEIGHT) - 1;
function expFn(x) {
  return (Math.exp(x * EXP_WEIGHT) - 1) / EXP_MAX;
}
var EasingExponential = createEasing(expFn);
exports['default'] = {EasingExponential: EasingExponential};
module.exports = exports['default'];
