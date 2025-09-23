'use client';

import { useState, useEffect, useRef } from 'react';
import { useDeposit } from '@/hooks/useDepositWithdraw';
import { useUSDTBalance } from '@/hooks/useBalance';
import { useToast } from '@/contexts/ToastContext';
import { formatBalance } from '@/hooks/useBalance';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DepositModal({ isOpen, onClose, onSuccess }: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const { balance: usdtBalance } = useUSDTBalance();
  const { addToast } = useToast();
  const { 
    deposit, 
    isPending, 
    isConfirming, 
    isConfirmed, 
    error,
    reset
  } = useDeposit();
  
  // Refs to prevent duplicate notifications
  const depositSuccessNotified = useRef(false);
  const depositErrorNotified = useRef(false);

  // Handle deposit success
  useEffect(() => {
    if (isConfirmed && !depositSuccessNotified.current) {
      depositSuccessNotified.current = true;
      addToast({
        type: 'success',
        title: 'Deposit Successful!',
        message: `${amount} USDT has been deposited to your game balance`,
      });
      onSuccess?.();
      onClose();
    }
  }, [isConfirmed, addToast, amount, onSuccess, onClose]);

  // Handle deposit error
  useEffect(() => {
    if (error && !depositErrorNotified.current) {
      depositErrorNotified.current = true;
      addToast({
        type: 'error',
        title: 'Deposit Failed',
        message: error.message || 'Failed to deposit USDT',
      });
    }
  }, [error, addToast]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      depositSuccessNotified.current = false;
      depositErrorNotified.current = false;
      reset(); // Reset hook state when modal opens
    } else {
      // Reset notification flags when modal closes
      depositSuccessNotified.current = false;
      depositErrorNotified.current = false;
    }
  }, [isOpen]); // Remove reset from dependencies to prevent infinite loops

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
      });
      return;
    }

    if (usdtBalance && parseFloat(amount) > parseFloat(formatBalance(usdtBalance))) {
      addToast({
        type: 'error',
        title: 'Insufficient Balance',
        message: 'You don\'t have enough USDT in your wallet',
      });
      return;
    }

    try {
      await deposit(amount);
    } catch (error) {
      console.error('Deposit error:', error);
    }
  };

  const handleMaxAmount = () => {
    if (usdtBalance) {
      setAmount(formatBalance(usdtBalance));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Deposit USDT</h3>
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
                Amount to Deposit
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded transition-colors"
                  disabled={isPending || isConfirming}
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">Wallet Balance:</span>
                <span className="font-semibold text-gray-900">
                  {usdtBalance ? formatBalance(usdtBalance) : '0.00'} USDT
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
                onClick={handleDeposit}
                disabled={isPending || isConfirming || !amount}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending || isConfirming ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isPending ? 'Approving...' : 'Depositing...'}</span>
                  </div>
                ) : (
                  'Deposit'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
