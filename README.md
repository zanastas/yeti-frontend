# Yeti Frontend

A Next.js-based trading interface for automating TradingView indicators and limit order execution on decentralized exchanges.

## Features

- **Next.js 14**: Modern React framework with SSR and optimization
- **Privy Wallet Integration**: Connect and manage crypto wallets
- **Multi-Chain Support**: Ethereum, Arbitrum, Polygon, Optimism
- **Token Trading Interface**: Swap interface with limit order functionality
- **TradingView Integration**: Set up alerts with webhook support
- **1inch-Inspired Design**: Modern dark theme with gradient buttons
- **CSS Modules**: Scoped styling for better maintainability

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Privy**
   - Sign up at [privy.io](https://privy.io)
   - Create a new app and get your App ID
   - Update `.env` file:
   ```
   NEXT_PUBLIC_PRIVY_APP_ID=your-actual-privy-app-id
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:3000`

## Configuration

### Privy Setup
1. Go to [Privy Dashboard](https://dashboard.privy.io)
2. Create a new app
3. Configure allowed domains (add `localhost:3000` for development)
4. Copy your App ID to the `.env` file

### TradingView Webhook
The interface provides a webhook URL for TradingView alerts:
```
https://api.yeti.trade/webhook/alert
```

## Usage

1. **Connect Wallet**: Click the connect button in the top right
2. **Select Tokens**: Choose tokens to trade using the dropdown menus
3. **Set Amount**: Enter amounts or use 50%/Max buttons
4. **Set Expiry**: Choose when the limit order expires
5. **Configure Alert**: Set up TradingView alert with the provided webhook
6. **Place Order**: Execute the limit order

## Tech Stack

- **Next.js 14**: React framework with SSR and optimization
- **React 18**: Frontend library
- **Privy**: Wallet connection and authentication
- **Wagmi**: Ethereum React hooks
- **Lucide React**: Icon library
- **CSS Modules**: Scoped styling

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## License

MIT License