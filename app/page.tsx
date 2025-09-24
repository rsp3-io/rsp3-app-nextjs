'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStoredReferrer } from '@/lib/referralUtils';

export default function Home() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [pendingReferrer, setPendingReferrer] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      // Check for pending referrer when not authenticated
      const referrer = getStoredReferrer();
      setPendingReferrer(referrer);
    }
  }, [isAuthenticated, router]);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await login();
    } catch (error) {
      console.error('Login failed:', error);
      // You could add toast notification here
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">RSP3</h1>
          <p className="text-xl text-gray-600 mb-4">Rock Scissors Paper Game</p>
          
          {pendingReferrer ? (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-lg font-semibold text-blue-800">Referral Invitation</h3>
              </div>
              <p className="text-blue-700 mb-2">
                You&apos;ve been invited by{' '}
                <span className="font-mono font-medium">
                  {shortenAddress(pendingReferrer)}
                </span>
              </p>
              <p className="text-sm text-blue-600">
                Sign in to accept the referral and start earning benefits!
              </p>
            </div>
          ) : (
            <p className="text-gray-500 mb-8">
              Welcome to the decentralized Rock Scissors Paper game built on Immutable zkEVM.
              Sign in with your Immutable Passport to start playing!
            </p>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoggingIn ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Signing in...
              </div>
            ) : (
              'Sign in with Immutable Passport'
            )}
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Powered by Immutable zkEVM</p>
        </div>
      </div>
    </div>
  );
}
