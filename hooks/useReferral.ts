'use client';

import { useState, useCallback } from 'react';
import { useReadContract } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { CONTRACT_CONFIG, RSP3_ABI } from '@/lib/contracts';
import { generateReferralUrl, getStoredReferrer, clearStoredReferrer } from '@/lib/referralUtils';
import { passportInstance } from '@/lib/passport';

interface UseReferralReturn {
  // Referrer management
  currentReferrer: string | null;
  isLoadingReferrer: boolean;
  setReferrer: (referrerAddress: string) => Promise<`0x${string}` | undefined>;
  isSettingReferrer: boolean;
  
  // Referral link generation
  generateMyReferralLink: () => string | null;
  
  // Pending referrer handling
  hasPendingReferrer: boolean;
  pendingReferrer: string | null;
  applyPendingReferrer: () => Promise<void>;
  clearPendingReferrer: () => void;
}

export function useReferral(): UseReferralReturn {
  const { accountAddress } = useAuth();
  const { addToast } = useToast();
  const [isSettingReferrer, setIsSettingReferrer] = useState(false);
  
  // Read current referrer from contract
  const {
    data: currentReferrer,
    isLoading: isLoadingReferrer,
    refetch: refetchReferrer
  } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getReferrer',
    args: accountAddress ? [accountAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!accountAddress,
    },
  });

  // Set referrer on smart contract
  const setReferrer = useCallback(async (referrerAddress: string) => {
    if (!accountAddress || !CONTRACT_CONFIG.rsp3Address) {
      throw new Error('Account or contract address not available');
    }

    if (currentReferrer && currentReferrer !== '0x0000000000000000000000000000000000000000') {
      throw new Error('Referrer already set');
    }

    setIsSettingReferrer(true);
    try {
      // Get the provider from Passport
      const provider = await passportInstance.connectEvm();
      
      // Encode the function call
      const setReferrerData = encodeFunctionData({
        abi: RSP3_ABI,
        functionName: 'setReferrer',
        args: [referrerAddress as `0x${string}`],
      });

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accountAddress,
          to: CONTRACT_CONFIG.rsp3Address,
          data: setReferrerData,
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
          addToast({
            type: 'success',
            title: 'Referrer set successfully!',
          });
          
          // Refetch to update the UI
          await refetchReferrer();
          
          // Clear any pending referrer
          clearStoredReferrer();
          
          return txHash;
        }
        
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Transaction confirmation timeout');
      }

    } catch (error: any) {
      console.error('Failed to set referrer:', error);
      const message = error?.message || 'Failed to set referrer';
      addToast({
        type: 'error',
        title: 'Failed to set referrer',
        message,
      });
      throw error;
    } finally {
      setIsSettingReferrer(false);
    }
  }, [accountAddress, currentReferrer, addToast, refetchReferrer]);

  // Generate referral link for current user
  const generateMyReferralLink = useCallback(() => {
    if (!accountAddress) {
      return null;
    }
    return generateReferralUrl(accountAddress);
  }, [accountAddress]);

  // Get pending referrer from storage
  const pendingReferrer = getStoredReferrer();
  const hasPendingReferrer = !!pendingReferrer && !currentReferrer;

  // Apply pending referrer
  const applyPendingReferrer = useCallback(async () => {
    if (!pendingReferrer) {
      throw new Error('No pending referrer');
    }
    await setReferrer(pendingReferrer);
  }, [pendingReferrer, setReferrer]);

  // Clear pending referrer
  const clearPendingReferrer = useCallback(() => {
    clearStoredReferrer();
  }, []);

  return {
    currentReferrer: currentReferrer as string | null,
    isLoadingReferrer,
    setReferrer,
    isSettingReferrer,
    generateMyReferralLink,
    hasPendingReferrer,
    pendingReferrer,
    applyPendingReferrer,
    clearPendingReferrer,
  };
}
