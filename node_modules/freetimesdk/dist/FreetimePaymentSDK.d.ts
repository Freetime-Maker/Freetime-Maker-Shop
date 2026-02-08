import { CoinType, Wallet, TransactionWithFees, FeeManager, FreetimePaymentSDK as IFreetimePaymentSDK } from './types';
export declare class FreetimePaymentSDK implements IFreetimePaymentSDK {
    private wallets;
    private feeManager;
    private paymentProviders;
    constructor();
    private initializePaymentProviders;
    createWallet(coinType: CoinType, name?: string): Wallet;
    getBalance(address: string): Promise<string>;
    send(fromAddress: string, toAddress: string, amount: string, coinType: CoinType): Promise<TransactionWithFees>;
    getFeeEstimate(fromAddress: string, toAddress: string, amount: string, coinType: CoinType): Promise<string>;
    getFeeManager(): FeeManager;
    getAllWallets(): Wallet[];
    getWalletsByCoinType(coinType: CoinType): Wallet[];
    validateAddress(address: string, coinType: CoinType): boolean;
}
//# sourceMappingURL=FreetimePaymentSDK.d.ts.map