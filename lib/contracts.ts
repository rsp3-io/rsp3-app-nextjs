import { ContractConfig } from '@/types';
import { RSP3_ABI } from '@/abi/rsp3';
import { ERC20_ABI } from '@/abi/erc20';

// Contract addresses for Immutable zkEVM Testnet
export const CONTRACT_CONFIG: ContractConfig = {
  rsp3Address: process.env.NEXT_PUBLIC_RSP3_CONTRACT_ADDRESS || '',
  usdtAddress: process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS || '',
  chainId: 13473, // Immutable zkEVM Testnet
};

// Export ABIs
export { RSP3_ABI, ERC20_ABI as USDT_ABI };
