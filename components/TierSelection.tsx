'use client';

import { Tier, TierMultipliers } from '@/types';

interface TierSelectionProps {
  selectedTier: Tier;
  onTierChange: (tier: Tier) => void;
  multipliers: {
    [Tier.Casual]: TierMultipliers;
    [Tier.Standard]: TierMultipliers;
    [Tier.Degen]: TierMultipliers;
  };
}

const tierInfo = {
  [Tier.Casual]: {
    name: 'Casual',
    description: 'Low risk, moderate rewards',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
    ratio: '5:2:1',
  },
  [Tier.Standard]: {
    name: 'Standard',
    description: 'Balanced risk and rewards',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    ratio: '10:5:1',
  },
  [Tier.Degen]: {
    name: 'Degen',
    description: 'High risk, high rewards',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    borderColor: 'border-red-300',
    ratio: '100:20:1',
  },
};

export default function TierSelection({ selectedTier, onTierChange, multipliers }: TierSelectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Choose Game Tier</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(Tier).filter(tier => typeof tier === 'number').map((tier) => {
          const tierNum = tier as Tier;
          const info = tierInfo[tierNum];
          const isSelected = selectedTier === tierNum;
          const tierMultipliers = multipliers[tierNum];

          return (
            <div
              key={tierNum}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? `${info.borderColor} ${info.color} text-white shadow-lg scale-105`
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => onTierChange(tierNum)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-semibold ${isSelected ? 'text-white' : info.textColor}`}>
                  {info.name}
                </h4>
                {isSelected && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              <p className={`text-sm mb-3 ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                {info.description}
              </p>
              
              <div className="space-y-1">
                <div className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                  <span className="font-medium">Ratio:</span> {info.ratio}
                </div>
                <div className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                  <span className="font-medium">Multipliers:</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={isSelected ? 'text-white' : 'text-gray-600'}>
                    Rock: {tierMultipliers.rockMultiplier.toString()}x
                  </span>
                  <span className={isSelected ? 'text-white' : 'text-gray-600'}>
                    Scissor: {tierMultipliers.scissorMultiplier.toString()}x
                  </span>
                  <span className={isSelected ? 'text-white' : 'text-gray-600'}>
                    Paper: {tierMultipliers.paperMultiplier.toString()}x
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
