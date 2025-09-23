'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';
import { usePlayerActiveRooms } from '@/hooks/usePlayerActiveRooms';
import { useRevealMove } from '@/hooks/useRevealMove';
import { useCancelExpiredRoom, useClaimForfeit } from '@/hooks/useRoomActions';
import { GameRoom, GameState, Move } from '@/types';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { RSP3_ABI } from '@/abi/rsp3';
import { formatBalance } from '@/hooks/useBalance';
import { useAuth } from '@/contexts/AuthContext';
import RevealMoveModal from '@/components/RevealMoveModal';

interface PlayerGame {
  roomId: number;
  role: 'playerA' | 'playerB';
  state: GameState;
  timeLeft: number;
  stake: string;
  needsAction: boolean;
}

export default function MyGames() {
  const { accountAddress } = useAuth();
  const { address } = useAccount();
  const { rooms: playerActiveRooms, refetch, isLoading, error } = usePlayerActiveRooms();
  const { revealMove, isLoading: isRevealLoading } = useRevealMove();
  const { cancelExpiredRoom } = useCancelExpiredRoom();
  const { claimForfeit } = useClaimForfeit();
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));
  const [revealModalOpen, setRevealModalOpen] = useState(false);
  const [selectedRoomForReveal, setSelectedRoomForReveal] = useState<number | null>(null);
  const [cancellingRooms, setCancellingRooms] = useState<Set<number>>(new Set());
  const [claimingRooms, setClaimingRooms] = useState<Set<number>>(new Set());

  // Get token decimals
  const { data: tokenDecimals } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getTokenDecimals',
  });

  const decimals = (tokenDecimals as number) || 6;

  // Update current time every second for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Convert contract rooms to player games format and sort by roomId descending (newest first)
  const playerGames: PlayerGame[] = (playerActiveRooms || [])
    .map((room) => {
      const userAddress = (accountAddress || address)?.toLowerCase();
      const isPlayerA = room.playerA.toLowerCase() === userAddress;
      const role: 'playerA' | 'playerB' = isPlayerA ? 'playerA' : 'playerB';
      const stake = isPlayerA ? room.playerAStake : room.playerBStake;
      const timeLeft = room.state === GameState.WaitingForPlayerB
        ? Math.max(0, Number(room.expirationTime) - currentTime)
        : Math.max(0, Number(room.revealDeadline) - currentTime);

      return {
        roomId: Number(room.roomId),
        role,
        state: room.state,
        timeLeft,
        stake: formatBalance(stake, decimals),
        needsAction: isPlayerA && room.state === GameState.WaitingForReveal && timeLeft > 0,
      };
    })
    .sort((a, b) => b.roomId - a.roomId); // Sort by roomId descending (newest first)

  const handleRevealMove = (roomId: number) => {
    setSelectedRoomForReveal(roomId);
    setRevealModalOpen(true);
  };

  const handleRevealMoveConfirm = async (move: Move, salt: string) => {
    if (selectedRoomForReveal) {
      try {
        await revealMove(selectedRoomForReveal, move, salt);
        setRevealModalOpen(false);
        setSelectedRoomForReveal(null);
        await refetch(); // Refresh the room data
      } catch (error) {
        console.error('Failed to reveal move:', error);
      }
    }
  };

  const handleCancelRoom = async (roomId: number) => {
    setCancellingRooms(prev => new Set(prev).add(roomId));
    try {
      await cancelExpiredRoom(roomId);
      await refetch(); // Refresh the room data
    } catch (error) {
      console.error('Failed to cancel room:', error);
    } finally {
      setCancellingRooms(prev => {
        const newSet = new Set(prev);
        newSet.delete(roomId);
        return newSet;
      });
    }
  };

  const handleClaimForfeit = async (roomId: number) => {
    setClaimingRooms(prev => new Set(prev).add(roomId));
    try {
      await claimForfeit(roomId);
      await refetch(); // Refresh the room data
    } catch (error) {
      console.error('Failed to claim forfeit:', error);
    } finally {
      setClaimingRooms(prev => {
        const newSet = new Set(prev);
        newSet.delete(roomId);
        return newSet;
      });
    }
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const formatTimeLeft = (seconds: number): string => {
    if (seconds <= 0) return 'Expired';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  const getStateMessage = (game: PlayerGame): string => {
    // Just created. Waiting for another player to join.
    if (game.state === GameState.WaitingForPlayerB && game.timeLeft > 0) {
      return '🎯 Just created. Waiting for another player to join.';
    }
    // PlayerB joined. Waiting for user to reveal his move.
    if (game.state === GameState.WaitingForReveal && game.needsAction) {
      return '⚠️ PlayerB joined. Waiting for user to reveal his move.';
    }
    // Expired. No player joined your room in the timeframe.
    if (game.state === GameState.WaitingForPlayerB && game.timeLeft <= 0) {
      return '⏰ Expired. No player joined your room in the timeframe.';
    }
    // Forfeited. You haven't revealed your move in the timeframe.
    if (game.role === 'playerA' && game.state === GameState.WaitingForReveal && game.timeLeft <= 0) {
      return '💸 Forfeited. You haven\'t revealed your move in the timeframe.';
    }
    // PlayerB waiting for PlayerA to reveal
    if (game.role === 'playerB' && game.state === GameState.WaitingForReveal && game.timeLeft > 0) {
      return '⏳ Waiting for opponent to reveal their move.';
    }
    // PlayerB can claim forfeit
    if (game.role === 'playerB' && game.state === GameState.WaitingForReveal && game.timeLeft <= 0) {
      return '💰 Opponent forfeited. You can claim their stake.';
    }
    // Fallback
    return '⏳ Waiting...';
  };

  const getStatusColor = (game: PlayerGame): string => {
    if (game.needsAction) return 'text-red-600 bg-red-50';
    if (game.timeLeft <= 0) return 'text-orange-600 bg-orange-50';
    return 'text-blue-600 bg-blue-50';
  };

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
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">🎮 My Games</h1>
            
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">Loading your active games...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-red-600">Error loading your games: {error.message}</p>
              </div>
            ) : playerGames.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">No active games</p>
                <p className="text-gray-500 mt-2">Create or join a room to start playing!</p>
                <Link href="/create-room" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Create Room
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playerGames.map((game) => (
                  <div key={game.roomId} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Room #{game.roomId}</h3>
                        <p className="text-gray-600">
                          {game.role === 'playerA' ? 'You created this room' : 'You joined this room'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-gray-900">{game.stake} USDT</p>
                        <p className="text-sm text-gray-600">⏱️ {formatTimeLeft(game.timeLeft)}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(game)}`}>
                        {getStateMessage(game)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {/* Reveal button - enabled only when PlayerB joined and user needs to reveal */}
                      {game.needsAction && game.state === GameState.WaitingForReveal ? (
                        <button
                          onClick={() => handleRevealMove(game.roomId)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
                        >
                          Reveal Move
                        </button>
                      ) : game.role === 'playerA' && game.state === GameState.WaitingForPlayerB && game.timeLeft <= 0 ? (
                        <button
                          onClick={() => handleCancelRoom(game.roomId)}
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
                          onClick={() => handleClaimForfeit(game.roomId)}
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
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Reveal Move Modal */}
        {selectedRoomForReveal && (
          <RevealMoveModal
            isOpen={revealModalOpen}
            onClose={() => {
              setRevealModalOpen(false);
              setSelectedRoomForReveal(null);
            }}
            onReveal={handleRevealMoveConfirm}
            roomId={selectedRoomForReveal}
            isLoading={isRevealLoading}
          />
        )}
      </div>
    </AuthGuard>
  );
}
