/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
'use strict';
var Rx = require('rx');
var _require = require('./ease-common');
var interpolate = _require.interpolate;
var _require2 = require('./ease-powers');
var EasingPower2 = _require2.EasingPower2;
var EasingPower3 = _require2.EasingPower3;
var EasingPower4 = _require2.EasingPower4;
var _require3 = require('./ease-exponential');
var EasingExponential = _require3.EasingExponential;
var _require4 = require('./ease-back');
var EasingBack = _require4.EasingBack;
var _require5 = require('./ease-bounce');
var EasingBounce = _require5.EasingBounce;
var _require6 = require('./ease-circ');
var EasingCirc = _require6.EasingCirc;
var _require7 = require('./ease-elastic');
var EasingElastic = _require7.EasingElastic;
var _require8 = require('./ease-sine');
var EasingSine = _require8.EasingSine;
var DEFAULT_INTERVAL = 15;
function sanitizeInterval(interval) {
  if (interval === 'auto') {
    return DEFAULT_INTERVAL;
  } else if (typeof interval !== 'number' || interval <= 0) {
    console.warn('RxTween cannot use invalid given interval: ' + interval);
    return DEFAULT_INTERVAL;
  }
  return interval;
}
function RxTween(_ref) {
  var from = _ref.from;
  var to = _ref.to;
  var duration = _ref.duration;
  var _ref$ease = _ref.ease;
  var ease = _ref$ease === undefined ? RxTween.Linear.ease : _ref$ease;
  var _ref$interval = _ref.interval;
  var interval = _ref$interval === undefined ? 'auto' : _ref$interval;
  var sanitizedInterval = sanitizeInterval(interval);
  var totalTicks = Math.round(duration / sanitizedInterval);
  return Rx.Observable.interval(sanitizedInterval).take(totalTicks).map(function(tick) {
    return ease(tick / totalTicks, from, to);
  }).concat(Rx.Observable.just(to));
}
RxTween.Linear = {ease: interpolate};
RxTween.Power2 = EasingPower2;
RxTween.Power3 = EasingPower3;
RxTween.Power4 = EasingPower4;
RxTween.Exp = EasingExponential;
RxTween.Back = EasingBack;
RxTween.Bounce = EasingBounce;
RxTween.Circ = EasingCirc;
RxTween.Elastic = EasingElastic;
RxTween.Sine = EasingSine;
exports['default'] = RxTween;
module.exports = exports['default'];