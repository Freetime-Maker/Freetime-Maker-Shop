export declare enum CoinType {
    BITCOIN = "BTC",
    ETHEREUM = "ETH",
    LITECOIN = "LTC",
    BITCOIN_CASH = "BCH",
    DOGECOIN = "DOGE",
    SOLANA = "SOL",
    POLYGON = "MATIC",
    BINANCE_COIN = "BNB",
    TRON = "TRX"
}
export declare const COIN_TYPE_MAP: Record<string, CoinType>;
export interface Wallet {
    address: string;
    coinType: CoinType;
    publicKey: string;
    privateKey: string;
    name?: string;
}
export interface Transaction {
    hash: string;
    fromAddress: string;
    toAddress: string;
    amount: string;
    fee: string;
    coinType: CoinType;
    timestamp: number;
    status: 'pending' | 'confirmed' | 'failed';
}
export interface FeeBreakdown {
    originalAmount: string;
    networkFee: string;
    developerFee: string;
    developerFeePercentage: string;
    totalFee: string;
    recipientReceives: string;
    developerWallet: string;
    coinType: CoinType;
    getFormattedBreakdown(): string;
}
export interface TransactionWithFees {
    transaction: Transaction;
    feeBreakdown: FeeBreakdown;
    broadcast(): Promise<string>;
    getFormattedSummary(): string;
}
export interface FeeManager {
    getDeveloperFeePercentage(amount: string): string;
    getFeeTier(amount: string): string;
    getDeveloperWalletAddress(coinType: CoinType): string;
    getAllDeveloperWallets(): Map<CoinType, string>;
    updateDeveloperWallet(coinType: CoinType, address: string): FeeManager;
    updateAllDeveloperWallets(wallets: Map<CoinType, string>): FeeManager;
}
export interface PaymentInterface {
    getBalance(address: string): Promise<string>;
    send(toAddress: string, amount: string): Promise<Transaction>;
    getFeeEstimate(toAddress: string, amount: string): Promise<string>;
}
export interface FreetimePaymentSDK {
    createWallet(coinType: CoinType, name?: string): Wallet;
    getBalance(address: string): Promise<string>;
    send(fromAddress: string, toAddress: string, amount: string, coinType: CoinType): Promise<TransactionWithFees>;
    getFeeEstimate(fromAddress: string, toAddress: string, amount: string, coinType: CoinType): Promise<string>;
    getFeeManager(): FeeManager;
    getAllWallets(): Wallet[];
    getWalletsByCoinType(coinType: CoinType): Wallet[];
    validateAddress(address: string, coinType: CoinType): boolean;
}
//# sourceMappingURL=types.d.ts.map