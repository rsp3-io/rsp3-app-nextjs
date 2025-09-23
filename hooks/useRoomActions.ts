'use client';

import { useState } from 'react';
import { encodeFunctionData } from 'viem';
import { RSP3_ABI } from '@/abi/rsp3';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { passportInstance } from '@/lib/passport';

export function useCancelExpiredRoom() {
  const { accountAddress } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const cancelExpiredRoom = async (roomId: number) => {
    if (!accountAddress || !CONTRACT_CONFIG.rsp3Address) {
      throw new Error('Account or contract address not available');
    }

    setIsLoading(true);
    try {
      // Get the provider from Passport
      const provider = await passportInstance.connectEvm();
      
      // Encode the function call
      const cancelRoomData = encodeFunctionData({
        abi: RSP3_ABI,
        functionName: 'cancelExpiredRoom',
        args: [BigInt(roomId)],
      });

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accountAddress,
          to: CONTRACT_CONFIG.rsp3Address,
          data: cancelRoomData,
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
          addToast({ title: 'Room cancelled successfully!', type: 'success' });
          return txHash;
        }
        
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Transaction confirmation timeout');
      }

    } catch (error: any) {
      console.error('Error cancelling room:', error);
      addToast({ 
        title: 'Failed to cancel room', 
        message: error.message || 'Transaction failed', 
        type: 'error' 
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cancelExpiredRoom,
    isLoading,
  };
}

export function useClaimForfeit() {
  const { accountAddress } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const claimForfeit = async (roomId: number) => {
    if (!accountAddress || !CONTRACT_CONFIG.rsp3Address) {
      throw new Error('Account or contract address not available');
    }

    setIsLoading(true);
    try {
      // Get the provider from Passport
      const provider = await passportInstance.connectEvm();
      
      // Encode the function call
      const claimForfeitData = encodeFunctionData({
        abi: RSP3_ABI,
        functionName: 'claimForfeit',
        args: [BigInt(roomId)],
      });

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accountAddress,
          to: CONTRACT_CONFIG.rsp3Address,
          data: claimForfeitData,
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
          addToast({ title: 'Forfeit claimed successfully!', type: 'success' });
          return txHash;
        }
        
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Transaction confirmation timeout');
      }

    } catch (error: any) {
      console.error('Error claiming forfeit:', error);
      addToast({ 
        title: 'Failed to claim forfeit', 
        message: error.message || 'Transaction failed', 
        type: 'error' 
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claimForfeit,
    isLoading,
  };
}
