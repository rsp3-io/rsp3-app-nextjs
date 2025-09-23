# Balance Display Feature

This document describes the balance display feature implemented in the RSP3 Next.js application.

## Overview

The balance display feature shows both wallet USDT balance and in-game balance (free and locked) in the dashboard header. This provides users with real-time visibility into their funds across different contexts.

## Components

### 1. Balance Hooks (`hooks/useBalance.ts`)

- **`useUSDTBalance()`**: Fetches wallet USDT balance from the USDT contract
- **`usePlayerBalance()`**: Fetches in-game balance (free and locked) from the RSP3 contract
- **`useBalances()`**: Combined hook that fetches both balances
- **`formatBalance()`**: Utility function to format balance amounts

### 2. Balance Display Component (`components/BalanceDisplay.tsx`)

Displays:
- **Wallet Balance**: USDT balance in the user's wallet (green indicator)
- **In-Game Balance**: Total balance in the game contract (blue indicator)
- **Balance Breakdown**: Shows free vs locked amounts when in-game balance exists
- **Loading States**: Shows spinner while fetching balances
- **Error Handling**: Displays error message if balance fetch fails

### 3. Integration

The balance display is integrated into the dashboard header (`app/dashboard/page.tsx`) and is:
- **Responsive**: Adapts to mobile and desktop layouts
- **Real-time**: Auto-refreshes every 10 seconds
- **Conditional**: Only shows when user is authenticated

## Features

### Visual Indicators
- 🟢 Green dot: Wallet USDT balance
- 🔵 Blue dot: In-game balance
- Loading spinner during data fetch
- Error state for failed requests

### Responsive Design
- **Desktop**: Horizontal layout with all balances in one row
- **Mobile**: Vertical stack with proper spacing
- **Tablet**: Adaptive layout that works on medium screens

### Real-time Updates
- Balances refresh every 10 seconds automatically
- Manual refresh capability through the hooks
- Optimistic updates for better UX

## Configuration

### Environment Variables Required

```env
# Smart Contract Addresses
NEXT_PUBLIC_RSP3_CONTRACT_ADDRESS=0x...  # RSP3 game contract
NEXT_PUBLIC_USDT_CONTRACT_ADDRESS=0x...  # USDT token contract
```

### Contract ABIs

The feature uses mock ABIs that will be replaced with actual contract ABIs:

- **USDT ABI**: `balanceOf(address)` function
- **RSP3 ABI**: `getPlayerBalance(address)` function returning `(freeBalance, lockedBalance)`

## Usage

```tsx
import BalanceDisplay from '@/components/BalanceDisplay';

// In your component
<BalanceDisplay />
```

The component automatically:
1. Checks if user is authenticated
2. Fetches balances from contracts
3. Displays appropriate loading/error states
4. Formats and displays balance information

## Faucet Feature

The balance display now includes a faucet button that allows users to get test USDT tokens on the testnet:

### Features
- **Faucet Button**: Small green button next to wallet balance
- **Loading States**: Shows spinner and "Getting..." text during transaction
- **Success Feedback**: Toast notification when tokens are received
- **Error Handling**: Displays error messages if faucet fails
- **Auto-refresh**: Balance automatically updates after successful faucet

### Usage
1. Click the "Faucet" button next to the wallet balance
2. Confirm the transaction in your wallet
3. Wait for confirmation (shows loading state)
4. Receive success notification and see updated balance

### Technical Implementation
- Uses `useUSDTFaucet()` hook for contract interaction
- Calls the `faucet()` function on the MockUSDT contract
- Automatically refetches balances after successful transaction
- Provides comprehensive error handling and user feedback

## Future Enhancements

- [ ] Add deposit/withdraw buttons to balance display
- [ ] Show balance history/charts
- [ ] Add balance notifications for low funds
- [ ] Implement balance refresh on user action
- [ ] Add balance tooltips with more details
- [ ] Add faucet cooldown/rate limiting
- [ ] Show faucet amount in UI
