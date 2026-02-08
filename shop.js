// FreetimeSDK Integration for Web Shop
class FreetimeShop {
    constructor() {
        this.sdk = null;
        this.wallets = new Map();
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Load FreetimeSDK (Node.js version)
            const { FreetimePaymentSDK, CoinType } = require('freetimesdk');
            this.sdk = new FreetimePaymentSDK();
            this.CoinType = CoinType;
            
            // Create shop wallets
            await this.createShopWallets();
            this.isInitialized = true;
            
            console.log('✅ FreetimeShop initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize FreetimeShop:', error);
            this.showError('Failed to initialize payment system');
        }
    }

    async createShopWallets() {
        try {
            const bitcoinWallet = this.sdk.createWallet(this.CoinType.BITCOIN, 'Shop Bitcoin Wallet');
            const ethereumWallet = this.sdk.createWallet(this.CoinType.ETHEREUM, 'Shop Ethereum Wallet');
            const litecoinWallet = this.sdk.createWallet(this.CoinType.LITECOIN, 'Shop Litecoin Wallet');
            
            this.wallets.set('Bitcoin', bitcoinWallet);
            this.wallets.set('Ethereum', ethereumWallet);
            this.wallets.set('Litecoin', litecoinWallet);
            
            console.log('💼 Shop wallets created');
        } catch (error) {
            console.error('❌ Error creating wallets:', error);
        }
    }

    async processPayment(coinType, amount, customerAddress, productName) {
        if (!this.isInitialized) {
            throw new Error('Payment system not initialized');
        }

        try {
            console.log(`💳 Processing ${coinType} payment for ${productName}: ${amount} ${coinType}`);
            
            const wallet = this.wallets.get(coinType);
            if (!wallet) {
                throw new Error(`Unsupported cryptocurrency: ${coinType}`);
            }

            // Validate customer address
            const isValid = this.sdk.validateAddress(customerAddress, this.getCoinTypeConstant(coinType));
            if (!isValid) {
                throw new Error('Invalid customer address');
            }

            // Get fee estimate
            const fee = await this.sdk.getFeeEstimate(
                wallet.address,
                customerAddress,
                amount,
                this.getCoinTypeConstant(coinType)
            );

            // Create payment result (in real implementation, this would wait for customer payment)
            const result = {
                productName,
                amount,
                coinType,
                customerAddress,
                shopAddress: wallet.address,
                estimatedFee: fee,
                feeBreakdown: `Network Fee: ${fee} ${coinType} + Developer Fee (0.5%)`,
                totalAmount: (parseFloat(amount) + parseFloat(fee)).toString(),
                status: 'pending_payment'
            };

            console.log('📋 Payment details prepared:', result);
            return result;

        } catch (error) {
            console.error('❌ Payment processing failed:', error.message);
            throw error;
        }
    }

    getCoinTypeConstant(coinType) {
        const types = {
            'Bitcoin': this.CoinType.BITCOIN,
            'Ethereum': this.CoinType.ETHEREUM,
            'Litecoin': this.CoinType.LITECOIN
        };
        return types[coinType];
    }

    getSupportedCryptocurrencies() {
        return [
            { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
            { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
            { name: 'Litecoin', symbol: 'LTC', icon: 'Ł' }
        ];
    }

    getShopAddresses() {
        const addresses = {};
        this.wallets.forEach((wallet, coinType) => {
            addresses[coinType] = wallet.address;
        });
        return addresses;
    }

    showError(message) {
        // Show error to user (could be replaced with better UI)
        console.error('Shop Error:', message);
        alert(`Payment Error: ${message}`);
    }

    showSuccess(message) {
        console.log('Shop Success:', message);
        alert(`Payment Success: ${message}`);
    }
}

// Payment UI Handler
class PaymentUI {
    constructor(shop) {
        this.shop = shop;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add event listeners when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupPaymentButtons());
        } else {
            this.setupPaymentButtons();
        }
    }

    setupPaymentButtons() {
        // Find all payment buttons and add crypto payment options
        const buyButtons = document.querySelectorAll('a[href*="buy."]');
        
        buyButtons.forEach(button => {
            const parentDiv = button.closest('.product');
            if (parentDiv) {
                this.addCryptoPaymentOptions(parentDiv, button.href);
            }
        });
    }

    addCryptoPaymentOptions(productDiv, originalBuyLink) {
        // Extract product info from the page
        const productName = this.extractProductName(productDiv);
        const productPrice = this.extractProductPrice(productDiv);

        // Create crypto payment section
        const cryptoSection = document.createElement('div');
        cryptoSection.className = 'crypto-payment-options';
        cryptoSection.innerHTML = `
            <h4>💰 Pay with Cryptocurrency</h4>
            <div class="crypto-buttons">
                ${this.shop.getSupportedCryptocurrencies().map(crypto => `
                    <button class="crypto-btn" data-crypto="${crypto.name}" data-product="${productName}" data-price="${productPrice}">
                        ${crypto.icon} Pay with ${crypto.name}
                    </button>
                `).join('')}
            </div>
            <div id="payment-modal" class="payment-modal" style="display: none;">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3>Complete Your Payment</h3>
                    <div id="payment-details"></div>
                </div>
            </div>
        `;

        // Insert after existing buttons
        const existingButton = productDiv.querySelector('button');
        if (existingButton) {
            existingButton.parentNode.insertBefore(cryptoSection, existingButton.nextSibling);
        }

        // Add event listeners
        this.setupCryptoButtonListeners(cryptoSection);
    }

    setupCryptoButtonListeners(cryptoSection) {
        const cryptoButtons = cryptoSection.querySelectorAll('.crypto-btn');
        const modal = cryptoSection.querySelector('#payment-modal');
        const closeBtn = cryptoSection.querySelector('.close');

        cryptoButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const crypto = btn.dataset.crypto;
                const product = btn.dataset.product;
                const price = btn.dataset.price;
                
                await this.showPaymentModal(crypto, product, price);
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    async showPaymentModal(cryptoType, productName, price) {
        const modal = document.getElementById('payment-modal');
        const details = document.getElementById('payment-details');
        
        try {
            // Get shop addresses
            const addresses = this.shop.getShopAddresses();
            const shopAddress = addresses[cryptoType];
            
            // Create payment details
            details.innerHTML = `
                <div class="payment-info">
                    <h4>🛍️ Product: ${productName}</h4>
                    <p><strong>Price:</strong> ${price} USD</p>
                    <p><strong>Payment Method:</strong> ${cryptoType}</p>
                    <p><strong>Shop Address:</strong></p>
                    <div class="address-box">
                        <code>${shopAddress}</code>
                        <button onclick="copyAddress('${shopAddress}')" class="copy-btn">📋 Copy</button>
                    </div>
                    <p><strong>Instructions:</strong></p>
                    <ol>
                        <li>Send <strong>${price} USD equivalent</strong> of ${cryptoType} to the address above</li>
                        <li>Wait for network confirmation</li>
                        <li>Include your email in the transaction memo for product delivery</li>
                    </ol>
                    <div class="qr-placeholder">
                        <p>📱 QR Code will be generated here</p>
                        <small>Address: ${shopAddress}</small>
                    </div>
                    <button onclick="confirmPayment('${cryptoType}', '${productName}', '${price}')" class="confirm-btn">
                        ✅ I've Sent the Payment
                    </button>
                </div>
            `;
            
            modal.style.display = 'block';
            
        } catch (error) {
            console.error('Error showing payment modal:', error);
            this.shop.showError('Failed to load payment details');
        }
    }

    extractProductName(productDiv) {
        const title = productDiv.querySelector('h3');
        return title ? title.textContent.replace('Buy ', '').replace('Download ', '') : 'Unknown Product';
    }

    extractProductPrice(productDiv) {
        const priceText = productDiv.querySelector('p');
        if (priceText && priceText.textContent.includes('USD')) {
            return priceText.textContent.match(/\d+/)[0];
        }
        return '0';
    }
}

// Global functions for button handlers
function copyAddress(address) {
    navigator.clipboard.writeText(address).then(() => {
        alert('Address copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy address:', err);
    });
}

async function confirmPayment(cryptoType, productName, price) {
    try {
        // In a real implementation, this would verify the transaction
        const shop = window.freetimeShop;
        const customerAddress = prompt('Please enter your wallet address for verification:');
        
        if (customerAddress) {
            const result = await shop.processPayment(cryptoType, price, customerAddress, productName);
            
            // Show success message
            alert(`Payment initiated! Please send ${price} USD equivalent of ${cryptoType} to the provided address. We'll send your product code to your email after confirmation.`);
            
            // Close modal
            document.getElementById('payment-modal').style.display = 'none';
        }
    } catch (error) {
        alert('Payment confirmation failed: ' + error.message);
    }
}

// Initialize shop when page loads
window.addEventListener('DOMContentLoaded', async () => {
    window.freetimeShop = new FreetimeShop();
    window.paymentUI = new PaymentUI(window.freetimeShop);
    
    // Wait for initialization
    setTimeout(() => {
        if (window.freetimeShop.isInitialized) {
            console.log('🚀 Freetime Shop with crypto payments ready!');
        }
    }, 1000);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FreetimeShop, PaymentUI };
}
