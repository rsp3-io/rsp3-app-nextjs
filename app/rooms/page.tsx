'use client';

import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';

export default function Rooms() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/dashboard" className="text-2xl font-bold text-gray-900">RSP3</Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Game Rooms</h1>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">Room functionality will be implemented here.</p>
              <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
