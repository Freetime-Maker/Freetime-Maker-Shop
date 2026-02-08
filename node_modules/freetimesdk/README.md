# Freetime Payment SDK - Node.js

A completely self-contained, open-source multi-cryptocurrency payment SDK for Node.js and browsers, ported from the original Android SDK.

## Features

- **Multi-Coin Support**: 9 cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), Bitcoin Cash (BCH), Dogecoin (DOGE), Solana (SOL), Polygon (MATIC), Binance Coin (BNB), and Tron (TRX)
- **Developer Fee System**: Tiered fee structure (0.05% - 0.5%) with app.ncwallet.net-compatible wallets
- **USD Payment Gateway**: Automatic USD to cryptocurrency conversion with real-time rates
- **Production-Ready**: Enhanced security, health monitoring, and statistics
- **Fully Self-Contained**: No external dependencies or API calls required
- **Local Cryptography**: All cryptographic operations performed locally
- **Wallet Management**: Create and manage multiple wallets
- **Transaction Builder**: Create and sign transactions
- **Open Source**: Fully transparent and verifiable code

## Installation

```bash
npm install @freetimemaker/sdk
```

## Quick Start

### 1. Initialize SDK

```javascript
import { FreetimePaymentSDK, CoinType } from '@freetimemaker/sdk';

const sdk = new FreetimePaymentSDK();
```

### 2. Create Wallet

```javascript
// Create Bitcoin wallet
const bitcoinWallet = sdk.createWallet(CoinType.BITCOIN, 'My Bitcoin Wallet');

// Create Ethereum wallet
const ethereumWallet = sdk.createWallet(CoinType.ETHEREUM, 'My Ethereum Wallet');

// Create Litecoin wallet
const litecoinWallet = sdk.createWallet(CoinType.LITECOIN, 'My Litecoin Wallet');
```

### 3. Check Balance

```javascript
const balance = await sdk.getBalance(bitcoinWallet.address);
console.log(`Bitcoin balance: ${balance} BTC`);
```

### 4. Send Cryptocurrency

```javascript
const amount = '0.001';
const recipientAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';

const result = await sdk.send(
  fromAddress = bitcoinWallet.address,
  toAddress = recipientAddress,
  amount = amount,
  coinType = CoinType.BITCOIN
);

// Display fee breakdown
console.log(result.feeBreakdown.getFormattedBreakdown());

// Broadcast the transaction
const txHash = await result.broadcast();
console.log(`Transaction sent: ${txHash}`);
```

### 5. Fee Estimation

```javascript
const fee = await sdk.getFeeEstimate(
  fromAddress = bitcoinWallet.address,
  toAddress = recipientAddress,
  amount = amount,
  coinType = CoinType.BITCOIN
);

console.log(`Estimated fee: ${fee} BTC`);
```

### 6. Send Cryptocurrency with Developer Fees

```javascript
// Send cryptocurrency with automatic fee calculation
const result = await sdk.send(
  fromAddress = bitcoinWallet.address,
  toAddress = recipientAddress,
  amount = '0.1',
  coinType = CoinType.BITCOIN
);

// Display fee breakdown
console.log(result.feeBreakdown.getFormattedBreakdown());

/* Transaction Fee Breakdown (BTC):
Original Amount: 0.10000000 BTC
Network Fee: 0.00000100 BTC
Developer Fee (0.5%): 0.00050000 BTC
Total Fee: 0.00050100 BTC
Recipient Receives: 0.09949900 BTC
Developer Wallet: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
*/

// Broadcast the transaction
const txHash = await result.broadcast();
console.log(`Transaction sent: ${txHash}`);
```

## API Reference

### FreetimePaymentSDK

The main class for interacting with the payment SDK.

#### Methods

- `createWallet(coinType: CoinType, name?: string): Wallet` - Creates a new wallet
- `getBalance(address: string): Promise<string>` - Gets the balance of an address
- `send(fromAddress: string, toAddress: string, amount: string, coinType: CoinType): Promise<TransactionWithFees>` - Sends cryptocurrency with fee calculation
- `getFeeEstimate(...): Promise<string>` - Estimates transaction fee
- `getFeeManager(): FeeManager` - Gets the fee manager for developer fee configuration
- `getAllWallets(): Wallet[]` - Returns all wallets
- `getWalletsByCoinType(coinType: CoinType): Wallet[]` - Returns wallets by type
- `validateAddress(address: string, coinType: CoinType): boolean` - Validates an address

### Wallet

Represents a cryptocurrency wallet.

#### Properties

- `address: string` - The wallet address
- `coinType: CoinType` - The cryptocurrency type
- `publicKey: string` - The public key
- `privateKey: string` - The private key (keep secure!)

#### Methods

- `getBalance(paymentProvider: PaymentInterface): Promise<string>` - Check balance
- `send(toAddress: string, amount: string, paymentProvider: PaymentInterface): Promise<Transaction>` - Send

### TransactionWithFees

Represents a cryptocurrency transaction with fee breakdown.

#### Properties

- `transaction: Transaction` - The transaction details
- `feeBreakdown: FeeBreakdown` - Detailed fee information

#### Methods

- `broadcast(): Promise<string>` - Broadcasts the transaction to the network
- `getFormattedSummary(): string` - Gets formatted transaction summary

### FeeManager

Manages developer fees and wallet configuration.

#### Methods

- `getDeveloperFeePercentage(amount: string): string` - Gets fee percentage for amount
- `getFeeTier(amount: string): string` - Gets transaction tier information
- `getDeveloperWalletAddress(coinType: CoinType): string` - Gets developer wallet for cryptocurrency
- `getAllDeveloperWallets(): Map<CoinType, string>` - Gets all developer wallets
- `updateDeveloperWallet(coinType: CoinType, address: string): FeeManager` - Updates developer wallet
- `updateAllDeveloperWallets(wallets: Map<CoinType, string>): FeeManager` - Updates all developer wallets

## Developer Fees

The SDK implements a tiered fee structure to support ongoing development:

| Transaction Amount | Fee Percentage | Tier |
|-------------------|----------------|------|
| >= 1000 | 0.05% | Enterprise |
| >= 100 | 0.1% | Business |
| >= 10 | 0.25% | Professional |
| >= 1 | 0.35% | Standard |
| >= 0.1 | 0.4% | Basic |
| < 0.1 | 0.5% | Micro |

### Fee Management

```javascript
const feeManager = sdk.getFeeManager();

// Get current fee percentage
const feePercentage = feeManager.getDeveloperFeePercentage('1.5');
console.log(`Fee percentage: ${feePercentage}%`);

// Get fee tier
const tier = feeManager.getFeeTier('1.5');
console.log(`Tier: ${tier}`);

// Update developer wallet
feeManager.updateDeveloperWallet(CoinType.BITCOIN, 'new-developer-wallet-address');
```

## Supported Cryptocurrencies

- **Bitcoin (BTC)** - The original cryptocurrency
- **Ethereum (ETH)** - Smart contract platform
- **Litecoin (LTC)** - Faster Bitcoin alternative
- **Bitcoin Cash (BCH)** - Bitcoin fork with larger blocks
- **Dogecoin (DOGE)** - Popular meme cryptocurrency
- **Solana (SOL)** - High-performance blockchain
- **Polygon (MATIC)** - Ethereum scaling solution
- **Binance Coin (BNB)** - Exchange token
- **Tron (TRX)** - Decentralized entertainment platform

## Security

- All cryptographic operations are performed locally
- Private keys never leave your application
- Address validation for all supported cryptocurrencies
- Secure random number generation for wallet creation

## Production Environment

For production use, ensure you:

1. Store private keys securely (consider using hardware wallets)
2. Implement proper error handling
3. Use HTTPS for all network communications
4. Validate all user inputs
5. Monitor transaction status

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For support, please open an issue on the GitHub repository or contact the Freetime Maker team.

## About

This is the official Node.js port of the Freetime Payment SDK. For the original Android version, visit [FreetimeMaker/FreetimeSDK](https://github.com/FreetimeMaker/FreetimeSDK).
