// Game-related types
export interface GameRoom {
  id: string;
  creator: string;
  player1: string;
  player2?: string;
  betAmount: string;
  status: 'waiting' | 'active' | 'completed' | 'cancelled';
  createdAt: number;
  moves?: {
    player1?: Move;
    player2?: Move;
  };
  result?: GameResult;
}

export interface Move {
  player: string;
  choice: 'rock' | 'paper' | 'scissors';
  timestamp: number;
}

export interface GameResult {
  winner: string | null; // null for tie
  player1Move: Move;
  player2Move: Move;
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
