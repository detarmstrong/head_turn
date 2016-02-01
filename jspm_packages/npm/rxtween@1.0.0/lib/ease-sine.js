/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
'use strict';
var _require = require('./ease-common');
var createEasing = _require.createEasing;
var HALF_PI = Math.PI * 0.5;
exports['default'] = {EasingSine: createEasing(function(x) {
    return 1 - Math.cos(x * HALF_PI);
  })};
module.exports = exports['default'];
