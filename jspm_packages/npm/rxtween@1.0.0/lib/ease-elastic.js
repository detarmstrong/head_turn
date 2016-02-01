/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
'use strict';
var _require = require('./ease-common');
var createEasing = _require.createEasing;
var PERIOD = 0.3;
var OVERSHOOT = PERIOD / 4;
var AMPLITUDE = 1;
function elasticIn(x) {
  var z = x;
  if (z <= 0) {
    return 0;
  } else if (z >= 1) {
    return 1;
  } else {
    z -= 1;
    return -(AMPLITUDE * Math.pow(2, 10 * z)) * Math.sin((z - OVERSHOOT) * (2 * Math.PI) / PERIOD);
  }
}
exports['default'] = {EasingElastic: createEasing(elasticIn)};
module.exports = exports['default'];
