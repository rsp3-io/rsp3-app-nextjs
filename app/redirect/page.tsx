'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { passportInstance } from '@/lib/passport';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Handle the redirect callback from Passport
        await passportInstance.loginCallback();
        
        // Redirect to dashboard after successful authentication
        router.push('/dashboard');
      } catch (error) {
        console.error('Authentication redirect failed:', error);
        // Redirect back to home page on error
        router.push('/');
      }
    };

    handleRedirect();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we authenticate you.</p>
      </div>
    </div>
  );
}
