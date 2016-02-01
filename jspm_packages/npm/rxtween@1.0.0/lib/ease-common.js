/* */ 
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
'use strict';

function interpolate(y, from, to) {
  return from * (1 - y) + to * y;
}

function flip(fn) {
  return function (x) {
    return 1 - fn(1 - x);
  };
}

exports['default'] = {
  interpolate: interpolate,

  flip: flip,

  createEasing: function createEasing(fn) {
    var fnFlipped = flip(fn);
    return {
      easeIn: function easeIn(x, from, to) {
        return interpolate(fn(x), from, to);
      },
      easeOut: function easeOut(x, from, to) {
        return interpolate(fnFlipped(x), from, to);
      },
      easeInOut: function easeInOut(x, from, to) {
        var y = x < 0.5 ? fn(2 * x) * 0.5 : 0.5 + fnFlipped(2 * (x - 0.5)) * 0.5;
        return interpolate(y, from, to);
      }
    };
  }
};
module.exports = exports['default'];