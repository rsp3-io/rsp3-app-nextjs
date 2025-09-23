'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { ERC20_ABI } from '@/abi/erc20';
import { passportInstance } from '@/lib/passport';
import { encodeFunctionData, parseAbi } from 'viem';

export function useUSDTFaucet() {
  const { accountAddress } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const executeFaucet = async () => {
    if (!accountAddress || !CONTRACT_CONFIG.usdtAddress) {
      throw new Error('Account or contract address not available');
    }

    setIsPending(true);
    setError(null);
    setIsConfirmed(false);

    try {
      // Get the provider from Passport
      const provider = await passportInstance.connectEvm();
      
      // Encode the faucet function call
      const data = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'faucet',
        args: [],
      });

      // Send the transaction
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accountAddress,
          to: CONTRACT_CONFIG.usdtAddress,
          data: data,
        }],
      }) as `0x${string}`;

      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);

      // Wait for transaction confirmation
      const receipt = await provider.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      });

      // Poll for confirmation
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout
      
      while (!receipt && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentReceipt = await provider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash],
        });
        
        if (currentReceipt) {
          setIsConfirming(false);
          setIsConfirmed(true);
          return;
        }
        
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Transaction confirmation timeout');
      }

    } catch (error) {
      console.error('Faucet transaction failed:', error);
      setError(error as Error);
      setIsPending(false);
      setIsConfirming(false);
      throw error;
    }
  };

  return {
    faucet: executeFaucet,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}
