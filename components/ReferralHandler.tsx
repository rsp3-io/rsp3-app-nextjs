'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useReferral } from '@/hooks/useReferral';
import { getStoredReferrer, clearStoredReferrer } from '@/lib/referralUtils';

export default function ReferralHandler() {
  const { isAuthenticated, isLoading: authLoading, accountAddress } = useAuth();
  const { 
    currentReferrer, 
    isLoadingReferrer, 
    setReferrer,
    isSettingReferrer 
  } = useReferral();
  const router = useRouter();
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [pendingReferrerAddress, setPendingReferrerAddress] = useState<string | null>(null);

  useEffect(() => {
    // Only check for pending referrals when user is authenticated and we have account address
    if (isAuthenticated && accountAddress && !authLoading && !isLoadingReferrer) {
      const storedReferrer = getStoredReferrer();
      
      if (storedReferrer) {
        // Check if user already has a referrer set
        const hasReferrer = currentReferrer && currentReferrer !== '0x0000000000000000000000000000000000000000';
        
        if (!hasReferrer) {
          // User doesn't have a referrer and has a pending one - show modal
          setPendingReferrerAddress(storedReferrer);
          setShowReferralModal(true);
        } else {
          // User already has a referrer - clear the pending one
          clearStoredReferrer();
        }
      }
    }
  }, [isAuthenticated, accountAddress, authLoading, isLoadingReferrer, currentReferrer]);

  const handleAcceptReferrer = async () => {
    if (!pendingReferrerAddress) return;
    
    try {
      const txHash = await setReferrer(pendingReferrerAddress);
      if (txHash) {
        setShowReferralModal(false);
        setPendingReferrerAddress(null);
      }
    } catch (error) {
      console.error('Failed to set referrer:', error);
    }
  };

  const handleDeclineReferrer = () => {
    clearStoredReferrer();
    setShowReferralModal(false);
    setPendingReferrerAddress(null);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!showReferralModal || !pendingReferrerAddress) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RSP3!</h2>
          <p className="text-gray-600 mb-4">
            You&apos;ve been invited by{' '}
            <span className="font-mono font-medium text-blue-600">
              {shortenAddress(pendingReferrerAddress)}
            </span>
          </p>
          <p className="text-gray-600 mb-6">
            Would you like to set them as your referrer? They&apos;ll earn rewards from your games.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleAcceptReferrer}
              disabled={isSettingReferrer}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSettingReferrer ? 'Setting Referrer...' : 'Accept Referral'}
            </button>
            
            <button
              onClick={handleDeclineReferrer}
              disabled={isSettingReferrer}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              No Thanks
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🎉 Referral Benefits</h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• Your referrer earns 10% of platform fees from your games</li>
              <li>• You can refer others and earn rewards too</li>
              <li>• Join a community of strategic players</li>
              <li>• This setting is permanent once accepted</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
