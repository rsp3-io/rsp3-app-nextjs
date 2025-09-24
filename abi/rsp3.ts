// RSP3 Game Contract ABI
export const RSP3_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "ERC1967InvalidImplementation",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967NonPayable",
    type: "error",
  },
  {
    inputs: [],
    name: "EnforcedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "ExpectedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedCall",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    inputs: [],
    name: "UUPSUnauthorizedCallContext",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "slot",
        type: "bytes32",
      },
    ],
    name: "UUPSUnsupportedProxiableUUID",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BalanceDeposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BalanceWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldPercentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newPercentage",
        type: "uint256",
      },
    ],
    name: "CollateralPenaltyPercentageUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "playerA",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "playerB",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "compensation",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "penalty",
        type: "uint256",
      },
    ],
    name: "GameForfeited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "playerA",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum IRSP3.Move",
        name: "playerAMove",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum IRSP3.Move",
        name: "playerBMove",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "winnings",
        type: "uint256",
      },
    ],
    name: "GameRevealed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PlatformFeeCollected",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "playerB",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum IRSP3.Move",
        name: "move",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
    ],
    name: "PlayerJoined",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "referrer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ReferralFeeDistributed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldPercentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newPercentage",
        type: "uint256",
      },
    ],
    name: "ReferralPercentageUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "referrer",
        type: "address",
      },
    ],
    name: "ReferrerSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "playerA",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "baseStake",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maxStake",
        type: "uint256",
      },
    ],
    name: "RoomCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "UPGRADE_INTERFACE_VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "baseStake",
        type: "uint256",
      },
      {
        internalType: "enum IRSP3.Move",
        name: "move",
        type: "uint8",
      },
      {
        internalType: "enum IRSP3.Tier",
        name: "tier",
        type: "uint8",
      },
    ],
    name: "calculateStake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
    ],
    name: "cancelExpiredRoom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
    ],
    name: "claimForfeit",
    outputs: [
      {
        internalType: "uint256",
        name: "compensation",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "baseStake",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "commitHash",
        type: "bytes32",
      },
      {
        internalType: "enum IRSP3.Tier",
        name: "tier",
        type: "uint8",
      },
    ],
    name: "createRoom",
    outputs: [
      {
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyWithdrawStuckFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAvailableRooms",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "roomId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "playerA",
            type: "address",
          },
          {
            internalType: "address",
            name: "playerB",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "baseStake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "playerAStake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "playerBStake",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "playerACommit",
            type: "bytes32",
          },
          {
            internalType: "enum IRSP3.Move",
            name: "playerBMove",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "revealDeadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTime",
            type: "uint256",
          },
          {
            internalType: "enum IRSP3.GameState",
            name: "state",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "collateralPenalty",
            type: "uint256",
          },
          {
            internalType: "enum IRSP3.Tier",
            name: "tier",
            type: "uint8",
          },
        ],
        internalType: "struct IRSP3.Room[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMinBaseStake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getPlayerActiveRooms",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "roomId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "playerA",
            type: "address",
          },
          {
            internalType: "address",
            name: "playerB",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "baseStake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "playerAStake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "playerBStake",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "playerACommit",
            type: "bytes32",
          },
          {
            internalType: "enum IRSP3.Move",
            name: "playerBMove",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "revealDeadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTime",
            type: "uint256",
          },
          {
            internalType: "enum IRSP3.GameState",
            name: "state",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "collateralPenalty",
            type: "uint256",
          },
          {
            internalType: "enum IRSP3.Tier",
            name: "tier",
            type: "uint8",
          },
        ],
        internalType: "struct IRSP3.Room[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getPlayerBalance",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "freeBalance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lockedBalance",
            type: "uint256",
          },
        ],
        internalType: "struct IRSP3.PlayerBalance",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getReferralPercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getReferrer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
    ],
    name: "getRoom",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "roomId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "playerA",
            type: "address",
          },
          {
            internalType: "address",
            name: "playerB",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "baseStake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "playerAStake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "playerBStake",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "playerACommit",
            type: "bytes32",
          },
          {
            internalType: "enum IRSP3.Move",
            name: "playerBMove",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "revealDeadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTime",
            type: "uint256",
          },
          {
            internalType: "enum IRSP3.GameState",
            name: "state",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "collateralPenalty",
            type: "uint256",
          },
          {
            internalType: "enum IRSP3.Tier",
            name: "tier",
            type: "uint8",
          },
        ],
        internalType: "struct IRSP3.Room",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRoomCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
    ],
    name: "getRoomState",
    outputs: [
      {
        internalType: "enum IRSP3.GameState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum IRSP3.Tier",
        name: "tier",
        type: "uint8",
      },
    ],
    name: "getTierMultipliers",
    outputs: [
      {
        internalType: "uint256",
        name: "rockMultiplier",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "scissorMultiplier",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "paperMultiplier",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getTokenDecimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "platformFeeRecipient",
        type: "address",
      },
      {
        internalType: "address",
        name: "usdtToken",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum IRSP3.Move",
        name: "move",
        type: "uint8",
      },
    ],
    name: "isValidMove",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
      {
        internalType: "enum IRSP3.Move",
        name: "move",
        type: "uint8",
      },
    ],
    name: "joinRoom",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
      {
        internalType: "enum IRSP3.Move",
        name: "move",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "salt",
        type: "string",
      },
    ],
    name: "revealMove",
    outputs: [
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "referrer",
        type: "address",
      },
    ],
    name: "setReferrer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newPercentage",
        type: "uint256",
      },
    ],
    name: "updateCollateralPenaltyPercentage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newRecipient",
        type: "address",
      },
    ],
    name: "updatePlatformFeeRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newPercentage",
        type: "uint256",
      },
    ],
    name: "updateReferralPercentage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newTimeLimit",
        type: "uint256",
      },
    ],
    name: "updateRevealTimeLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newExpirationTime",
        type: "uint256",
      },
    ],
    name: "updateRoomExpirationTime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newUsdtToken",
        type: "address",
      },
    ],
    name: "updateUsdtToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
