import { Move } from '@/types';

const STORAGE_KEY_PREFIX = 'rsp3_move_';

/**
 * Generate a unique storage key for a room based on room ID and base stake
 */
function getStorageKey(roomId: number, baseStake: bigint): string {
    return `${STORAGE_KEY_PREFIX}${roomId}_${baseStake.toString()}`;
}

/**
 * Save a move choice and salt to browser localStorage with room ID
 */
export function saveMoveChoice(roomId: number, baseStake: bigint, move: Move, salt: string): void {
    try {
        const key = getStorageKey(roomId, baseStake);
        const data = {
            move,
            salt,
            timestamp: Date.now(),
            roomId,
            baseStake: baseStake.toString()
        };
        localStorage.setItem(key, JSON.stringify(data));
        console.log('💾 Move choice saved:', { roomId, move, baseStake: baseStake.toString() });
    } catch (error) {
        console.warn('Failed to save move choice to localStorage:', error);
    }
}

/**
 * Retrieve a move choice and salt from browser localStorage using room ID
 */
export function getMoveChoice(roomId: number, baseStake: bigint): { move: Move; salt: string } | null {
    try {
        const key = getStorageKey(roomId, baseStake);
        const stored = localStorage.getItem(key);
        
        if (!stored) {
            return null;
        }
        
        const data = JSON.parse(stored);
        
        // Verify the data matches the current room parameters
        if (data.roomId === roomId && data.baseStake === baseStake.toString()) {
            return {
                move: data.move as Move,
                salt: data.salt as string
            };
        }
        
        // If parameters don't match, remove the invalid entry
        localStorage.removeItem(key);
        return null;
    } catch (error) {
        console.warn('Failed to retrieve move choice from localStorage:', error);
        return null;
    }
}

/**
 * Remove a move choice from browser localStorage
 */
export function removeMoveChoice(roomId: number, baseStake: bigint): void {
    try {
        const key = getStorageKey(roomId, baseStake);
        localStorage.removeItem(key);
    } catch (error) {
        console.warn('Failed to remove move choice from localStorage:', error);
    }
}

/**
 * Clear all move choices from localStorage (useful for cleanup)
 */
export function clearAllMoveChoices(): void {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(STORAGE_KEY_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    } catch (error) {
        console.warn('Failed to clear move choices from localStorage:', error);
    }
}
