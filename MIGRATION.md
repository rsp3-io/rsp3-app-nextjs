# Migration Guide: React MVC to Next.js

This document outlines the migration from the React MVC version (`rsp3-app-mvc`) to the Next.js version (`rsp3-app-nextjs`) with Immutable Passport integration.

## Key Changes

### 1. Framework Migration
- **From**: React with Vite + React Router
- **To**: Next.js 15 with App Router

### 2. Authentication System
- **From**: RainbowKit + Wagmi
- **To**: Immutable Passport + Wagmi

### 3. Project Structure
```
rsp3-app-nextjs/
├── app/                    # Next.js App Router (replaces src/pages)
│   ├── dashboard/         # Main authenticated area
│   ├── rooms/            # Game rooms (migrated from RoomsPage)
│   ├── my-games/         # User games (migrated from MyGamesPage)
│   ├── create-room/      # Room creation
│   ├── redirect/         # Passport auth callback
│   └── logout/           # Logout handler
├── components/           # Reusable components
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state
│   └── ToastContext.tsx # Notifications
├── hooks/               # Custom hooks
├── lib/                 # Utilities and configurations
│   ├── passport.ts      # Passport configuration
│   ├── wagmi.ts         # Wagmi configuration
│   └── contracts.ts     # Contract configurations
└── types/               # TypeScript type definitions
```

## Migration Checklist

### ✅ Completed
- [x] Project structure setup
- [x] Immutable Passport integration
- [x] Authentication context and guards
- [x] Basic routing with App Router
- [x] Landing page with sign-in button
- [x] Protected route implementation
- [x] Toast notification system
- [x] TypeScript configuration
- [x] Basic testing setup

### 🔄 In Progress / Next Steps
- [ ] Migrate game components from React MVC
- [ ] Integrate smart contract ABIs
- [ ] Implement game logic hooks
- [ ] Add USDT token integration
- [ ] Migrate existing game pages
- [ ] Add comprehensive error handling
- [ ] Implement game state management

## Component Migration Map

| React MVC Component | Next.js Equivalent | Status |
|-------------------|-------------------|---------|
| `HomePage.tsx` | `app/page.tsx` | ✅ Migrated (simplified) |
| `RoomsPage.tsx` | `app/rooms/page.tsx` | 🔄 Placeholder created |
| `MyGamesPage.tsx` | `app/my-games/page.tsx` | 🔄 Placeholder created |
| `CreateRoomModal.tsx` | `app/create-room/page.tsx` | 🔄 Placeholder created |
| `Button.tsx` | Tailwind classes | 🔄 To be migrated |
| `Card.tsx` | Tailwind classes | 🔄 To be migrated |
| `Layout.tsx` | `app/layout.tsx` | ✅ Migrated |

## Authentication Flow Changes

### Old Flow (React MVC)
1. User connects wallet via RainbowKit
2. Wallet connection provides authentication
3. Routes are protected based on wallet connection

### New Flow (Next.js + Passport)
1. User clicks "Sign in with Immutable Passport"
2. Redirects to Immutable Passport authentication
3. Passport handles wallet connection and user identity
4. Returns to app with authenticated state
5. Routes are protected based on Passport authentication

## Environment Variables

### New Required Variables
```env
# Immutable Passport
NEXT_PUBLIC_PUBLISHABLE_KEY=your_publishable_key
NEXT_PUBLIC_CLIENT_ID=your_client_id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/redirect
NEXT_PUBLIC_LOGOUT_REDIRECT_URI=http://localhost:3000/logout

# Contract addresses
NEXT_PUBLIC_RSP3_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDT_CONTRACT_ADDRESS=0x...
```

### Removed Variables
- `VITE_WC_PROJECT_ID` (RainbowKit project ID)
- `VITE_RPC_TESTNET` (now `NEXT_PUBLIC_RPC_TESTNET`)

## Next Steps for Full Migration

1. **Install Dependencies**
   ```bash
   cd rsp3-app-nextjs
   pnpm install
   ```

2. **Configure Environment**
   - Copy environment variables to `.env.local`
   - Set up Immutable Passport credentials

3. **Migrate Game Components**
   - Copy and adapt components from `rsp3-app-mvc/src/components/`
   - Update to use new authentication context
   - Replace RainbowKit components with Passport equivalents

4. **Integrate Smart Contracts**
   - Copy ABI files from `rsp3-smart-contracts`
   - Update contract interaction hooks
   - Test contract functionality

5. **Add Game Logic**
   - Implement room creation and joining
   - Add move submission and game resolution
   - Integrate USDT token operations

6. **Testing and Deployment**
   - Run Playwright tests
   - Test authentication flow
   - Deploy to production

## Benefits of Migration

1. **Better Authentication**: Immutable Passport provides more robust Web3 authentication
2. **Improved Performance**: Next.js App Router with better optimization
3. **Better SEO**: Server-side rendering capabilities
4. **Modern Architecture**: Latest React patterns and best practices
5. **Enhanced Security**: Passport handles wallet security and user management
6. **Better UX**: Seamless authentication flow with proper redirects

## Troubleshooting

### Common Issues
1. **Passport Configuration**: Ensure all environment variables are set correctly
2. **Redirect URIs**: Must match exactly in Immutable Hub configuration
3. **CORS Issues**: Check that redirect URIs are properly configured
4. **Build Errors**: Ensure all dependencies are installed and compatible

### Getting Help
- Check the [Immutable Passport documentation](https://docs.immutable.com/docs/passport/overview)
- Review the example implementations in `ts-immutable-sdk/examples/passport/`
- Check the Next.js documentation for App Router specifics
