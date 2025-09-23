'use client';

import { Move } from '@/types';

interface MoveSelectorProps {
  selectedMove: Move | null;
  onMoveChange: (move: Move) => void;
  disabled?: boolean;
}

const moveOptions = [
  {
    move: Move.Rock,
    name: 'Rock',
    emoji: '🪨',
    description: 'Crushes scissors',
    color: 'bg-gray-500',
    hoverColor: 'hover:bg-gray-600',
    borderColor: 'border-gray-300',
  },
  {
    move: Move.Scissor,
    name: 'Scissor',
    emoji: '✂️',
    description: 'Cuts paper',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    borderColor: 'border-blue-300',
  },
  {
    move: Move.Paper,
    name: 'Paper',
    emoji: '📄',
    description: 'Covers rock',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    borderColor: 'border-green-300',
  },
];

export default function MoveSelector({ selectedMove, onMoveChange, disabled = false }: MoveSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Choose Your Move</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {moveOptions.map((option) => {
          const isSelected = selectedMove === option.move;
          
          return (
            <button
              key={option.move}
              onClick={() => !disabled && onMoveChange(option.move)}
              disabled={disabled}
              className={`relative p-6 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? `${option.color} text-white shadow-lg scale-105 border-transparent`
                  : `bg-white ${option.borderColor} border-gray-200 ${option.hoverColor} hover:shadow-md hover:scale-102`
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-4xl">{option.emoji}</span>
                <h4 className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {option.name}
                </h4>
                <p className={`text-sm ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                  {option.description}
                </p>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {selectedMove !== null && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm text-yellow-800">
            <strong>Important:</strong> Your move will be committed to the blockchain and cannot be changed. 
            You&apos;ll reveal it after your opponent joins the room.
          </div>
        </div>
      )}
    </div>
  );
}
