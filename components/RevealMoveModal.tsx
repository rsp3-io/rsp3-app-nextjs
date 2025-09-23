'use client';

import { useState, useEffect } from 'react';
import { Move } from '@/types';
import MoveSelector from './MoveSelector';

interface RevealMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReveal: (move: Move, salt: string) => void;
  roomId: number;
  isLoading?: boolean;
}

export default function RevealMoveModal({ 
  isOpen, 
  onClose, 
  onReveal, 
  roomId, 
  isLoading = false 
}: RevealMoveModalProps) {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [salt, setSalt] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedMove(null);
      setSalt('');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (selectedMove === null) {
      newErrors.move = 'Please select a move';
    }

    if (!salt.trim()) {
      newErrors.salt = 'Salt is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReveal = () => {
    if (!validateForm()) return;
    
    if (selectedMove !== null) {
      onReveal(selectedMove, salt);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Reveal Your Move - Room #{roomId}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Move Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select the move you originally chose
            </h3>
            <MoveSelector
              selectedMove={selectedMove}
              onMoveChange={setSelectedMove}
              disabled={isLoading}
            />
            {errors.move && (
              <p className="mt-2 text-sm text-red-600">{errors.move}</p>
            )}
          </div>

          {/* Salt Input */}
          <div>
            <label htmlFor="salt" className="block text-sm font-medium text-gray-700 mb-2">
              Salt (Random string you used when creating the room)
            </label>
            <input
              type="text"
              id="salt"
              value={salt}
              onChange={(e) => setSalt(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter the salt you used when creating this room"
            />
            {errors.salt && (
              <p className="mt-1 text-sm text-red-600">{errors.salt}</p>
            )}
            <p className="mt-1 text-sm text-gray-600">
              This should be the same random string you used when you created the room commitment.
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Important
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Make sure you select the exact same move and enter the exact same salt that you used when creating this room. 
                  If they don't match, the transaction will fail.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleReveal}
            disabled={isLoading || selectedMove === null || !salt.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Revealing...
              </>
            ) : (
              'Reveal Move'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
