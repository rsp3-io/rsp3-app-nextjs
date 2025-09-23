'use client';

import { useState } from 'react';
import { encodeFunctionData } from 'viem';
import { RSP3_ABI } from '@/abi/rsp3';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { Move } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { passportInstance } from '@/lib/passport';

export function useJoinRoom() {
  const { accountAddress } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const joinRoom = async (roomId: bigint, move: Move) => {
    if (!accountAddress || !CONTRACT_CONFIG.rsp3Address) {
      throw new Error('Account or contract address not available');
    }

    setIsLoading(true);
    try {
      // Get the provider from Passport
      const provider = await passportInstance.connectEvm();
      
      // Encode the function call
      const joinRoomData = encodeFunctionData({
        abi: RSP3_ABI,
        functionName: 'joinRoom',
        args: [roomId, move],
      });

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accountAddress,
          to: CONTRACT_CONFIG.rsp3Address,
          data: joinRoomData,
        }],
      }) as `0x${string}`;

      // Wait for transaction confirmation
      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const receipt = await provider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash],
        });
        
        if (receipt) {
          addToast({ title: 'Successfully joined room!', type: 'success' });
          return txHash;
        }
        
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Transaction confirmation timeout');
      }

    } catch (error: any) {
      console.error('Error joining room:', error);
      const errorMessage = error?.shortMessage || error?.message || 'Failed to join room';
      addToast({ title: errorMessage, type: 'error' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    joinRoom,
    isLoading,
  };
}
