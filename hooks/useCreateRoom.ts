'use client';

import { useState, useCallback, useRef } from 'react';
import { useReadContract } from 'wagmi';
import { keccak256, toHex, concat, encodeFunctionData, decodeEventLog, encodePacked } from 'viem';
import { RSP3_ABI } from '@/abi/rsp3';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { Tier, Move, TierMultipliers, CreateRoomParams, StakeCalculation } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { useBalanceContext } from '@/contexts/BalanceContext';
import { passportInstance } from '@/lib/passport';
import { saveMoveChoice } from '@/lib/moveStorage';

export function useCreateRoom() {
  const { accountAddress } = useAuth();
  const { addToast } = useToast();
  const { refetchBalances } = useBalanceContext();
  const [isLoading, setIsLoading] = useState(false);
  const currentRoomData = useRef<{ baseStake: bigint; move: Move; salt: string } | null>(null);

  // Get tier multipliers
  const { data: casualMultipliers } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getTierMultipliers',
    args: [Tier.Casual],
  });

  const { data: standardMultipliers } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getTierMultipliers',
    args: [Tier.Standard],
  });

  const { data: degenMultipliers } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getTierMultipliers',
    args: [Tier.Degen],
  });

  // Get minimum base stake
  const { data: minBaseStake } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getMinBaseStake',
  });

  // Get token decimals
  const { data: tokenDecimals } = useReadContract({
    address: CONTRACT_CONFIG.rsp3Address as `0x${string}`,
    abi: RSP3_ABI,
    functionName: 'getTokenDecimals',
  });

  // Generate a random salt for move commitment
  const generateSalt = useCallback(() => {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    // Generate plain hex string without 0x prefix (same as MVC repo)
    return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }, []);

  // Create commit hash for a move
  const createCommitHash = useCallback((move: Move, salt: string) => {
    // Use the same encoding as MVC repo: keccak256(abi.encodePacked(move, salt))
    return keccak256(encodePacked(['uint8', 'string'], [move, salt]));
  }, []);

  // Get tier multipliers from contract data
  const getTierMultipliers = useCallback((tier: Tier): TierMultipliers => {
    switch (tier) {
      case Tier.Casual:
        if (casualMultipliers && Array.isArray(casualMultipliers)) {
          return {
            rockMultiplier: casualMultipliers[0],
            scissorMultiplier: casualMultipliers[1],
            paperMultiplier: casualMultipliers[2],
          };
        }
        return { rockMultiplier: BigInt(5), scissorMultiplier: BigInt(2), paperMultiplier: BigInt(1) };
      case Tier.Standard:
        if (standardMultipliers && Array.isArray(standardMultipliers)) {
          return {
            rockMultiplier: standardMultipliers[0],
            scissorMultiplier: standardMultipliers[1],
            paperMultiplier: standardMultipliers[2],
          };
        }
        return { rockMultiplier: BigInt(10), scissorMultiplier: BigInt(5), paperMultiplier: BigInt(1) };
      case Tier.Degen:
        if (degenMultipliers && Array.isArray(degenMultipliers)) {
          return {
            rockMultiplier: degenMultipliers[0],
            scissorMultiplier: degenMultipliers[1],
            paperMultiplier: degenMultipliers[2],
          };
        }
        return { rockMultiplier: BigInt(100), scissorMultiplier: BigInt(20), paperMultiplier: BigInt(1) };
      default:
        return { rockMultiplier: BigInt(10), scissorMultiplier: BigInt(5), paperMultiplier: BigInt(1) };
    }
  }, [casualMultipliers, standardMultipliers, degenMultipliers]);

  // Calculate stake for a specific move and tier
  const calculateStake = useCallback((baseStake: bigint, move: Move, tier: Tier): bigint => {
    const multipliers = getTierMultipliers(tier);
    let multiplier: bigint;
    
    switch (move) {
      case Move.Rock:
        multiplier = multipliers.rockMultiplier;
        break;
      case Move.Scissor:
        multiplier = multipliers.scissorMultiplier;
        break;
      case Move.Paper:
        multiplier = multipliers.paperMultiplier;
        break;
      default:
        multiplier = BigInt(0);
    }
    
    return baseStake * multiplier;
  }, [getTierMultipliers]);

  // Get all stake calculations for a tier
  const getStakeCalculations = useCallback((baseStake: bigint, tier: Tier): StakeCalculation[] => {
    const moves = [Move.Rock, Move.Scissor, Move.Paper];
    const calculations: StakeCalculation[] = [];

    for (const move of moves) {
      const stake = calculateStake(baseStake, move, tier);
      const multipliers = getTierMultipliers(tier);
      let multiplier: bigint;
      
      switch (move) {
        case Move.Rock:
          multiplier = multipliers.rockMultiplier;
          break;
        case Move.Scissor:
          multiplier = multipliers.scissorMultiplier;
          break;
        case Move.Paper:
          multiplier = multipliers.paperMultiplier;
          break;
        default:
          multiplier = BigInt(0);
      }

      calculations.push({
        move,
        stake,
        multiplier,
      });
    }

    return calculations;
  }, [calculateStake, getTierMultipliers]);

  // Helper function to extract room ID from transaction receipt
  const extractRoomIdFromReceipt = useCallback((receipt: any): number | null => {
    try {
      // Find the RoomCreated event log
      const contractAddress = CONTRACT_CONFIG.rsp3Address?.toLowerCase();
      
      for (const log of receipt.logs) {
        if (log.address.toLowerCase() === contractAddress) {
          try {
            // Decode the log to check if it's a RoomCreated event
            const decoded = decodeEventLog({
              abi: RSP3_ABI,
              data: log.data,
              topics: log.topics,
            });
            
            if (decoded.eventName === 'RoomCreated') {
              const roomId = Number(decoded.args.roomId);
              console.log('🎉 Room Created Successfully!');
              console.log('Room ID:', roomId);
              console.log('Player A:', decoded.args.playerA);
              console.log('Base Stake:', decoded.args.baseStake.toString());
              return roomId;
            }
          } catch (decodeError) {
            // This log might not be a RoomCreated event, continue to next log
            continue;
          }
        }
      }
      
      console.log('⚠️ RoomCreated event not found in transaction logs');
      console.log('Transaction receipt:', receipt);
      console.log('All logs:', receipt.logs);
      
    } catch (error) {
      console.error('❌ Failed to parse room ID from receipt:', error);
    }
    
    return null;
  }, []);

  // Create a new room
  const createRoom = useCallback(async (params: CreateRoomParams & { move: Move; salt: string }) => {
    if (!accountAddress || !CONTRACT_CONFIG.rsp3Address) {
      throw new Error('Account or contract address not available');
    }

    setIsLoading(true);
    try {
      // Store the room data for later use when extracting room ID
      currentRoomData.current = { baseStake: params.baseStake, move: params.move, salt: params.salt };
      console.log('💾 Storing room creation data:', { baseStake: params.baseStake.toString(), move: params.move, saltLength: params.salt.length });

      // Get the provider from Passport
      const provider = await passportInstance.connectEvm();
      
      // Encode the function call
      const createRoomData = encodeFunctionData({
        abi: RSP3_ABI,
        functionName: 'createRoom',
        args: [params.baseStake, params.commitHash as `0x${string}`, params.tier],
      });

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accountAddress,
          to: CONTRACT_CONFIG.rsp3Address,
          data: createRoomData,
        }],
      }) as `0x${string}`;

      // Wait for transaction confirmation
      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const receipt = await provider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash],
        });
        
        if (receipt) {
          // Extract room ID from transaction receipt
          const roomId = extractRoomIdFromReceipt(receipt);
          
          // Save move choice if room ID was extracted successfully
          if (roomId && currentRoomData.current) {
            const { baseStake, move, salt } = currentRoomData.current;
            saveMoveChoice(roomId, baseStake, move, salt);
            console.log('✅ Move choice saved to permanent storage:', { roomId, move });
            
            // Clear the current room data since it's been processed
            currentRoomData.current = null;
          }
          
          // Refetch balances after successful room creation
          refetchBalances();
          
          addToast({ title: 'Room created successfully!', type: 'success' });
          return { txHash, roomId };
        }
        
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Transaction confirmation timeout');
      }

    } catch (error: any) {
      console.error('Error creating room:', error);
      const errorMessage = error?.shortMessage || error?.message || 'Failed to create room';
      addToast({ title: errorMessage, type: 'error' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [accountAddress, addToast]);

  // Format stake amount for display
  const formatStake = useCallback((stake: bigint, decimals: number = 6): string => {
    const divisor = BigInt(10 ** decimals);
    const wholePart = stake / divisor;
    const fractionalPart = stake % divisor;
    
    if (fractionalPart === BigInt(0)) {
      return wholePart.toString();
    }
    
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmedFractional = fractionalStr.replace(/0+$/, '');
    
    return trimmedFractional ? `${wholePart}.${trimmedFractional}` : wholePart.toString();
  }, []);

  // Parse stake amount from string
  const parseStake = useCallback((stakeStr: string, decimals: number = 6): bigint => {
    const [wholePart, fractionalPart = ''] = stakeStr.split('.');
    const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
    return BigInt(wholePart) * BigInt(10 ** decimals) + BigInt(paddedFractional);
  }, []);

  return {
    isLoading,
    minBaseStake: minBaseStake as bigint | undefined,
    tokenDecimals: tokenDecimals as number | undefined,
    generateSalt,
    createCommitHash,
    calculateStake,
    getStakeCalculations,
    getTierMultipliers,
    createRoom,
    formatStake,
    parseStake,
  };
}
