'use client';

import { useState } from 'react';
import { encodeFunctionData } from 'viem';
import { RSP3_ABI } from '@/abi/rsp3';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { Move } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { useBalanceContext } from '@/contexts/BalanceContext';
import { passportInstance } from '@/lib/passport';

export function useRevealMove() {
  const { accountAddress } = useAuth();
  const { addToast } = useToast();
  const { refetchBalances } = useBalanceContext();
  const [isLoading, setIsLoading] = useState(false);

  const revealMove = async (roomId: number, move: Move, salt: string) => {
    if (!accountAddress || !CONTRACT_CONFIG.rsp3Address) {
      throw new Error('Account or contract address not available');
    }

    setIsLoading(true);
    try {
      // Get the provider from Passport
      const provider = await passportInstance.connectEvm();
      
      // Encode the function call
      const revealMoveData = encodeFunctionData({
        abi: RSP3_ABI,
        functionName: 'revealMove',
        args: [BigInt(roomId), move, salt],
      });

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accountAddress,
          to: CONTRACT_CONFIG.rsp3Address,
          data: revealMoveData,
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
          // Refetch balances after successful move reveal
          refetchBalances();
          
          addToast({ title: 'Move revealed successfully!', type: 'success' });
          return txHash;
        }
        
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Transaction confirmation timeout');
      }

    } catch (error: any) {
      console.error('Error revealing move:', error);
      addToast({ 
        title: 'Failed to reveal move', 
        message: error.message || 'Transaction failed', 
        type: 'error' 
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    revealMove,
    isLoading,
  };
}
