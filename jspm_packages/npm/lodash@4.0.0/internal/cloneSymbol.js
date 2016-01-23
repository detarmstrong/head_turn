/* */ 
var _Symbol = require('./_Symbol');
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = _Symbol ? symbolProto.valueOf : undefined;
function cloneSymbol(symbol) {
  return _Symbol ? Object(symbolValueOf.call(symbol)) : {};
}
module.exports = cloneSymbol;
