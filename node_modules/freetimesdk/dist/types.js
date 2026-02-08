"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COIN_TYPE_MAP = exports.CoinType = void 0;
var CoinType;
(function (CoinType) {
    CoinType["BITCOIN"] = "BTC";
    CoinType["ETHEREUM"] = "ETH";
    CoinType["LITECOIN"] = "LTC";
    CoinType["BITCOIN_CASH"] = "BCH";
    CoinType["DOGECOIN"] = "DOGE";
    CoinType["SOLANA"] = "SOL";
    CoinType["POLYGON"] = "MATIC";
    CoinType["BINANCE_COIN"] = "BNB";
    CoinType["TRON"] = "TRX";
})(CoinType || (exports.CoinType = CoinType = {}));
exports.COIN_TYPE_MAP = {
    'BTC': CoinType.BITCOIN,
    'ETH': CoinType.ETHEREUM,
    'LTC': CoinType.LITECOIN,
    'BCH': CoinType.BITCOIN_CASH,
    'DOGE': CoinType.DOGECOIN,
    'SOL': CoinType.SOLANA,
    'MATIC': CoinType.POLYGON,
    'BNB': CoinType.BINANCE_COIN,
    'TRX': CoinType.TRON
};
//# sourceMappingURL=types.js.map