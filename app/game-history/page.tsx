'use client';

import { useReadContract, useAccount } from 'wagmi';
import AuthGuard from '@/components/AuthGuard';
import GameHistoryCard from '@/components/GameHistoryCard';
import Pagination from '@/components/Pagination';
import { useGameHistoryPaginated } from '@/hooks/useGameHistory';
import { useAuth } from '@/contexts/AuthContext';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { RSP3_ABI } from '@/abi/rsp3';
import Link from 'next/link';

export default function GameHistory() {
  const { accountAddress } = useAuth();
  const { address } = useAccount();
  
  const {
    gameHistory,
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    error,
    refetch,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    goToPage,
    setPageSize,
  } = useGameHistoryPaginated();

  // Get token decimals for formatting
  const { data: tokenDecimals } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getTokenDecimals',
  });

  const decimals = (tokenDecimals as number) || 6;

  // Helper function to calculate stats
  const userAddress = (accountAddress || address)?.toLowerCase();
  const getGameStats = () => {
    if (!gameHistory || !userAddress) return { won: 0, lost: 0 };
    
    const won = gameHistory.filter(game => {
      const isPlayerA = game.playerA.toLowerCase() === userAddress;
      const balanceChange = isPlayerA ? game.playerABalanceChange : game.playerBBalanceChange;
      return balanceChange > BigInt(0);
    }).length;
    
    const lost = gameHistory.filter(game => {
      const isPlayerA = game.playerA.toLowerCase() === userAddress;
      const balanceChange = isPlayerA ? game.playerABalanceChange : game.playerBBalanceChange;
      return balanceChange < BigInt(0);
    }).length;
    
    return { won, lost };
  };

  const { won, lost } = getGameStats();

  const handleRefresh = async () => {
    await refetch();
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    goToFirstPage(); // Reset to first page when changing page size
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">📚 Game History</h1>
                <p className="mt-2 text-gray-600">
                  View your complete gaming history with detailed results and balance changes
                </p>
              </div>
              <div className="flex gap-3">
                <Link 
                  href="/my-games"
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  Active Games
                </Link>
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  title="Refresh history"
                >
                  <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            {totalCount > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                    <div className="text-sm text-gray-600">Total Games Played</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{won}</div>
                    <div className="text-sm text-gray-600">Games Won (this page)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{lost}</div>
                    <div className="text-sm text-gray-600">Games Lost (this page)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your game history...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-red-600">Error loading game history: {error.message}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : totalCount === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No games played yet</h3>
                <p className="text-gray-600 mb-6">
                  Start your gaming journey by creating or joining a room!
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    href="/create-room"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Room
                  </Link>
                  <Link
                    href="/rooms"
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Join Room
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Game History Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {gameHistory?.map((game) => (
                    <GameHistoryCard
                      key={Number(game.roomId)}
                      game={game}
                      decimals={decimals}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  totalItems={totalCount}
                  pageSize={pageSize}
                  onNextPage={goToNextPage}
                  onPreviousPage={goToPreviousPage}
                  onFirstPage={goToFirstPage}
                  onLastPage={goToLastPage}
                  onGoToPage={goToPage}
                  onPageSizeChange={handlePageSizeChange}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
