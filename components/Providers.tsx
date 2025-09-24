'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { BalanceProvider } from '@/contexts/BalanceContext';
import { wagmiConfig } from '@/lib/wagmi';
import { useState } from 'react';
import ReferralHandler from './ReferralHandler';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BalanceProvider>
            <ToastProvider>
              {children}
              <ReferralHandler />
            </ToastProvider>
          </BalanceProvider>
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
