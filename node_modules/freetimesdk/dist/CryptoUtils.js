"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoUtils = void 0;
const types_1 = require("./types");
const bs58_1 = __importDefault(require("bs58"));
// Import type declarations
/// <reference path="./types.d.ts" />
class CryptoUtils {
    static generateTransactionHash() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2);
        return 'tx_' + timestamp + '_' + random;
    }
    static validateAddress(address, coinType) {
        if (!address || address.length === 0) {
            return false;
        }
        try {
            switch (coinType) {
                case types_1.CoinType.BITCOIN:
                    return CryptoUtils.validateBitcoinAddress(address);
                case types_1.CoinType.ETHEREUM:
                    return CryptoUtils.validateEthereumAddress(address);
                case types_1.CoinType.LITECOIN:
                    return CryptoUtils.validateLitecoinAddress(address);
                case types_1.CoinType.BITCOIN_CASH:
                    return CryptoUtils.validateBitcoinCashAddress(address);
                case types_1.CoinType.DOGECOIN:
                    return CryptoUtils.validateDogecoinAddress(address);
                case types_1.CoinType.SOLANA:
                    return CryptoUtils.validateSolanaAddress(address);
                case types_1.CoinType.POLYGON:
                    return CryptoUtils.validateEthereumAddress(address);
                case types_1.CoinType.BINANCE_COIN:
                    return CryptoUtils.validateBinanceCoinAddress(address);
                case types_1.CoinType.TRON:
                    return CryptoUtils.validateTronAddress(address);
                default:
                    return address.length >= 26 && address.length <= 95;
            }
        }
        catch (error) {
            return false;
        }
    }
    static validateBitcoinAddress(address) {
        try {
            const decoded = bs58_1.default.decode(address);
            if (decoded.length !== 25)
                return false;
            const version = decoded[0];
            if (version !== 0x00)
                return false;
            const checksum = decoded.slice(-4);
            const hash = decoded.slice(0, -4);
            const crypto = require('crypto');
            const calculatedChecksum = crypto.createHash('sha256')
                .update(crypto.createHash('sha256').update(hash).digest())
                .digest()
                .slice(0, 4);
            return checksum.every((val, i) => val === calculatedChecksum[i]);
        }
        catch {
            return false;
        }
    }
    static validateEthereumAddress(address) {
        if (!address.startsWith('0x') || address.length !== 42) {
            return false;
        }
        const hexPart = address.substring(2);
        return /^[0-9a-fA-F]+$/.test(hexPart);
    }
    static validateLitecoinAddress(address) {
        try {
            const decoded = bs58_1.default.decode(address);
            if (decoded.length !== 25)
                return false;
            const version = decoded[0];
            if (version !== 0x30)
                return false;
            return true;
        }
        catch {
            return false;
        }
    }
    static validateBitcoinCashAddress(address) {
        // Simple validation for Bitcoin Cash addresses
        return address.startsWith('bitcoincash:') || address.startsWith('bchtest:');
    }
    static validateDogecoinAddress(address) {
        try {
            const decoded = bs58_1.default.decode(address);
            if (decoded.length !== 25)
                return false;
            const version = decoded[0];
            return version === 0x1e || version === 0x71;
        }
        catch {
            return false;
        }
    }
    static validateSolanaAddress(address) {
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    }
    static validateBinanceCoinAddress(address) {
        if (address.startsWith('bnb')) {
            return /^[1-9A-HJ-NP-Za-km-z]{39}$/.test(address.substring(3));
        }
        return CryptoUtils.validateEthereumAddress(address);
    }
    static validateTronAddress(address) {
        if (!address.startsWith('T') || address.length !== 34) {
            return false;
        }
        try {
            bs58_1.default.decode(address);
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.CryptoUtils = CryptoUtils;
//# sourceMappingURL=CryptoUtils.js.map