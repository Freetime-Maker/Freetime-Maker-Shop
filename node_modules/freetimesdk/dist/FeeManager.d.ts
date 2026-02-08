import { CoinType, FeeManager } from './types';
export declare class FeeManagerImpl implements FeeManager {
    private developerWallets;
    getDeveloperFeePercentage(amount: string): string;
    getFeeTier(amount: string): string;
    getDeveloperWalletAddress(coinType: CoinType): string;
    getAllDeveloperWallets(): Map<CoinType, string>;
    updateDeveloperWallet(coinType: CoinType, address: string): FeeManager;
    updateAllDeveloperWallets(wallets: Map<CoinType, string>): FeeManager;
}
//# sourceMappingURL=FeeManager.d.ts.map