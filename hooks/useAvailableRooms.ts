'use client';

import { useMemo } from 'react';
import { useReadContract } from 'wagmi';
import { useAuth } from '@/contexts/AuthContext';
import { GameRoom } from '@/types';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { RSP3_ABI } from '@/abi/rsp3';

export function useAvailableRooms() {
  const { accountAddress } = useAuth();

  const { data: rooms, refetch, isLoading, error } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getAvailableRooms',
    args: [],
    query: {
      enabled: !!CONTRACT_CONFIG.rsp3Address,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  // Filter out rooms created by the logged-in user
  const filteredRooms = useMemo(() => {
    if (!rooms || !accountAddress) return [];
    return (rooms as GameRoom[]).filter(
      room => room.playerA.toLowerCase() !== accountAddress.toLowerCase()
    );
  }, [rooms, accountAddress]);

  return {
    rooms: filteredRooms,
    refetch,
    isLoading,
    error,
  };
}
