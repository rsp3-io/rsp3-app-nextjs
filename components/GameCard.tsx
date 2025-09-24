'use client';

import { useState } from 'react';
import { GameState, Move } from '@/types';
import { formatTierBadge } from '@/lib/tierUtils';
import { useSavedMoveChoice } from '@/hooks/useSavedMoveChoice';

interface PlayerGame {
  roomId: number;
  role: 'playerA' | 'playerB';
  state: GameState;
  timeLeft: number;
  stake: string;
  needsAction: boolean;
  tier: number;
  baseStake: bigint;
}

interface GameCardProps {
  game: PlayerGame;
  onRevealMove: (roomId: number, move: Move, salt: string) => Promise<void>;
  onCancelRoom: (roomId: number) => Promise<void>;
  onClaimForfeit: (roomId: number) => Promise<void>;
  cancellingRooms: Set<number>;
  claimingRooms: Set<number>;
  revealingRooms: Set<number>;
  formatTimeLeft: (seconds: number) => string;
  getStateMessage: (game: PlayerGame) => string;
  getStatusColor: (game: PlayerGame) => string;
}

export default function GameCard({
  game,
  onRevealMove,
  onCancelRoom,
  onClaimForfeit,
  cancellingRooms,
  claimingRooms,
  revealingRooms,
  formatTimeLeft,
  getStateMessage,
  getStatusColor,
}: GameCardProps) {
  const [showFullSalt, setShowFullSalt] = useState(false);
  
  // Always call the hook to follow Rules of Hooks, but only use result for playerA
  const savedMoveData = useSavedMoveChoice(game.roomId, game.baseStake);
  const savedChoice = game.role === 'playerA' ? savedMoveData : null;

  // Helper function to truncate salt for display
  const truncateSalt = (salt: string): string => {
    if (salt.length <= 12) return salt;
    return `${salt.slice(0, 6)}...${salt.slice(-6)}`;
  };

  // Helper function to get move emoji
  const getMoveEmoji = (move: Move): string => {
    switch (move) {
      case Move.Rock: return '🪨';
      case Move.Paper: return '📄';
      case Move.Scissor: return '✂️';
      default: return '❓';
    }
  };

  // Helper function to copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleRevealClick = async () => {
    if (savedChoice) {
      await onRevealMove(game.roomId, savedChoice.move, savedChoice.salt);
    }
  };

  return (
    <div key={game.roomId} className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-semibold text-gray-900">Room #{game.roomId}</h3>
            {(() => {
              const tierBadge = formatTierBadge(game.tier);
              return (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tierBadge.colors.textColor} ${tierBadge.colors.bgColor}`}>
                  {tierBadge.emoji} {tierBadge.name}
                </span>
              );
            })()}
          </div>
          <p className="text-gray-600">
            {game.role === 'playerA' ? 'You created this room' : 'You joined this room'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium text-gray-900">{game.stake} USDT</p>
          <p className="text-sm text-gray-600">⏱️ {formatTimeLeft(game.timeLeft)}</p>
        </div>
      </div>
      
      {/* Show move and salt info for rooms created by this user */}
      {game.role === 'playerA' && (
        <div className="mb-4">
          {savedChoice ? (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Your Move & Salt</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    Move: {getMoveEmoji(savedChoice.move)} {Move[savedChoice.move]}
                  </span>
                  <button
                    onClick={() => copyToClipboard(Move[savedChoice.move])}
                    className="text-xs text-blue-600 hover:text-blue-800"
                    title="Copy move"
                  >
                    📋
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 font-mono">
                    Salt: {showFullSalt ? savedChoice.salt : truncateSalt(savedChoice.salt)}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowFullSalt(!showFullSalt)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                      title={showFullSalt ? "Hide full salt" : "Show full salt"}
                    >
                      {showFullSalt ? '👁️‍🗨️' : '👁️'}
                    </button>
                    <button
                      onClick={() => copyToClipboard(savedChoice.salt)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                      title="Copy salt"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="text-sm font-medium text-yellow-800 mb-1">⚠️ No Saved Data</h4>
              <p className="text-xs text-yellow-700">
                Move and salt not found in browser storage. Room may have been created on a different device.
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(game)}`}>
          {getStateMessage(game)}
        </span>
      </div>

      <div className="flex gap-2">
        {/* Reveal button - enabled only when PlayerB joined and user needs to reveal */}
        {game.needsAction && game.state === GameState.WaitingForReveal ? (
          <button
            onClick={handleRevealClick}
            disabled={revealingRooms.has(game.roomId) || !savedChoice}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {revealingRooms.has(game.roomId) ? 'Revealing...' : savedChoice ? 'Reveal Move' : 'No Saved Data'}
          </button>
        ) : game.role === 'playerA' && game.state === GameState.WaitingForPlayerB && game.timeLeft <= 0 ? (
          <button
            onClick={() => onCancelRoom(game.roomId)}
            disabled={cancellingRooms.has(game.roomId)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancellingRooms.has(game.roomId) ? 'Cancelling...' : 'Cancel Expired Room'}
          </button>
        ) : game.role === 'playerA' && game.state === GameState.WaitingForReveal && game.timeLeft <= 0 ? (
          <button
            disabled
            className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed font-medium"
          >
            You Forfeited
          </button>
        ) : game.role === 'playerB' && game.state === GameState.WaitingForReveal && game.timeLeft <= 0 ? (
          <button
            onClick={() => onClaimForfeit(game.roomId)}
            disabled={claimingRooms.has(game.roomId)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {claimingRooms.has(game.roomId) ? 'Claiming...' : 'Claim Forfeit'}
          </button>
        ) : (
          <button
            disabled
            className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed font-medium"
          >
            {game.timeLeft <= 0 ? 'Room Expired' : 'Waiting for opponent'}
          </button>
        )}
      </div>
    </div>
  );
}
