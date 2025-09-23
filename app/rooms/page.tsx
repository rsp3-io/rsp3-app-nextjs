'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import AuthGuard from '@/components/AuthGuard';
import RoomCard from '@/components/RoomCard';
import { useAvailableRooms } from '@/hooks/useAvailableRooms';
import { useJoinRoom } from '@/hooks/useJoinRoom';
import { GameRoom, Move } from '@/types';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { RSP3_ABI } from '@/abi/rsp3';
import Link from 'next/link';

export default function Rooms() {
  const { rooms, refetch, isLoading, error } = useAvailableRooms();
  const { joinRoom, isLoading: isJoining } = useJoinRoom();
  const [showExpired, setShowExpired] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState<GameRoom[]>([]);
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get token decimals
  const { data: tokenDecimals } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getTokenDecimals',
  });

  const decimals = (tokenDecimals as number) || 6;

  // Filter rooms based on expiration status
  useEffect(() => {
    if (showExpired) {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(rooms.filter(room => Number(room.expirationTime) > currentTime));
    }
  }, [rooms, showExpired, currentTime]);

  // Update current time every second for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinRoom = async (roomId: bigint, move: Move) => {
    try {
      await joinRoom(roomId, move);
      // Refetch rooms after successful join
      await refetch();
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const isRoomExpired = (room: GameRoom) => {
    return Number(room.expirationTime) <= currentTime;
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
                <Link 
                  href="/create-room"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Create Room
                </Link>
                <Link 
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Available Game Rooms</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showExpired"
                    checked={showExpired}
                    onChange={(e) => setShowExpired(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="showExpired" className="ml-2 text-sm text-gray-700">
                    Show expired rooms
                  </label>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isLoading || isRefreshing}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isLoading || isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="text-red-800">
                  Failed to load rooms: {error.message}
                </div>
              </div>
            )}

            {isLoading && !rooms.length ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading available rooms...</p>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {showExpired ? 'No rooms found' : 'No active rooms available'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {showExpired 
                    ? 'There are no rooms available at the moment.'
                    : 'All rooms have expired or been joined. Try refreshing or creating a new room.'
                  }
                </p>
                <Link 
                  href="/create-room"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create New Room
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.roomId.toString()}
                    room={room}
                    onJoinRoom={handleJoinRoom}
                    tokenDecimals={decimals}
                    isExpired={isRoomExpired(room)}
                    isJoining={isJoining}
                  />
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Rooms refresh automatically every 5 seconds
              </p>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
