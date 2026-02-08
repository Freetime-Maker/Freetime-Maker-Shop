import { CoinType } from './types';
export declare class CryptoUtils {
    static generateTransactionHash(): string;
    static validateAddress(address: string, coinType: CoinType): boolean;
    private static validateBitcoinAddress;
    private static validateEthereumAddress;
    private static validateLitecoinAddress;
    private static validateBitcoinCashAddress;
    private static validateDogecoinAddress;
    private static validateSolanaAddress;
    private static validateBinanceCoinAddress;
    private static validateTronAddress;
}
//# sourceMappingURL=CryptoUtils.d.ts.map