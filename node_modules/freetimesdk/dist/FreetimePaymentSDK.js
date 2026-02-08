"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreetimePaymentSDK = void 0;
const types_1 = require("./types");
const Wallet_1 = require("./Wallet");
const Transaction_1 = require("./Transaction");
const FeeManager_1 = require("./FeeManager");
const FeeBreakdown_1 = require("./FeeBreakdown");
const CryptoUtils_1 = require("./CryptoUtils");
class FreetimePaymentSDK {
    constructor() {
        this.wallets = [];
        this.paymentProviders = new Map();
        this.feeManager = new FeeManager_1.FeeManagerImpl();
        this.initializePaymentProviders();
    }
    initializePaymentProviders() {
        for (const coinType of Object.values(types_1.CoinType)) {
            this.paymentProviders.set(coinType, new MockPaymentProvider(coinType));
        }
    }
    createWallet(coinType, name) {
        const wallet = Wallet_1.WalletImpl.create(coinType, name);
        this.wallets.push(wallet);
        return wallet;
    }
    async getBalance(address) {
        const wallet = this.wallets.find(w => w.address === address);
        if (!wallet) {
            throw new Error(`Wallet not found for address: ${address}`);
        }
        const provider = this.paymentProviders.get(wallet.coinType);
        if (!provider) {
            throw new Error(`Payment provider not found for ${wallet.coinType}`);
        }
        return await provider.getBalance(address);
    }
    async send(fromAddress, toAddress, amount, coinType) {
        const fromWallet = this.wallets.find(w => w.address === fromAddress);
        if (!fromWallet) {
            throw new Error(`Source wallet not found: ${fromAddress}`);
        }
        if (!this.validateAddress(toAddress, coinType)) {
            throw new Error(`Invalid recipient address: ${toAddress}`);
        }
        const provider = this.paymentProviders.get(coinType);
        if (!provider) {
            throw new Error(`Payment provider not found for ${coinType}`);
        }
        const networkFee = await provider.getFeeEstimate(toAddress, amount);
        const developerFeePercentage = this.feeManager.getDeveloperFeePercentage(amount);
        const developerFee = (parseFloat(amount) * parseFloat(developerFeePercentage) / 100).toString();
        const totalFee = (parseFloat(networkFee) + parseFloat(developerFee)).toString();
        const recipientReceives = (parseFloat(amount) - parseFloat(totalFee)).toString();
        const feeBreakdown = new FeeBreakdown_1.FeeBreakdownImpl(amount, networkFee, developerFee, developerFeePercentage, totalFee, recipientReceives, this.feeManager.getDeveloperWalletAddress(coinType), coinType);
        const transaction = new Transaction_1.TransactionImpl(CryptoUtils_1.CryptoUtils.generateTransactionHash(), fromAddress, toAddress, recipientReceives, totalFee, coinType);
        return new Transaction_1.TransactionWithFeesImpl(transaction, feeBreakdown);
    }
    async getFeeEstimate(fromAddress, toAddress, amount, coinType) {
        const provider = this.paymentProviders.get(coinType);
        if (!provider) {
            throw new Error(`Payment provider not found for ${coinType}`);
        }
        const networkFee = await provider.getFeeEstimate(toAddress, amount);
        const developerFeePercentage = this.feeManager.getDeveloperFeePercentage(amount);
        const developerFee = (parseFloat(amount) * parseFloat(developerFeePercentage) / 100).toString();
        return (parseFloat(networkFee) + parseFloat(developerFee)).toString();
    }
    getFeeManager() {
        return this.feeManager;
    }
    getAllWallets() {
        return [...this.wallets];
    }
    getWalletsByCoinType(coinType) {
        return this.wallets.filter(w => w.coinType === coinType);
    }
    validateAddress(address, coinType) {
        return CryptoUtils_1.CryptoUtils.validateAddress(address, coinType);
    }
}
exports.FreetimePaymentSDK = FreetimePaymentSDK;
class MockPaymentProvider {
    constructor(coinType) {
        this.coinType = coinType;
    }
    async getBalance(address) {
        return (Math.random() * 10).toFixed(8);
    }
    async send(toAddress, amount) {
        return new Transaction_1.TransactionImpl(CryptoUtils_1.CryptoUtils.generateTransactionHash(), 'mock-from-address', toAddress, amount, '0.0001', this.coinType);
    }
    async getFeeEstimate(toAddress, amount) {
        return (Math.random() * 0.001).toFixed(8);
    }
}
//# sourceMappingURL=FreetimePaymentSDK.js.map