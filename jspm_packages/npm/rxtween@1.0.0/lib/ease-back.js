/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
'use strict';
var _require = require('./ease-common');
var createEasing = _require.createEasing;
var OVERSHOOT = 1.70158;
exports['default'] = {EasingBack: createEasing(function(x) {
    return x * x * ((OVERSHOOT + 1) * x - OVERSHOOT);
  })};
module.exports = exports['default'];
