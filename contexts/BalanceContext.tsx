'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { useBalances } from '@/hooks/useBalance';

interface BalanceContextType {
  usdtBalance: bigint | undefined;
  playerBalance: any;
  isLoading: boolean;
  error: any;
  refetchBalances: () => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const { usdtBalance, playerBalance, isLoading, error, refetch } = useBalances();

  const refetchBalances = useCallback(() => {
    console.log('🔄 Refetching balances...');
    refetch();
  }, [refetch]);

  return (
    <BalanceContext.Provider
      value={{
        usdtBalance,
        playerBalance,
        isLoading,
        error,
        refetchBalances,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalanceContext() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalanceContext must be used within a BalanceProvider');
  }
  return context;
}
