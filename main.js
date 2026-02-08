const { FreetimePaymentSDK, CoinType } = require('freetimesdk');

// Initialize the SDK
const sdk = new FreetimePaymentSDK();

class FreetimeMakerShop {
    constructor() {
        this.sdk = new FreetimePaymentSDK();
        this.wallets = new Map();
        this.initializeShop();
    }

    async initializeShop() {
        console.log('🏪 Freetime Maker Shop - Initializing...');
        console.log('💰 Cryptocurrency Payment System Enabled');
        
        // Create shop wallets for different cryptocurrencies
        await this.createShopWallets();
        
        console.log('✅ Shop ready for business!');
        console.log('🛍️  Supported payment methods:');
        this.wallets.forEach((wallet, coinType) => {
            console.log(`   • ${coinType}: ${wallet.address}`);
        });
    }

    async createShopWallets() {
        try {
            // Create wallets for the shop
            const bitcoinWallet = this.sdk.createWallet(CoinType.BITCOIN, 'Shop Bitcoin Wallet');
            const ethereumWallet = this.sdk.createWallet(CoinType.ETHEREUM, 'Shop Ethereum Wallet');
            const litecoinWallet = this.sdk.createWallet(CoinType.LITECOIN, 'Shop Litecoin Wallet');
            
            this.wallets.set('Bitcoin', bitcoinWallet);
            this.wallets.set('Ethereum', ethereumWallet);
            this.wallets.set('Litecoin', litecoinWallet);
            
            console.log('💼 Shop wallets created successfully');
        } catch (error) {
            console.error('❌ Error creating shop wallets:', error.message);
        }
    }

    async processPayment(coinType, amount, customerAddress) {
        try {
            console.log(`💳 Processing ${coinType} payment: ${amount} ${coinType}`);
            console.log(`👤 Customer: ${customerAddress}`);
            
            const wallet = this.wallets.get(coinType);
            if (!wallet) {
                throw new Error(`Unsupported cryptocurrency: ${coinType}`);
            }

            // Get fee estimate
            const fee = await this.sdk.getFeeEstimate(
                wallet.address,
                customerAddress,
                amount,
                this.getCoinTypeConstant(coinType)
            );
            
            console.log(`⚡ Estimated fee: ${fee} ${coinType}`);
            
            // Process payment (in real shop, this would be after customer sends payment)
            const result = await this.sdk.send(
                wallet.address,
                customerAddress,
                amount,
                this.getCoinTypeConstant(coinType)
            );
            
            console.log('📋 Fee breakdown:');
            console.log(result.feeBreakdown.getFormattedBreakdown());
            
            return result;
        } catch (error) {
            console.error('❌ Payment processing failed:', error.message);
            throw error;
        }
    }

    getCoinTypeConstant(coinType) {
        const types = {
            'Bitcoin': CoinType.BITCOIN,
            'Ethereum': CoinType.ETHEREUM,
            'Litecoin': CoinType.LITECOIN
        };
        return types[coinType];
    }

    async checkShopBalance(coinType) {
        try {
            const wallet = this.wallets.get(coinType);
            if (!wallet) {
                throw new Error(`Wallet not found for ${coinType}`);
            }
            
            const balance = await this.sdk.getBalance(wallet.address);
            console.log(`💰 Shop ${coinType} balance: ${balance} ${coinType}`);
            return balance;
        } catch (error) {
            console.error(`❌ Error checking ${coinType} balance:`, error.message);
            return '0';
        }
    }

    async validatePaymentAddress(address, coinType) {
        try {
            const isValid = this.sdk.validateAddress(address, this.getCoinTypeConstant(coinType));
            console.log(`🔍 Address validation for ${coinType}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
            return isValid;
        } catch (error) {
            console.error('❌ Address validation error:', error.message);
            return false;
        }
    }

    getSupportedCryptocurrencies() {
        return [
            'Bitcoin (BTC)',
            'Ethereum (ETH)', 
            'Litecoin (LTC)',
            'Bitcoin Cash (BCH)',
            'Dogecoin (DOGE)',
            'Solana (SOL)',
            'Polygon (MATIC)',
            'Binance Coin (BNB)',
            'Tron (TRX)'
        ];
    }

    getFeeStructure() {
        return {
            'Enterprise (≥ 1000)': '0.05%',
            'Business (≥ 100)': '0.1%',
            'Professional (≥ 10)': '0.25%',
            'Standard (≥ 1)': '0.35%',
            'Basic (≥ 0.1)': '0.4%',
            'Micro (< 0.1)': '0.5%'
        };
    }
}

// Demo usage
async function demo() {
    const shop = new FreetimeMakerShop();
    
    // Wait a moment for initialization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('\n🎯 Demo: Processing a customer payment...');
    
    try {
        // Simulate a customer payment
        const customerAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
        const paymentAmount = '0.001';
        const paymentCurrency = 'Bitcoin';
        
        // Validate customer address
        const isValidAddress = await shop.validatePaymentAddress(customerAddress, paymentCurrency);
        
        if (isValidAddress) {
            // Process payment
            const result = await shop.processPayment(paymentCurrency, paymentAmount, customerAddress);
            console.log(`✅ Payment processed successfully!`);
            console.log(`📄 Transaction hash: ${await result.broadcast()}`);
        }
        
        // Check shop balances
        console.log('\n💼 Current shop balances:');
        await shop.checkShopBalance('Bitcoin');
        await shop.checkShopBalance('Ethereum');
        await shop.checkShopBalance('Litecoin');
        
    } catch (error) {
        console.error('❌ Demo failed:', error.message);
    }
}

// Export for use in other modules
module.exports = { FreetimeMakerShop, CoinType };

// Run demo if this file is executed directly
if (require.main === module) {
    demo().catch(console.error);
}
