'use client';

import { useState, useEffect, useRef } from 'react';
import { useWithdraw } from '@/hooks/useDepositWithdraw';
import { usePlayerBalance } from '@/hooks/useBalance';
import { useToast } from '@/contexts/ToastContext';
import { formatBalance } from '@/hooks/useBalance';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function WithdrawModal({ isOpen, onClose, onSuccess }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const { balance: playerBalance } = usePlayerBalance();
  const { addToast } = useToast();
  const { 
    withdraw, 
    isPending, 
    isConfirming, 
    isConfirmed, 
    error,
    reset
  } = useWithdraw();
  
  // Refs to prevent duplicate notifications
  const withdrawSuccessNotified = useRef(false);
  const withdrawErrorNotified = useRef(false);

  // Handle withdraw success
  useEffect(() => {
    if (isConfirmed && !withdrawSuccessNotified.current) {
      withdrawSuccessNotified.current = true;
      addToast({
        type: 'success',
        title: 'Withdraw Successful!',
        message: `${amount} USDT has been withdrawn to your wallet`,
      });
      onSuccess?.();
      onClose();
    }
  }, [isConfirmed, addToast, amount, onSuccess, onClose]);

  // Handle withdraw error
  useEffect(() => {
    if (error && !withdrawErrorNotified.current) {
      withdrawErrorNotified.current = true;
      addToast({
        type: 'error',
        title: 'Withdraw Failed',
        message: error.message || 'Failed to withdraw USDT',
      });
    }
  }, [error, addToast]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      withdrawSuccessNotified.current = false;
      withdrawErrorNotified.current = false;
      reset(); // Reset hook state when modal opens
    } else {
      // Reset notification flags when modal closes
      withdrawSuccessNotified.current = false;
      withdrawErrorNotified.current = false;
    }
  }, [isOpen, reset]);

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
      });
      return;
    }

    if (playerBalance && parseFloat(amount) > parseFloat(formatBalance(playerBalance.freeBalance))) {
      addToast({
        type: 'error',
        title: 'Insufficient Balance',
        message: 'You don\'t have enough free balance to withdraw',
      });
      return;
    }

    try {
      await withdraw(amount);
    } catch (error) {
      console.error('Withdraw error:', error);
    }
  };

  const handleMaxAmount = () => {
    if (playerBalance) {
      setAmount(formatBalance(playerBalance.freeBalance));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Withdraw USDT</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isPending || isConfirming}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Withdraw
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.000001"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  disabled={isPending || isConfirming}
                />
                <button
                  type="button"
                  onClick={handleMaxAmount}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium rounded transition-colors"
                  disabled={isPending || isConfirming}
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">Free Balance:</span>
                <span className="font-semibold text-gray-900">
                  {playerBalance ? formatBalance(playerBalance.freeBalance) : '0.00'} USDT
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">Locked Balance:</span>
                <span className="font-semibold text-gray-900">
                  {playerBalance ? formatBalance(playerBalance.lockedBalance) : '0.00'} USDT
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isPending || isConfirming}
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={isPending || isConfirming || !amount}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending || isConfirming ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Withdrawing...</span>
                  </div>
                ) : (
                  'Withdraw'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
