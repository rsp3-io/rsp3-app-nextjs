'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useReferral } from '@/hooks/useReferral';
import { decodeReferrerAddress, storeReferrer } from '@/lib/referralUtils';

export default function ReferralCodePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    currentReferrer, 
    isLoadingReferrer, 
    setReferrer,
    isSettingReferrer 
  } = useReferral();
  const [referrerAddress, setReferrerAddress] = useState<string | null>(null);
  const [isInvalidCode, setIsInvalidCode] = useState(false);

  useEffect(() => {
    const code = params.code as string;
    if (!code) {
      setIsInvalidCode(true);
      return;
    }

    // Decode the referrer address
    const decoded = decodeReferrerAddress(code);
    if (!decoded) {
      setIsInvalidCode(true);
      return;
    }

    setReferrerAddress(decoded);
    
    // Store the referrer for later use
    storeReferrer(decoded);
  }, [params.code]);

  useEffect(() => {
    // Only redirect if we don't have a valid referrer address
    // This allows authenticated users to still see referral acceptance UI
    if (!authLoading && !referrerAddress && isInvalidCode) {
      router.push('/');
      return;
    }

    // If not authenticated and we have a valid referrer, redirect to home page
    if (!authLoading && !isAuthenticated && referrerAddress) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, authLoading, referrerAddress, isInvalidCode, router]);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleAcceptReferrer = async () => {
    if (!referrerAddress) return;
    try {
      const txHash = await setReferrer(referrerAddress);
      if (txHash) {
        // Redirect to dashboard after successful referrer setting
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to set referrer:', error);
    }
  };

  const hasReferrer = currentReferrer && currentReferrer !== '0x0000000000000000000000000000000000000000';

  // Show loading while processing
  if (authLoading || (!isInvalidCode && !referrerAddress)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing referral...</h2>
          <p className="text-gray-600">Please wait while we process your referral link.</p>
        </div>
      </div>
    );
  }

  // Show error for invalid codes
  if (isInvalidCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Referral Link</h2>
          <p className="text-gray-600 mb-6">
            This referral link is invalid or has expired. Please check the link and try again.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Show referral welcome message for unauthenticated users
  if (!isAuthenticated && referrerAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RSP3!</h2>
          <p className="text-gray-600 mb-4">
            You&apos;ve been invited by{' '}
            <span className="font-mono font-medium text-blue-600">
              {shortenAddress(referrerAddress)}
            </span>
          </p>
          <p className="text-gray-600 mb-6">
            Sign in to accept the referral and start playing! Your referrer will earn from platform fees, not your winnings.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Sign In to Get Started
          </button>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🎉 How Referrals Work</h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• <strong>Your winnings stay the same</strong> - referrals only affect platform fees</li>
              <li>• Your referrer earns a share of platform fees, not your profits</li>
              <li>• You can refer others and earn rewards too</li>
              <li>• Transparent blockchain-based gaming</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Show referral acceptance UI for authenticated users
  if (isAuthenticated && referrerAddress) {
    // Check if user already has a referrer
    if (hasReferrer) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Referrer Already Set</h2>
            <p className="text-gray-600 mb-4">
              You already have a referrer set. Each user can only have one referrer, and it cannot be changed.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Current referrer: <span className="font-mono">{shortenAddress(currentReferrer)}</span>
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    // User is authenticated and doesn't have a referrer - show acceptance UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accept Referral Invitation</h2>
          <p className="text-gray-600 mb-4">
            You&apos;ve been invited by{' '}
            <span className="font-mono font-medium text-blue-600">
              {shortenAddress(referrerAddress)}
            </span>
          </p>
          <p className="text-gray-600 mb-6">
            Would you like to set them as your referrer? They&apos;ll earn a share of platform fees when you play - <strong>this doesn&apos;t reduce your winnings!</strong>
          </p>

          <div className="space-y-3">
            <button
              onClick={handleAcceptReferrer}
              disabled={isSettingReferrer || isLoadingReferrer}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSettingReferrer ? 'Setting Referrer...' : 'Accept Referral'}
            </button>
            
            <button
              onClick={() => router.push('/dashboard')}
              disabled={isSettingReferrer}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Decline & Continue
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🎉 How Referrals Work</h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• <strong>Your winnings stay the same</strong> - referrals only affect platform fees</li>
              <li>• Your referrer earns 10% of platform fees from your games</li>
              <li>• You can refer others and earn rewards too</li>
              <li>• Join a community of strategic players</li>
              <li>• This setting is permanent once accepted</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - should not reach here
  return null;
}
