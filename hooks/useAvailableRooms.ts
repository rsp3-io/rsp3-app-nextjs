'use client';

import { useMemo } from 'react';
import { useReadContract } from 'wagmi';
import { useAuth } from '@/contexts/AuthContext';
import { GameRoom } from '@/types';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { RSP3_ABI } from '@/abi/rsp3';

export function useAvailableRooms() {
  const { accountAddress } = useAuth();

  const { data: rooms, refetch, isLoading, isFetching, error } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getAvailableRooms',
    args: [],
    query: {
      enabled: !!CONTRACT_CONFIG.rsp3Address,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  // Filter out rooms created by the logged-in user and sort by roomId (newest first)
  const filteredRooms = useMemo(() => {
    if (!rooms || !accountAddress) return [];
    return (rooms as GameRoom[])
      .filter(room => room.playerA.toLowerCase() !== accountAddress.toLowerCase())
      .sort((a, b) => Number(b.roomId) - Number(a.roomId)); // Sort by roomId descending (newest first)
  }, [rooms, accountAddress]);

  return {
    rooms: filteredRooms,
    refetch,
    isLoading: isLoading || isFetching, // Include both initial loading and refetching
    error,
  };
}
