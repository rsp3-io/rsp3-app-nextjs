'use client';

import { useState } from 'react';
import { GameRoom, Move, Tier } from '@/types';
import { formatUnits } from 'viem';

interface RoomCardProps {
  room: GameRoom;
  onJoinRoom: (roomId: bigint, move: Move) => Promise<void>;
  tokenDecimals: number;
  isExpired: boolean;
  isJoining?: boolean;
}

export default function RoomCard({ room, onJoinRoom, tokenDecimals, isExpired, isJoining: globalIsJoining }: RoomCardProps) {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [isLocalJoining, setIsLocalJoining] = useState(false);

  const formatStake = (amount: bigint) => {
    return formatUnits(amount, tokenDecimals);
  };

  const getTierName = (tier: Tier) => {
    switch (tier) {
      case Tier.Casual:
        return 'Casual';
      case Tier.Standard:
        return 'Standard';
      case Tier.Degen:
        return 'Degen';
      default:
        return 'Unknown';
    }
  };

  const getTierColor = (tier: Tier) => {
    switch (tier) {
      case Tier.Casual:
        return 'bg-green-100 text-green-800';
      case Tier.Standard:
        return 'bg-blue-100 text-blue-800';
      case Tier.Degen:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMoveEmoji = (move: Move) => {
    switch (move) {
      case Move.Rock:
        return '🪨';
      case Move.Paper:
        return '📄';
      case Move.Scissor:
        return '✂️';
      default:
        return '';
    }
  };

  const getTimeLeft = () => {
    const now = Math.floor(Date.now() / 1000);
    const expirationTime = Number(room.expirationTime);
    const timeLeft = expirationTime - now;

    if (timeLeft <= 0) {
      return 'Expired';
    }

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const isJoining = globalIsJoining || isLocalJoining;

  const handleJoinRoom = async () => {
    if (!selectedMove || isJoining || isExpired) return;

    setIsLocalJoining(true);
    try {
      await onJoinRoom(room.roomId, selectedMove);
      setSelectedMove(null);
    } catch (error) {
      console.error('Failed to join room:', error);
    } finally {
      setIsLocalJoining(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border ${isExpired ? 'opacity-60 border-gray-300' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Room #{room.roomId.toString()}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(room.tier)}`}>
              {getTierName(room.tier)}
            </span>
            <span className={`text-sm font-medium ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
              {getTimeLeft()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Base Stake</div>
          <div className="text-lg font-bold text-gray-900">
            {formatStake(room.baseStake)} USDT
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="text-sm text-gray-600 mb-2">
          Creator: {room.playerA.slice(0, 6)}...{room.playerA.slice(-4)}
        </div>

        {!isExpired && (
          <>
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Choose your move:</div>
              <div className="flex space-x-2">
                {[Move.Rock, Move.Paper, Move.Scissor].map((move) => (
                  <button
                    key={move}
                    onClick={() => setSelectedMove(move)}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 text-center transition-all ${
                      selectedMove === move
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                    disabled={isJoining}
                  >
                    <div className="text-2xl mb-1">{getMoveEmoji(move)}</div>
                    <div className="text-xs font-medium">
                      {move === Move.Rock ? 'Rock' : move === Move.Paper ? 'Paper' : 'Scissor'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={!selectedMove || isJoining || isExpired}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                !selectedMove || isJoining || isExpired
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {isJoining ? 'Joining...' : 'Join Room'}
            </button>
          </>
        )}

        {isExpired && (
          <div className="text-center py-3 text-red-600 font-medium">
            This room has expired
          </div>
        )}
      </div>
    </div>
  );
}
