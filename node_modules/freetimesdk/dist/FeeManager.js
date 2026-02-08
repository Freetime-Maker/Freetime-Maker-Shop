"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeeManagerImpl = void 0;
const types_1 = require("./types");
class FeeManagerImpl {
    constructor() {
        this.developerWallets = new Map([
            [types_1.CoinType.BITCOIN, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'],
            [types_1.CoinType.ETHEREUM, '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45'],
            [types_1.CoinType.LITECOIN, 'LTC1QXY2KGDYGJRSQTZQ2N0YRF2493P83KKFJHX0WLH'],
            [types_1.CoinType.BITCOIN_CASH, 'bitcoincash:qpm2qsznhks23z7629mms6s4qs0vjsyevgqq9k0u0'],
            [types_1.CoinType.DOGECOIN, 'D8iFWKZP6h8c6R5J5X5X5X5X5X5X5X5X5X'],
            [types_1.CoinType.SOLANA, '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'],
            [types_1.CoinType.POLYGON, '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45'],
            [types_1.CoinType.BINANCE_COIN, 'bnb1grpf0955h0ykzq3ar5nmum7y6fdflryxqfxp9c'],
            [types_1.CoinType.TRON, 'TJjXgmR1SjJQkLGGaXQZgDq4QWqLZ8vZkL']
        ]);
    }
    getDeveloperFeePercentage(amount) {
        const amountNum = parseFloat(amount);
        if (amountNum >= 1000)
            return '0.05';
        if (amountNum >= 100)
            return '0.1';
        if (amountNum >= 10)
            return '0.25';
        if (amountNum >= 1)
            return '0.35';
        if (amountNum >= 0.1)
            return '0.4';
        return '0.5';
    }
    getFeeTier(amount) {
        const amountNum = parseFloat(amount);
        if (amountNum >= 1000)
            return 'Enterprise (>= 1000)';
        if (amountNum >= 100)
            return 'Business (>= 100)';
        if (amountNum >= 10)
            return 'Professional (>= 10)';
        if (amountNum >= 1)
            return 'Standard (>= 1)';
        if (amountNum >= 0.1)
            return 'Basic (>= 0.1)';
        return 'Micro (< 0.1)';
    }
    getDeveloperWalletAddress(coinType) {
        const wallet = this.developerWallets.get(coinType);
        if (!wallet) {
            throw new Error(`Developer wallet not configured for ${coinType}`);
        }
        return wallet;
    }
    getAllDeveloperWallets() {
        return new Map(this.developerWallets);
    }
    updateDeveloperWallet(coinType, address) {
        this.developerWallets.set(coinType, address);
        return this;
    }
    updateAllDeveloperWallets(wallets) {
        this.developerWallets = new Map(wallets);
        return this;
    }
}
exports.FeeManagerImpl = FeeManagerImpl;
//# sourceMappingURL=FeeManager.js.map