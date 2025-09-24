'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { useReferral } from '@/hooks/useReferral';
import { copyToClipboard } from '@/lib/copyToClipboard';
import { useToast } from '@/contexts/ToastContext';

export default function ReferralPage() {
  const { accountAddress } = useAuth();
  const { 
    currentReferrer, 
    isLoadingReferrer, 
    generateMyReferralLink,
    hasPendingReferrer,
    applyPendingReferrer,
    clearPendingReferrer,
    isSettingReferrer
  } = useReferral();
  const { addToast } = useToast();
  const [isCopying, setIsCopying] = useState(false);

  const referralLink = generateMyReferralLink();
  const hasReferrer = currentReferrer && currentReferrer !== '0x0000000000000000000000000000000000000000';

  const handleCopyLink = async () => {
    if (!referralLink) return;
    
    try {
      setIsCopying(true);
      await copyToClipboard(referralLink);
      addToast({
        type: 'success',
        title: 'Referral link copied to clipboard!',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to copy link',
      });
    } finally {
      setIsCopying(false);
    }
  };

  const handleAcceptPendingReferrer = async () => {
    try {
      const txHash = await applyPendingReferrer();
      // Transaction handled by the hook, no need to do anything special here
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Referral Program</h1>
            <p className="text-gray-600">
              Invite friends and earn rewards from their games. Share your referral link to get started!
            </p>
          </div>

          {/* Pending Referrer Alert */}
          {hasPendingReferrer && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-blue-800 mb-2">
                    Referral Invitation Pending
                  </h3>
                  <p className="text-blue-700">
                    You have a pending referral invitation. Accept it to set your referrer and start earning benefits.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={clearPendingReferrer}
                    disabled={isSettingReferrer}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAcceptPendingReferrer}
                    disabled={isSettingReferrer}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSettingReferrer ? 'Setting...' : 'Accept'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Your Referral Link */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Referral Link</h2>
                <p className="text-gray-600 mb-6">
                  Share this link with friends. When they play games, you&apos;ll earn a share of platform fees - their winnings stay the same!
                </p>
                
                {referralLink && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Your Referral Link:</p>
                      <p className="font-mono text-sm break-all text-gray-900">
                        {referralLink}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleCopyLink}
                      disabled={isCopying}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCopying ? 'Copying...' : 'Copy Referral Link'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Your Referrer Status */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Referrer</h2>
                
                {isLoadingReferrer ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ) : hasReferrer ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      You were referred by:
                    </p>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="font-mono text-green-800 font-medium">
                        {shortenAddress(currentReferrer)}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>✅ Referrer is set and cannot be changed</p>
                      <p>✅ You&apos;ll benefit from referral programs</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      You don&apos;t have a referrer set yet.
                    </p>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        💡 <strong>Tip:</strong> Ask a friend for their referral link to set them as your referrer and potentially get better benefits!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How Referral Rewards Work</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Share Your Link</h3>
                  <p className="text-gray-600 text-sm">
                    Copy and share your referral link with friends who might be interested in playing RSP3.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Friend Joins</h3>
                  <p className="text-gray-600 text-sm">
                    When they sign up using your link, you become their referrer (one-time setting).
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Earn Rewards</h3>
                  <p className="text-gray-600 text-sm">
                    You automatically earn a percentage of platform fees from all their games.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">📊 How Referral Rewards Work</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• <strong>Your referees keep all their winnings</strong> - referrals only affect platform fees</li>
                  <li>• You earn 10% of platform fees from your referees&apos; games</li>
                  <li>• Rewards are automatically credited to your account balance</li>
                  <li>• Both players&apos; referrers earn from each game independently</li>
                  <li>• Referrer relationships are permanent once set</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
