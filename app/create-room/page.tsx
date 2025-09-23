'use client';

import { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import TierSelection from '@/components/TierSelection';
import StakeCalculator from '@/components/StakeCalculator';
import MoveSelector from '@/components/MoveSelector';
import { useCreateRoom } from '@/hooks/useCreateRoom';
import { usePlayerBalance } from '@/hooks/useBalance';
import { Tier, Move } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateRoom() {
  const router = useRouter();
  const {
    isLoading,
    minBaseStake,
    tokenDecimals,
    generateSalt,
    createCommitHash,
    getTierMultipliers,
    createRoom,
    formatStake,
    parseStake,
  } = useCreateRoom();
  
  const { balance } = usePlayerBalance();
  
  const [selectedTier, setSelectedTier] = useState<Tier>(Tier.Standard);
  const [baseStakeInput, setBaseStakeInput] = useState('');
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [salt, setSalt] = useState('');
  const [commitHash, setCommitHash] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Generate salt when component mounts
  useEffect(() => {
    const newSalt = generateSalt();
    setSalt(newSalt);
  }, [generateSalt]);

  // Update commit hash when move or salt changes
  useEffect(() => {
    if (selectedMove !== null && salt) {
      const hash = createCommitHash(selectedMove, salt);
      setCommitHash(hash);
    } else {
      setCommitHash('');
    }
  }, [selectedMove, salt, createCommitHash]);

  // Get tier multipliers
  const multipliers = {
    [Tier.Casual]: getTierMultipliers(Tier.Casual),
    [Tier.Standard]: getTierMultipliers(Tier.Standard),
    [Tier.Degen]: getTierMultipliers(Tier.Degen),
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!baseStakeInput || baseStakeInput === '0') {
      newErrors.baseStake = 'Base stake is required';
    } else {
      const stake = parseStake(baseStakeInput, tokenDecimals);
      if (minBaseStake && stake < minBaseStake) {
        newErrors.baseStake = `Minimum base stake is ${formatStake(minBaseStake, tokenDecimals)} USDT`;
      }
    }

    if (selectedMove === null) {
      newErrors.move = 'Please select a move';
    }

    if (!commitHash) {
      newErrors.commit = 'Move commitment failed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const baseStake = parseStake(baseStakeInput, tokenDecimals);
      await createRoom({
        baseStake,
        commitHash,
        tier: selectedTier,
      });

      // Redirect to my games page
      router.push('/my-games');
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  // Calculate maximum stake for balance check
  const maxStake = selectedMove !== null && baseStakeInput 
    ? parseStake(baseStakeInput, tokenDecimals) * multipliers[selectedTier].rockMultiplier
    : BigInt(0);

  const hasInsufficientBalance = balance && maxStake > balance.freeBalance;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/dashboard" className="text-2xl font-bold text-gray-900">RSP3</Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Room</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Tier Selection */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <TierSelection
                  selectedTier={selectedTier}
                  onTierChange={setSelectedTier}
                  multipliers={multipliers}
                />
              </div>

              {/* Base Stake Input */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Base Stake Amount</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="baseStake" className="block text-sm font-medium text-gray-900 mb-2">
                      USDT Amount
                    </label>
                    <input
                      type="number"
                      id="baseStake"
                      step="0.1"
                      min="0.1"
                      value={baseStakeInput}
                      onChange={(e) => setBaseStakeInput(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400 ${
                        errors.baseStake ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter base stake amount"
                    />
                    {errors.baseStake && (
                      <p className="mt-1 text-sm text-red-600">{errors.baseStake}</p>
                    )}
                    {minBaseStake && (
                      <p className="mt-1 text-sm text-gray-600">
                        Minimum: {formatStake(minBaseStake, tokenDecimals)} USDT (in multiples of 0.1)
                      </p>
                    )}
                  </div>
                  
                  {baseStakeInput && (
                    <StakeCalculator
                      baseStake={parseStake(baseStakeInput, tokenDecimals)}
                      tier={selectedTier}
                      tokenDecimals={tokenDecimals}
                    />
                  )}
                </div>
              </div>

              {/* Move Selection */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <MoveSelector
                  selectedMove={selectedMove}
                  onMoveChange={setSelectedMove}
                />
                {errors.move && (
                  <p className="mt-2 text-sm text-red-600">{errors.move}</p>
                )}
              </div>

              {/* Balance Check */}
              {hasInsufficientBalance && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Insufficient Balance</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>
                          You need at least {formatStake(maxStake, tokenDecimals)} USDT to create this room.
                          Your current balance: {balance ? formatStake(balance.freeBalance, tokenDecimals) : '0'} USDT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Commit Hash Display */}
              {commitHash && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Move Commitment</h3>
                  <p className="text-xs text-gray-900 break-all font-mono bg-white p-3 rounded border border-gray-200">
                    {commitHash}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    This hash commits your move to the blockchain. You&apos;ll reveal the actual move after your opponent joins.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link
                  href="/dashboard"
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading || hasInsufficientBalance || !commitHash}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Room...' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
