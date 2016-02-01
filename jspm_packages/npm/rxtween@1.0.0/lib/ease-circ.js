/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
'use strict';
var _require = require('./ease-common');
var createEasing = _require.createEasing;
exports['default'] = {EasingCirc: createEasing(function(x) {
    return -(Math.sqrt(1 - x * x) - 1);
  })};
module.exports = exports['default'];
