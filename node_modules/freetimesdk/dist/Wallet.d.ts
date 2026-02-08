import { CoinType, Wallet, PaymentInterface } from './types';
export declare class WalletImpl implements Wallet {
    address: string;
    coinType: CoinType;
    publicKey: string;
    privateKey: string;
    name?: string | undefined;
    constructor(address: string, coinType: CoinType, publicKey: string, privateKey: string, name?: string | undefined);
    static create(coinType: CoinType, name?: string): WalletImpl;
    private static generateBitcoinAddress;
    private static generateEthereumAddress;
    private static generateLitecoinAddress;
    private static generateBitcoinCashAddress;
    private static generateDogecoinAddress;
    private static generateGenericAddress;
    getBalance(paymentProvider: PaymentInterface): Promise<string>;
    send(toAddress: string, amount: string, paymentProvider: PaymentInterface): Promise<import("./types").Transaction>;
}
//# sourceMappingURL=Wallet.d.ts.map