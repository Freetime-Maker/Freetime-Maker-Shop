import { CoinType, Transaction, TransactionWithFees, FeeBreakdown } from './types';
export declare class TransactionImpl implements Transaction {
    hash: string;
    fromAddress: string;
    toAddress: string;
    amount: string;
    fee: string;
    coinType: CoinType;
    timestamp: number;
    status: 'pending' | 'confirmed' | 'failed';
    constructor(hash: string, fromAddress: string, toAddress: string, amount: string, fee: string, coinType: CoinType, timestamp?: number, status?: 'pending' | 'confirmed' | 'failed');
}
export declare class TransactionWithFeesImpl implements TransactionWithFees {
    transaction: Transaction;
    feeBreakdown: FeeBreakdown;
    constructor(transaction: Transaction, feeBreakdown: FeeBreakdown);
    broadcast(): Promise<string>;
    getFormattedSummary(): string;
}
//# sourceMappingURL=Transaction.d.ts.map