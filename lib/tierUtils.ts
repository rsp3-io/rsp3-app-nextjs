import { Tier } from '@/types';

export const tierInfo = {
  [Tier.Casual]: {
    name: 'Casual',
    description: 'Low risk, moderate rewards',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
    bgColor: 'bg-green-50',
    ratio: '5:2:1',
    emoji: '🟢',
  },
  [Tier.Standard]: {
    name: 'Standard',
    description: 'Balanced risk and rewards',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50',
    ratio: '10:5:1',
    emoji: '🔵',
  },
  [Tier.Degen]: {
    name: 'Degen',
    description: 'High risk, high rewards',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    borderColor: 'border-red-300',
    bgColor: 'bg-red-50',
    ratio: '100:20:1',
    emoji: '🔴',
  },
};

export function getTierName(tier: Tier): string {
  return tierInfo[tier]?.name || 'Unknown';
}

export function getTierEmoji(tier: Tier): string {
  return tierInfo[tier]?.emoji || '⚪';
}

export function getTierColors(tier: Tier) {
  return tierInfo[tier] || tierInfo[Tier.Standard];
}

export function formatTierBadge(tier: Tier): { name: string; emoji: string; colors: typeof tierInfo[Tier] } {
  return {
    name: getTierName(tier),
    emoji: getTierEmoji(tier),
    colors: getTierColors(tier),
  };
}
