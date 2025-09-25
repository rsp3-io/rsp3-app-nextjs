'use client';

import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useAuth } from '@/contexts/AuthContext';
import { GameRoom } from '@/types';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { RSP3_ABI } from '@/abi/rsp3';

interface UseGameHistoryParams {
  offset?: number;
  limit?: number;
  enabled?: boolean;
}

export function useGameHistory(params: UseGameHistoryParams = {}) {
  const { offset = 0, limit = 20, enabled = true } = params;
  const { accountAddress } = useAuth();
  const { address } = useAccount();

  const userAddress = accountAddress || address;

  // Get total count of games
  const { data: totalCount, refetch: refetchCount } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getPlayerGameHistoryCount',
    args: userAddress ? [userAddress] as [`0x${string}`] : undefined,
    query: {
      enabled: !!userAddress && !!CONTRACT_CONFIG.rsp3Address && enabled,
    },
  });

  // Get paginated game history
  const { data: gameHistory, refetch: refetchHistory, isLoading, error } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getPlayerGameHistory',
    args: userAddress ? [userAddress, BigInt(offset), BigInt(limit)] as [`0x${string}`, bigint, bigint] : undefined,
    query: {
      enabled: !!userAddress && !!CONTRACT_CONFIG.rsp3Address && enabled,
    },
  });

  const refetch = async () => {
    await Promise.all([refetchCount(), refetchHistory()]);
  };

  return {
    gameHistory: gameHistory as GameRoom[] | undefined,
    totalCount: totalCount ? Number(totalCount) : 0,
    refetch,
    isLoading,
    error,
  };
}

export function useGameHistoryPaginated() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const { gameHistory, totalCount, refetch, isLoading, error } = useGameHistory({
    offset: currentPage * pageSize,
    limit: pageSize,
  });

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages - 1;
  const hasPreviousPage = currentPage > 0;

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(0);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages - 1);
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    gameHistory,
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    error,
    refetch,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    goToPage,
    setPageSize,
  };
}
