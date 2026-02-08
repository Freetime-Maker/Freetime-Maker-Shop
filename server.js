const express = require('express');
const path = require('path');
const { FreetimePaymentSDK, CoinType } = require('freetimesdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize FreetimeSDK
const sdk = new FreetimePaymentSDK();

// Middleware
app.use(express.static('.'));
app.use(express.json());

// Create shop wallets
const shopWallets = {
    bitcoin: sdk.createWallet(CoinType.BITCOIN, 'Shop Bitcoin Wallet'),
    ethereum: sdk.createWallet(CoinType.ETHEREUM, 'Shop Ethereum Wallet'),
    litecoin: sdk.createWallet(CoinType.LITECOIN, 'Shop Litecoin Wallet')
};

// API Routes
app.get('/api/shop-addresses', (req, res) => {
    try {
        const addresses = {
            Bitcoin: shopWallets.bitcoin.address,
            Ethereum: shopWallets.ethereum.address,
            Litecoin: shopWallets.litecoin.address
        };
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get shop addresses' });
    }
});

app.post('/api/process-payment', async (req, res) => {
    try {
        const { coinType, amount, customerAddress, productName } = req.body;
        
        // Validate inputs
        if (!coinType || !amount || !customerAddress || !productName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get the appropriate wallet
        const walletKey = coinType.toLowerCase();
        const wallet = shopWallets[walletKey];
        
        if (!wallet) {
            return res.status(400).json({ error: 'Unsupported cryptocurrency' });
        }

        // Validate customer address
        const coinTypeConstant = getCoinTypeConstant(coinType);
        const isValid = sdk.validateAddress(customerAddress, coinTypeConstant);
        
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid customer address' });
        }

        // Get fee estimate
        const fee = await sdk.getFeeEstimate(
            wallet.address,
            customerAddress,
            amount,
            coinTypeConstant
        );

        // Create payment record
        const payment = {
            id: generatePaymentId(),
            productName,
            amount,
            coinType,
            customerAddress,
            shopAddress: wallet.address,
            estimatedFee: fee,
            totalAmount: (parseFloat(amount) + parseFloat(fee)).toString(),
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        console.log('💳 Payment created:', payment);
        
        res.json({
            success: true,
            payment,
            message: `Please send ${amount} USD equivalent of ${coinType} to ${wallet.address}`
        });

    } catch (error) {
        console.error('❌ Payment processing error:', error);
        res.status(500).json({ error: 'Payment processing failed' });
    }
});

app.post('/api/confirm-payment', async (req, res) => {
    try {
        const { paymentId, transactionHash } = req.body;
        
        // In a real implementation, you would:
        // 1. Verify the transaction on the blockchain
        // 2. Check if the amount matches
        // 3. Update payment status
        // 4. Send product code via email
        
        console.log('✅ Payment confirmation received:', { paymentId, transactionHash });
        
        res.json({
            success: true,
            message: 'Payment confirmed! Product code will be sent to your email.',
            status: 'completed'
        });

    } catch (error) {
        console.error('❌ Payment confirmation error:', error);
        res.status(500).json({ error: 'Payment confirmation failed' });
    }
});

app.get('/api/balance/:coinType', async (req, res) => {
    try {
        const { coinType } = req.params;
        const walletKey = coinType.toLowerCase();
        const wallet = shopWallets[walletKey];
        
        if (!wallet) {
            return res.status(400).json({ error: 'Unsupported cryptocurrency' });
        }

        const balance = await sdk.getBalance(wallet.address);
        res.json({ coinType, balance, address: wallet.address });

    } catch (error) {
        console.error('❌ Balance check error:', error);
        res.status(500).json({ error: 'Failed to check balance' });
    }
});

app.get('/api/supported-cryptocurrencies', (req, res) => {
    const cryptocurrencies = [
        { name: 'Bitcoin', symbol: 'BTC', icon: '₿', supported: true },
        { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', supported: true },
        { name: 'Litecoin', symbol: 'LTC', icon: 'Ł', supported: true },
        { name: 'Bitcoin Cash', symbol: 'BCH', supported: false },
        { name: 'Dogecoin', symbol: 'DOGE', supported: false },
        { name: 'Solana', symbol: 'SOL', supported: false },
        { name: 'Polygon', symbol: 'MATIC', supported: false },
        { name: 'Binance Coin', symbol: 'BNB', supported: false },
        { name: 'Tron', symbol: 'TRX', supported: false }
    ];
    
    res.json(cryptocurrencies);
});

// Helper functions
function getCoinTypeConstant(coinType) {
    const types = {
        'Bitcoin': CoinType.BITCOIN,
        'Ethereum': CoinType.ETHEREUM,
        'Litecoin': CoinType.LITECOIN
    };
    return types[coinType];
}

function generatePaymentId() {
    return 'pay_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Freetime Maker Shop Server running on http://localhost:${PORT}`);
    console.log('💰 Cryptocurrency payment system enabled');
    console.log('📱 Shop wallets created:');
    console.log(`   Bitcoin: ${shopWallets.bitcoin.address}`);
    console.log(`   Ethereum: ${shopWallets.ethereum.address}`);
    console.log(`   Litecoin: ${shopWallets.litecoin.address}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
});

module.exports = app;
