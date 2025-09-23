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
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">RSP3</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user?.email || 'Player'}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link href="/rooms" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Game Rooms</h3>
                    <p className="text-gray-600">Browse and join existing game rooms</p>
                  </Link>
                  
                  <Link href="/create-room" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Create Room</h3>
                    <p className="text-gray-600">Create a new game room for others to join</p>
                  </Link>
                  
                  <Link href="/my-games" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">My Games</h3>
                    <p className="text-gray-600">View your current and completed games</p>
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
