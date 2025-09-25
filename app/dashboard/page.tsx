'use client';

import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { copyToClipboard } from '@/lib/copyToClipboard';
import Link from 'next/link';
import { useState } from 'react';

export default function Dashboard() {
  const { user, accountAddress, logout } = useAuth();
  const { addToast } = useToast();
  const [isCopying, setIsCopying] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCopyAddress = async () => {
    if (!accountAddress) return;
    
    setIsCopying(true);
    try {
      const success = await copyToClipboard(accountAddress);
      if (success) {
        addToast({
          type: 'success',
          title: 'Address Copied!',
          message: 'Wallet address has been copied to clipboard',
        });
      } else {
        addToast({
          type: 'error',
          title: 'Copy Failed',
          message: 'Failed to copy address to clipboard',
        });
      }
    } catch (error) {
      console.error('Copy failed:', error);
      addToast({
        type: 'error',
        title: 'Copy Failed',
        message: 'Failed to copy address to clipboard',
      });
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Welcome to RSP3!</h2>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Account Information</h3>
                  <div className="space-y-2 text-left text-gray-600">
                    <p><strong>Email:</strong> {user?.email || 'Not available'}</p>
                    <div className="flex items-center gap-2">
                      <p><strong>Wallet Address:</strong> {accountAddress ? `${accountAddress.slice(0, 6)}...${accountAddress.slice(-4)}` : 'Not connected'}</p>
                      {accountAddress && (
                        <button
                          onClick={handleCopyAddress}
                          disabled={isCopying}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Copy full address"
                        >
                          {isCopying ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                    <p><strong>User ID:</strong> {user?.sub || 'Not available'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  <Link href="/rooms" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 group">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Game Rooms</h3>
                      <p className="text-sm text-gray-600">Browse and join existing game rooms</p>
                    </div>
                  </Link>
                  
                  <Link href="/create-room" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 group">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Create Room</h3>
                      <p className="text-sm text-gray-600">Create a new game room for others to join</p>
                    </div>
                  </Link>
                  
                  <Link href="/my-games" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 group">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">My Games</h3>
                      <p className="text-sm text-gray-600">View your current active games</p>
                    </div>
                  </Link>

                  <Link href="/game-history" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 group">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Game History</h3>
                      <p className="text-sm text-gray-600">View your complete gaming history</p>
                    </div>
                  </Link>
                  
                  <Link href="/referral" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 group">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Referrals</h3>
                      <p className="text-sm text-gray-600">Share your referral link and earn rewards</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
