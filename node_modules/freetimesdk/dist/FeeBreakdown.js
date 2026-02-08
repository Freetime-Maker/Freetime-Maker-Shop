"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeeBreakdownImpl = void 0;
class FeeBreakdownImpl {
    constructor(originalAmount, networkFee, developerFee, developerFeePercentage, totalFee, recipientReceives, developerWallet, coinType) {
        this.originalAmount = originalAmount;
        this.networkFee = networkFee;
        this.developerFee = developerFee;
        this.developerFeePercentage = developerFeePercentage;
        this.totalFee = totalFee;
        this.recipientReceives = recipientReceives;
        this.developerWallet = developerWallet;
        this.coinType = coinType;
    }
    getFormattedBreakdown() {
        return `Transaction Fee Breakdown (${this.coinType}):
Original Amount: ${this.originalAmount} ${this.coinType}
Network Fee: ${this.networkFee} ${this.coinType}
Developer Fee (${this.developerFeePercentage}%): ${this.developerFee} ${this.coinType}
Total Fee: ${this.totalFee} ${this.coinType}
Recipient Receives: ${this.recipientReceives} ${this.coinType}
Developer Wallet: ${this.developerWallet}`;
    }
}
exports.FeeBreakdownImpl = FeeBreakdownImpl;
//# sourceMappingURL=FeeBreakdown.js.map