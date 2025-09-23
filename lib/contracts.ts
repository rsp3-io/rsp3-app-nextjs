import { ContractConfig } from '@/types';

// Contract addresses for Immutable zkEVM Testnet
export const CONTRACT_CONFIG: ContractConfig = {
  rsp3Address: process.env.NEXT_PUBLIC_RSP3_CONTRACT_ADDRESS || '',
  usdtAddress: process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS || '',
  chainId: 13473, // Immutable zkEVM Testnet
};

// Contract ABI imports will be added here when migrating from the React app
// For now, we'll use placeholder types

export const RSP3_ABI = [
  // ABI will be imported from the smart contracts project
] as const;

export const USDT_ABI = [
  // ABI will be imported from the smart contracts project
] as const;
