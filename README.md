# RSP3 Next.js App

RSP3 is a decentralized Rock Scissors Paper game built on Immutable zkEVM with Next.js and Immutable Passport integration.

## Features

- 🔐 **Immutable Passport Authentication** - Secure Web3 authentication
- 🎮 **Game Rooms** - Create and join game rooms
- 💰 **Blockchain Integration** - Built on Immutable zkEVM
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🛡️ **Route Protection** - Authentication guards for protected pages

## Project Structure

```
rsp3-app-nextjs/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main authenticated dashboard
│   ├── rooms/            # Game rooms listing
│   ├── my-games/         # User's game history
│   ├── create-room/      # Room creation
│   ├── redirect/         # Passport auth redirect handler
│   └── logout/           # Logout page
├── components/           # Reusable React components
│   ├── AuthGuard.tsx    # Route protection component
│   └── Providers.tsx    # App-wide providers
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state management
└── lib/                # Utility libraries
    ├── passport.ts      # Passport configuration
    └── wagmi.ts         # Wagmi configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Immutable Hub account for Passport credentials

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Immutable Passport Configuration
NEXT_PUBLIC_PUBLISHABLE_KEY=your_publishable_key_here
NEXT_PUBLIC_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/redirect
NEXT_PUBLIC_LOGOUT_REDIRECT_URI=http://localhost:3000/logout

# RPC Configuration
NEXT_PUBLIC_RPC_TESTNET=https://rpc.testnet.immutable.com

# Environment
NEXT_PUBLIC_ENVIRONMENT=sandbox
```

### 3. Get Immutable Passport Credentials

1. Visit the [Immutable Hub](https://hub.immutable.com/)
2. Create a new project or use an existing one
3. Navigate to the Passport section
4. Generate your publishable key and client ID
5. Configure redirect URIs:
   - Redirect URI: `http://localhost:3000/redirect`
   - Logout URI: `http://localhost:3000/logout`

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Authentication Flow

1. **Landing Page** (`/`) - Shows "Sign in with Immutable Passport" button
2. **Passport Authentication** - Redirects to Immutable Passport for authentication
3. **Redirect Handler** (`/redirect`) - Processes the authentication callback
4. **Protected Routes** - Dashboard and game pages require authentication
5. **Auto-redirect** - Unauthenticated users are redirected to the landing page

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Immutable Passport** - Web3 authentication and wallet management
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **TanStack Query** - Data fetching and caching

## Available Scripts

```bash
# Development
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm start         # Start production server
pnpm lint          # Run ESLint
pnpm test          # Run Playwright tests
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Update redirect URIs in Immutable Hub to match your production domain

### Other Platforms

The app can be deployed to any platform that supports Next.js. Make sure to:

1. Set all required environment variables
2. Update redirect URIs in Immutable Hub
3. Configure the build command: `pnpm build`
4. Set the output directory to `.next`

## Integration with RSP3 Smart Contracts

This frontend is designed to integrate with the RSP3 smart contracts located in the `rsp3-smart-contracts` directory. The contracts handle:

- Game room creation and management
- Player moves and game logic
- USDT token deposits and withdrawals
- Game result verification

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit them: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is part of the RSP3 game suite and follows the same licensing terms.