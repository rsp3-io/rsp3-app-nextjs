import { config, passport } from '@imtbl/sdk';

// Passport instance configuration for RSP3
export const passportInstance = new passport.Passport({
  baseConfig: {
    environment: config.Environment.SANDBOX, // Use PRODUCTION for production
    publishableKey: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY || '', // replace with your publishable API key from Hub
  },
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '', // replace with your client ID from Hub
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/redirect',
  logoutRedirectUri: process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URI || 'http://localhost:3000/logout',
  audience: 'platform_api',
  scope: 'openid offline_access email transact',
});
