'use client';

import { useState, useCallback } from 'react';
import { useReadContract } from 'wagmi';
import { keccak256, toHex, concat, encodeFunctionData } from 'viem';
import { RSP3_ABI } from '@/abi/rsp3';
import { CONTRACT_CONFIG } from '@/lib/contracts';
import { Tier, Move, TierMultipliers, CreateRoomParams, StakeCalculation } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { passportInstance } from '@/lib/passport';

export function useCreateRoom() {
  const { accountAddress } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
    return toHex(randomBytes);
  }, []);

  // Create commit hash for a move
  const createCommitHash = useCallback((move: Move, salt: string) => {
    const moveBytes = toHex(move, { size: 32 });
    const saltBytes = salt as `0x${string}`;
    return keccak256(concat([moveBytes, saltBytes]));
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

  // Create a new room
  const createRoom = useCallback(async (params: CreateRoomParams) => {
    if (!accountAddress || !CONTRACT_CONFIG.rsp3Address) {
      throw new Error('Account or contract address not available');
    }

    setIsLoading(true);
    try {
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
          addToast({ title: 'Room created successfully!', type: 'success' });
          return txHash;
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
