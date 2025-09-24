'use client';

import { useReferral } from '@/hooks/useReferral';
import { useAuth } from '@/contexts/AuthContext';

export default function PendingReferrerBanner() {
  const { isAuthenticated } = useAuth();
  const { 
    hasPendingReferrer, 
    pendingReferrer, 
    applyPendingReferrer, 
    clearPendingReferrer,
    isSettingReferrer 
  } = useReferral();

  // Only show banner if user is authenticated and has a pending referrer
  if (!isAuthenticated || !hasPendingReferrer || !pendingReferrer) {
    return null;
  }

  const handleAccept = async () => {
    try {
      const txHash = await applyPendingReferrer();
      // Transaction handled by the hook, no need to do anything special here
    } catch (error) {
      console.error('Failed to apply referrer:', error);
    }
  };

  const handleDecline = () => {
    clearPendingReferrer();
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Referral Invitation</span>
              <br />
              You were invited by{' '}
              <span className="font-mono font-medium">
                {shortenAddress(pendingReferrer)}
              </span>
              . Would you like to set them as your referrer?
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDecline}
            disabled={isSettingReferrer}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md transition-colors disabled:opacity-50"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            disabled={isSettingReferrer}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSettingReferrer ? 'Setting...' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
}
