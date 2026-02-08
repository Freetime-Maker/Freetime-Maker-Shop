"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionWithFeesImpl = exports.TransactionImpl = void 0;
class TransactionImpl {
    constructor(hash, fromAddress, toAddress, amount, fee, coinType, timestamp = Date.now(), status = 'pending') {
        this.hash = hash;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.fee = fee;
        this.coinType = coinType;
        this.timestamp = timestamp;
        this.status = status;
    }
}
exports.TransactionImpl = TransactionImpl;
class TransactionWithFeesImpl {
    constructor(transaction, feeBreakdown) {
        this.transaction = transaction;
        this.feeBreakdown = feeBreakdown;
    }
    async broadcast() {
        this.transaction.status = 'pending';
        console.log(`Broadcasting transaction: ${this.transaction.hash}`);
        console.log(this.feeBreakdown.getFormattedBreakdown());
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.transaction.status = 'confirmed';
        return this.transaction.hash;
    }
    getFormattedSummary() {
        return `Transaction Summary:
Hash: ${this.transaction.hash}
From: ${this.transaction.fromAddress}
To: ${this.transaction.toAddress}
Amount: ${this.transaction.amount} ${this.transaction.coinType}
Status: ${this.transaction.status}
${this.feeBreakdown.getFormattedBreakdown()}`;
    }
}
exports.TransactionWithFeesImpl = TransactionWithFeesImpl;
//# sourceMappingURL=Transaction.js.map