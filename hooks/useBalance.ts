'use client';

import { useAccount, useReadContract } from 'wagmi';
import { useAuth } from '@/contexts/AuthContext';
import { PlayerBalance } from '@/types';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { formatUnits } from 'viem';
import { ERC20_ABI } from '@/abi/erc20';
import { RSP3_ABI } from '@/abi/rsp3';

export function useUSDTBalance() {
  const { accountAddress } = useAuth();
  const { address } = useAccount();

  const { data: balance, refetch, isLoading, error } = useReadContract({
    address: CONTRACT_CONFIG.usdtAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: (accountAddress || address) ? [accountAddress || address] as [`0x${string}`] : undefined,
    query: {
      enabled: !!(accountAddress || address) && !!CONTRACT_CONFIG.usdtAddress,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  return {
    balance: balance as bigint | undefined,
    refetch,
    isLoading,
    error,
  };
}

export function usePlayerBalance() {
  const { accountAddress } = useAuth();
  const { address } = useAccount();

  const { data: balance, refetch, isLoading, error } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getPlayerBalance',
    args: (accountAddress || address) ? [accountAddress || address] as [`0x${string}`] : undefined,
    query: {
      enabled: !!(accountAddress || address) && !!CONTRACT_CONFIG.rsp3Address,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  return {
    balance: balance as PlayerBalance | undefined,
    refetch,
    isLoading,
    error,
  };
}

// Utility function to format balance
export function formatBalance(amount: bigint | undefined, decimals: number = 6): string {
  if (!amount) return '0.00';
  return formatUnits(amount, decimals);
}

// Hook to get both balances
export function useBalances() {
  const usdtBalance = useUSDTBalance();
  const playerBalance = usePlayerBalance();

  return {
    usdtBalance: usdtBalance.balance,
    playerBalance: playerBalance.balance,
    isLoading: usdtBalance.isLoading || playerBalance.isLoading,
    refetch: () => {
      usdtBalance.refetch();
      playerBalance.refetch();
    },
    error: usdtBalance.error || playerBalance.error,
  };
}
