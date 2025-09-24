'use client';

import { useMemo } from 'react';
import { getMoveChoice } from '@/lib/moveStorage';

/**
 * Hook to retrieve saved move choice for a room
 */
export function useSavedMoveChoice(roomId: number, baseStake: bigint) {
    const savedChoice = useMemo(() => {
        if (!roomId || !baseStake) return null;
        
        const choice = getMoveChoice(roomId, baseStake);
        if (choice) {
            console.log('💾 Retrieved saved move choice:', { roomId, move: choice.move, baseStake: baseStake.toString() });
        } else {
            console.log('🔍 No saved move choice found for room:', roomId);
        }
        
        return choice;
    }, [roomId, baseStake]);
    
    return savedChoice;
}
