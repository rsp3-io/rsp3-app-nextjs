// Game-related types
export enum Tier {
  Casual = 0,
  Standard = 1,
  Degen = 2,
}

export enum Move {
  None = 0,
  Rock = 1,
  Scissor = 2,
  Paper = 3,
}

export enum GameState {
  None = 0,
  WaitingForPlayerB = 1,
  WaitingForReveal = 2,
  Completed = 3,
  Forfeited = 4,
}

export interface GameRoom {
  roomId: bigint;
  playerA: string;
  playerB: string;
  baseStake: bigint;
  playerAStake: bigint;
  playerBStake: bigint;
  playerACommit: string;
  playerBMove: Move;
  revealDeadline: bigint;
  expirationTime: bigint;
  state: GameState;
  collateralPenalty: bigint;
  tier: Tier;
}

export interface MoveData {
  player: string;
  choice: 'rock' | 'paper' | 'scissors';
  timestamp: number;
}

export interface GameResult {
  winner: string | null; // null for tie
  player1Move: MoveData;
  player2Move: MoveData;
  timestamp: number;
}

// User types
export interface UserProfile {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
}

// Contract types
export interface ContractConfig {
  rsp3Address: string;
  usdtAddress: string;
  chainId: number;
}

// Balance types
export interface PlayerBalance {
  freeBalance: bigint;
  lockedBalance: bigint;
}

// Room creation types
export interface TierMultipliers {
  rockMultiplier: bigint;
  scissorMultiplier: bigint;
  paperMultiplier: bigint;
}

export interface CreateRoomParams {
  baseStake: bigint;
  commitHash: string;
  tier: Tier;
}

export interface StakeCalculation {
  move: Move;
  stake: bigint;
  multiplier: bigint;
}