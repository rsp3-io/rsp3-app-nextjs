'use client';

import { useAccount, useReadContract } from 'wagmi';
import { useAuth } from '@/contexts/AuthContext';
import { GameRoom } from '@/types';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { RSP3_ABI } from '@/abi/rsp3';

export function usePlayerActiveRooms() {
  const { accountAddress } = useAuth();
  const { address } = useAccount();

  const { data: rooms, refetch, isLoading, error } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getPlayerActiveRooms',
    args: (accountAddress || address) ? [accountAddress || address] as [`0x${string}`] : undefined,
    query: {
      enabled: !!(accountAddress || address) && !!CONTRACT_CONFIG.rsp3Address,
      refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    },
  });

  return {
    rooms: rooms as GameRoom[] | undefined,
    refetch,
    isLoading,
    error,
  };
}
