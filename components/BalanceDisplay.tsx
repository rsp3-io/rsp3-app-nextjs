'use client';

import { useBalances, formatBalance } from '@/hooks/useBalance';
import { useUSDTFaucet } from '@/hooks/useFaucet';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';

export default function BalanceDisplay() {
  const { accountAddress } = useAuth();
  const { usdtBalance, playerBalance, isLoading, error, refetch } = useBalances();
  const { addToast } = useToast();
  const { 
    faucet, 
    isPending: isFauceting, 
    isConfirming: isFaucetConfirming, 
    isConfirmed: isFaucetConfirmed, 
    error: faucetError 
  } = useUSDTFaucet();
  
  // Refs to prevent duplicate notifications
  const faucetSuccessNotified = useRef(false);
  const faucetErrorNotified = useRef(false);
  
  // Modal states
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Memoize the refetch function to prevent infinite loops
  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  // Handle faucet success
  useEffect(() => {
    if (isFaucetConfirmed && !faucetSuccessNotified.current) {
      faucetSuccessNotified.current = true;
      addToast({
        type: 'success',
        title: 'USDT Faucet Success!',
        message: 'Mock USDT tokens have been added to your wallet',
      });
      // Refetch balances to show updated amounts
      setTimeout(() => {
        handleRefetch();
      }, 1000); // Small delay to ensure transaction is fully processed
    }
  }, [isFaucetConfirmed, addToast, handleRefetch]);

  // Handle faucet error
  useEffect(() => {
    if (faucetError && !faucetErrorNotified.current) {
      faucetErrorNotified.current = true;
      addToast({
        type: 'error',
        title: 'Faucet Failed',
        message: faucetError.message || 'Failed to get USDT from faucet',
      });
    }
  }, [faucetError, addToast]);

  const handleFaucet = async () => {
    // Reset notification flags for new transaction
    faucetSuccessNotified.current = false;
    faucetErrorNotified.current = false;
    
    try {
      await faucet();
    } catch (error) {
      console.error('Faucet error:', error);
    }
  };

  // Don't show balance if user is not authenticated
  if (!accountAddress) {
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center space-x-4 text-sm text-red-600">
        <span>Balance unavailable</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span>Loading balances...</span>
        </div>
      </div>
    );
  }

  const totalInGameBalance = playerBalance 
    ? playerBalance.freeBalance + playerBalance.lockedBalance 
    : BigInt(0);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
        {/* Wallet USDT Balance */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Wallet:</span>
          <span className="font-medium text-gray-900">
            {formatBalance(usdtBalance)} USDT
          </span>
          <button
            onClick={handleFaucet}
            disabled={isFauceting || isFaucetConfirming}
            className="ml-2 px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Get test USDT tokens"
          >
            {isFauceting || isFaucetConfirming ? (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Getting...</span>
              </div>
            ) : (
              'Faucet'
            )}
          </button>
        </div>

        {/* In-Game Balance */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">In-Game:</span>
          <span className="font-medium text-gray-900">
            {formatBalance(totalInGameBalance)} USDT
          </span>
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={() => setShowDepositModal(true)}
              className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              title="Deposit USDT to game"
            >
              Deposit
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-2 py-1 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
              title="Withdraw USDT from game"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Balance Breakdown (if there's an in-game balance) */}
        {playerBalance && totalInGameBalance > BigInt(0) && (
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span>Free: {formatBalance(playerBalance.freeBalance)}</span>
            <span>Locked: {formatBalance(playerBalance.lockedBalance)}</span>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSuccess={handleRefetch}
      />
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onSuccess={handleRefetch}
      />
    </>
  );
}
