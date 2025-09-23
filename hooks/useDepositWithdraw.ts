'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { ERC20_ABI } from '@/abi/erc20';
import { RSP3_ABI } from '@/abi/rsp3';
import { passportInstance } from '@/lib/passport';
import { encodeFunctionData, parseUnits, formatUnits } from 'viem';

export function useDeposit() {
  const { accountAddress } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const executeDeposit = async (amount: string, decimals: number = 6) => {
    if (!accountAddress || !CONTRACT_CONFIG.usdtAddress || !CONTRACT_CONFIG.rsp3Address) {
      throw new Error('Account or contract addresses not available');
    }

    if (!amount || parseFloat(amount) <= 0) {
      throw new Error('Invalid amount');
    }

    setIsPending(true);
    setError(null);
    setIsConfirmed(false);

    try {
      // Get the provider from Passport
      const provider = await passportInstance.connectEvm();
      
      // Parse the amount to wei
      const amountWei = parseUnits(amount, decimals);
      
      // First, check allowance
      const allowance = await provider.request({
        method: 'eth_call',
        params: [{
          to: CONTRACT_CONFIG.usdtAddress,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'allowance',
            args: [accountAddress, CONTRACT_CONFIG.rsp3Address],
          }),
        }, 'latest'],
      });

      const currentAllowance = BigInt(allowance as string);

      // If allowance is insufficient, approve first
      if (currentAllowance < amountWei) {
        const approveData = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [CONTRACT_CONFIG.rsp3Address, amountWei],
        });

        const approveHash = await provider.request({
          method: 'eth_sendTransaction',
          params: [{
            from: accountAddress,
            to: CONTRACT_CONFIG.usdtAddress,
            data: approveData,
          }],
        }) as `0x${string}`;

        // Wait for approval confirmation
        let approveAttempts = 0;
        const maxApproveAttempts = 30;
        
        while (approveAttempts < maxApproveAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const approveReceipt = await provider.request({
            method: 'eth_getTransactionReceipt',
            params: [approveHash],
          });
          
          if (approveReceipt) {
            break;
          }
          approveAttempts++;
        }

        if (approveAttempts >= maxApproveAttempts) {
          throw new Error('Approval transaction timeout');
        }
      }

      // Now execute the deposit
      const depositData = encodeFunctionData({
        abi: RSP3_ABI,
        functionName: 'deposit',
        args: [amountWei],
      });

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accountAddress,
          to: CONTRACT_CONFIG.rsp3Address,
          data: depositData,
        }],
      }) as `0x${string}`;

      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);

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
      console.error('Deposit transaction failed:', error);
      setError(error as Error);
      setIsPending(false);
      setIsConfirming(false);
      throw error;
    }
  };

  const reset = useCallback(() => {
    setIsPending(false);
    setIsConfirming(false);
    setIsConfirmed(false);
    setError(null);
    setHash(undefined);
  }, []);

  return {
    deposit: executeDeposit,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    reset,
  };
}

export function useWithdraw() {
  const { accountAddress } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const executeWithdraw = async (amount: string, decimals: number = 6) => {
    if (!accountAddress || !CONTRACT_CONFIG.rsp3Address) {
      throw new Error('Account or contract address not available');
    }

    if (!amount || parseFloat(amount) <= 0) {
      throw new Error('Invalid amount');
    }

    setIsPending(true);
    setError(null);
    setIsConfirmed(false);

    try {
      // Get the provider from Passport
      const provider = await passportInstance.connectEvm();
      
      // Parse the amount to wei
      const amountWei = parseUnits(amount, decimals);
      
      // Execute the withdraw
      const withdrawData = encodeFunctionData({
        abi: RSP3_ABI,
        functionName: 'withdraw',
        args: [amountWei],
      });

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accountAddress,
          to: CONTRACT_CONFIG.rsp3Address,
          data: withdrawData,
        }],
      }) as `0x${string}`;

      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);

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
      console.error('Withdraw transaction failed:', error);
      setError(error as Error);
      setIsPending(false);
      setIsConfirming(false);
      throw error;
    }
  };

  const reset = useCallback(() => {
    setIsPending(false);
    setIsConfirming(false);
    setIsConfirmed(false);
    setError(null);
    setHash(undefined);
  }, []);

  return {
    withdraw: executeWithdraw,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    reset,
  };
}
