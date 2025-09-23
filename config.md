# Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

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

## Getting Immutable Passport Credentials

1. Go to the [Immutable Hub](https://hub.immutable.com/)
2. Create a new project or use an existing one
3. Navigate to the Passport section
4. Generate your publishable key and client ID
5. Configure your redirect URIs:
   - Redirect URI: `http://localhost:3000/redirect`
   - Logout URI: `http://localhost:3000/logout`

## Development Setup

1. Copy the environment variables above to `.env.local`
2. Replace the placeholder values with your actual credentials
3. Run `pnpm install` to install dependencies
4. Run `pnpm dev` to start the development server
