'use client';

import { useState, useEffect } from 'react';
import { Tier, Move, StakeCalculation } from '@/types';
import { useCreateRoom } from '@/hooks/useCreateRoom';

interface StakeCalculatorProps {
  baseStake: bigint;
  tier: Tier;
  tokenDecimals?: number;
}

const moveNames: Record<Move, string> = {
  [Move.None]: 'None',
  [Move.Rock]: 'Rock',
  [Move.Scissor]: 'Scissor',
  [Move.Paper]: 'Paper',
};

const moveEmojis: Record<Move, string> = {
  [Move.None]: '❓',
  [Move.Rock]: '✊',
  [Move.Scissor]: '✂️',
  [Move.Paper]: '📄',
};

export default function StakeCalculator({ baseStake, tier, tokenDecimals = 6 }: StakeCalculatorProps) {
  const { getStakeCalculations, formatStake } = useCreateRoom();
  const [calculations, setCalculations] = useState<StakeCalculation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (baseStake > BigInt(0)) {
      setIsLoading(true);
      try {
        const calculations = getStakeCalculations(baseStake, tier);
        setCalculations(calculations);
      } catch (error) {
        console.error('Error calculating stakes:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCalculations([]);
    }
  }, [baseStake, tier, getStakeCalculations]);

  if (baseStake === BigInt(0)) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Stake Calculator</h3>
        <p className="text-gray-600">Enter a base stake amount to see calculated stakes for each move.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stake Calculator</h3>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Calculating stakes...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {calculations.map((calc) => (
            <div
              key={calc.move}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{moveEmojis[calc.move]}</span>
                <div>
                  <div className="font-medium text-gray-900">{moveNames[calc.move]}</div>
                  <div className="text-sm text-gray-600">
                    {calc.multiplier.toString()}x multiplier
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatStake(calc.stake, tokenDecimals)} USDT
                </div>
                <div className="text-sm text-gray-600">
                  {formatStake(baseStake, tokenDecimals)} × {calc.multiplier.toString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>Note:</strong> When you create a room, you&apos;ll lock the maximum stake (Rock) plus a small collateral penalty. 
          Your actual stake will be calculated when you reveal your move.
        </div>
      </div>
    </div>
  );
}
