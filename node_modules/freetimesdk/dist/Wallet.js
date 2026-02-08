"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletImpl = void 0;
const types_1 = require("./types");
const crypto = __importStar(require("crypto"));
const elliptic_1 = require("elliptic");
const bs58_1 = __importDefault(require("bs58"));
// Import type declarations
/// <reference path="./types.d.ts" />
class WalletImpl {
    constructor(address, coinType, publicKey, privateKey, name) {
        this.address = address;
        this.coinType = coinType;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.name = name;
    }
    static create(coinType, name) {
        const privateKey = crypto.randomBytes(32).toString('hex');
        const ecInstance = new elliptic_1.ec('secp256k1');
        const keyPair = ecInstance.keyFromPrivate(privateKey, 'hex');
        const publicKey = keyPair.getPublic(false, 'hex').substring(2);
        let address;
        switch (coinType) {
            case types_1.CoinType.BITCOIN:
                address = WalletImpl.generateBitcoinAddress(publicKey);
                break;
            case types_1.CoinType.ETHEREUM:
                address = WalletImpl.generateEthereumAddress(publicKey);
                break;
            case types_1.CoinType.LITECOIN:
                address = WalletImpl.generateLitecoinAddress(publicKey);
                break;
            case types_1.CoinType.BITCOIN_CASH:
                address = WalletImpl.generateBitcoinCashAddress(publicKey);
                break;
            case types_1.CoinType.DOGECOIN:
                address = WalletImpl.generateDogecoinAddress(publicKey);
                break;
            default:
                address = WalletImpl.generateGenericAddress(publicKey, coinType);
        }
        return new WalletImpl(address, coinType, publicKey, privateKey, name);
    }
    static generateBitcoinAddress(publicKey) {
        const sha256Hash = crypto.createHash('sha256').update(Buffer.from(publicKey, 'hex')).digest();
        const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();
        const versionedHash = Buffer.concat([Buffer.from([0x00]), ripemd160Hash]);
        const checksum = crypto.createHash('sha256').update(crypto.createHash('sha256').update(versionedHash).digest()).digest().slice(0, 4);
        const addressBytes = Buffer.concat([versionedHash, checksum]);
        return bs58_1.default.encode(addressBytes);
    }
    static generateEthereumAddress(publicKey) {
        const hash = crypto.createHash('sha256').update(Buffer.from(publicKey, 'hex')).digest();
        const address = hash.slice(-20);
        return '0x' + address.toString('hex');
    }
    static generateLitecoinAddress(publicKey) {
        const sha256Hash = crypto.createHash('sha256').update(Buffer.from(publicKey, 'hex')).digest();
        const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();
        const versionedHash = Buffer.concat([Buffer.from([0x30]), ripemd160Hash]);
        const checksum = crypto.createHash('sha256').update(crypto.createHash('sha256').update(versionedHash).digest()).digest().slice(0, 4);
        const addressBytes = Buffer.concat([versionedHash, checksum]);
        return bs58_1.default.encode(addressBytes);
    }
    static generateBitcoinCashAddress(publicKey) {
        // Simplified Bitcoin Cash address generation
        const sha256Hash = crypto.createHash('sha256').update(Buffer.from(publicKey, 'hex')).digest();
        const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();
        // For simplicity, generate a base58 address similar to Bitcoin
        const versionedHash = Buffer.concat([Buffer.from([0x00]), ripemd160Hash]);
        const checksum = crypto.createHash('sha256').update(crypto.createHash('sha256').update(versionedHash).digest()).digest().slice(0, 4);
        const addressBytes = Buffer.concat([versionedHash, checksum]);
        return 'bitcoincash:' + bs58_1.default.encode(addressBytes);
    }
    static generateDogecoinAddress(publicKey) {
        const sha256Hash = crypto.createHash('sha256').update(Buffer.from(publicKey, 'hex')).digest();
        const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();
        const versionedHash = Buffer.concat([Buffer.from([0x1e]), ripemd160Hash]);
        const checksum = crypto.createHash('sha256').update(crypto.createHash('sha256').update(versionedHash).digest()).digest().slice(0, 4);
        const addressBytes = Buffer.concat([versionedHash, checksum]);
        return bs58_1.default.encode(addressBytes);
    }
    static generateGenericAddress(publicKey, coinType) {
        const hash = crypto.createHash('sha256').update(Buffer.from(publicKey, 'hex')).digest();
        return coinType.toLowerCase() + hash.slice(-20).toString('hex');
    }
    async getBalance(paymentProvider) {
        return await paymentProvider.getBalance(this.address);
    }
    async send(toAddress, amount, paymentProvider) {
        return await paymentProvider.send(toAddress, amount);
    }
}
exports.WalletImpl = WalletImpl;
//# sourceMappingURL=Wallet.js.map