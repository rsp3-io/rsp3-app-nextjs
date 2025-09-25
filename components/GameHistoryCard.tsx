'use client';

import { GameRoom, GameState, Move, Tier } from '@/types';
import { formatBalance } from '@/hooks/useBalance';
import { useAuth } from '@/contexts/AuthContext';
import { useAccount } from 'wagmi';

interface GameHistoryCardProps {
  game: GameRoom;
  decimals: number;
}

export default function GameHistoryCard({ game, decimals }: GameHistoryCardProps) {
  const { accountAddress } = useAuth();
  const { address } = useAccount();
  const userAddress = (accountAddress || address)?.toLowerCase();
  
  const isPlayerA = game.playerA.toLowerCase() === userAddress;
  const isPlayerB = game.playerB.toLowerCase() === userAddress;
  const playerRole = isPlayerA ? 'playerA' : 'playerB';
  
  // Get user's balance change
  const balanceChange = isPlayerA ? game.playerABalanceChange : game.playerBBalanceChange;
  const balanceChangeFormatted = formatBalance(balanceChange, decimals);
  const isPositive = balanceChange > BigInt(0);
  const isNegative = balanceChange < BigInt(0);
  
  // Get opponent info
  const opponentAddress = isPlayerA ? game.playerB : game.playerA;
  const opponentExists = opponentAddress !== '0x0000000000000000000000000000000000000000';
  
  // Format addresses for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  
  // Get tier name and color
  const getTierInfo = (tier: Tier) => {
    switch (tier) {
      case Tier.Casual:
        return { name: 'Casual', color: 'bg-green-100 text-green-800' };
      case Tier.Standard:
        return { name: 'Standard', color: 'bg-blue-100 text-blue-800' };
      case Tier.Degen:
        return { name: 'Degen', color: 'bg-purple-100 text-purple-800' };
      default:
        return { name: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };
  
  // Get move name
  const getMoveName = (move: Move) => {
    switch (move) {
      case Move.Rock:
        return '🪨 Rock';
      case Move.Scissor:
        return '✂️ Scissor';
      case Move.Paper:
        return '📄 Paper';
      default:
        return '❓ Unknown';
    }
  };
  
  // Get game result status
  const getGameResult = () => {
    if (game.state === GameState.Completed) {
      if (balanceChange > BigInt(0)) {
        return { text: '🎉 Won', color: 'text-green-600 bg-green-50' };
      } else if (balanceChange < BigInt(0)) {
        return { text: '😞 Lost', color: 'text-red-600 bg-red-50' };
      } else {
        return { text: '🤝 Draw', color: 'text-yellow-600 bg-yellow-50' };
      }
    } else if (game.state === GameState.Forfeited) {
      if (!opponentExists) {
        return { text: '⏰ Expired', color: 'text-gray-600 bg-gray-50' };
      } else if (balanceChange > BigInt(0)) {
        return { text: '🏆 Opponent Forfeited', color: 'text-green-600 bg-green-50' };
      } else {
        return { text: '💸 Forfeited', color: 'text-red-600 bg-red-50' };
      }
    }
    return { text: '❓ Unknown', color: 'text-gray-600 bg-gray-50' };
  };

  const tierInfo = getTierInfo(game.tier);
  const gameResult = getGameResult();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Room #{Number(game.roomId)}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${tierInfo.color}`}>
              {tierInfo.name}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${gameResult.color}`}>
              {gameResult.text}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Role</div>
          <div className="font-medium text-gray-400">
            {isPlayerA ? '👤 Player A' : '👥 Player B'}
          </div>
        </div>
      </div>

      {/* Game Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">Base Stake</div>
          <div className="font-medium text-gray-400">{formatBalance(game.baseStake, decimals)} USDT</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Your Stake</div>
          <div className="font-medium text-gray-400">
            {formatBalance(isPlayerA ? game.playerAStake : game.playerBStake, decimals)} USDT
          </div>
        </div>
      </div>

      {/* Player Information */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Players</div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Player A:</span>
            <span className="text-sm font-mono text-gray-400">
              {formatAddress(game.playerA)}
              {isPlayerA && <span className="ml-1 text-blue-600">(You)</span>}
            </span>
          </div>
          {opponentExists && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Player B:</span>
              <span className="text-sm font-mono text-gray-400">
                {formatAddress(game.playerB)}
                {isPlayerB && <span className="ml-1 text-blue-600">(You)</span>}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Game Moves (if completed) */}
      {game.state === GameState.Completed && opponentExists && (
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Moves</div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Player A:</span>
              <span className="text-sm text-gray-400">
                {game.playerAMove !== Move.None ? getMoveName(game.playerAMove) : '🔍 Hidden'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Player B:</span>
              <span className="text-sm text-gray-400">
                {game.playerBMove !== Move.None ? getMoveName(game.playerBMove) : '🔍 Hidden'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Balance Change */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Balance Change</span>
          <span className={`font-semibold ${
            isPositive ? 'text-green-600' : 
            isNegative ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {isPositive && '+'}
            {balanceChangeFormatted} USDT
          </span>
        </div>
      </div>
    </div>
  );
}
