'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useAuth } from '@/contexts/AuthContext';
import { GameRoom, Move, GameResult } from '@/types';

export function useGame() {
  const { accountAddress } = useAuth();
  const { address } = useAccount();
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [myGames, setMyGames] = useState<GameRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // This will be implemented when we integrate with the smart contracts
  const createRoom = async (betAmount: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement contract interaction
      console.log('Creating room with bet amount:', betAmount);
    } catch (error) {
      console.error('Failed to create room:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (roomId: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement contract interaction
      console.log('Joining room:', roomId);
    } catch (error) {
      console.error('Failed to join room:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const makeMove = async (roomId: string, move: 'rock' | 'paper' | 'scissors') => {
    setIsLoading(true);
    try {
      // TODO: Implement contract interaction
      console.log('Making move:', move, 'in room:', roomId);
    } catch (error) {
      console.error('Failed to make move:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawFunds = async (roomId: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement contract interaction
      console.log('Withdrawing funds from room:', roomId);
    } catch (error) {
      console.error('Failed to withdraw funds:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Load user's games
  useEffect(() => {
    if (accountAddress) {
      // TODO: Load games from contract or API
      console.log('Loading games for user:', accountAddress);
    }
  }, [accountAddress]);

  return {
    rooms,
    myGames,
    isLoading,
    createRoom,
    joinRoom,
    makeMove,
    withdrawFunds,
  };
}
