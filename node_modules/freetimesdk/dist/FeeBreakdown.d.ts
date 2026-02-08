import { CoinType, FeeBreakdown } from './types';
export declare class FeeBreakdownImpl implements FeeBreakdown {
    originalAmount: string;
    networkFee: string;
    developerFee: string;
    developerFeePercentage: string;
    totalFee: string;
    recipientReceives: string;
    developerWallet: string;
    coinType: CoinType;
    constructor(originalAmount: string, networkFee: string, developerFee: string, developerFeePercentage: string, totalFee: string, recipientReceives: string, developerWallet: string, coinType: CoinType);
    getFormattedBreakdown(): string;
}
//# sourceMappingURL=FeeBreakdown.d.ts.map