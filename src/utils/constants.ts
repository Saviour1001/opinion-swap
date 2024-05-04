import { baseSepolia, mantleSepoliaTestnet } from "viem/chains";

export const networks = [
  {
    id: baseSepolia.id,
    chain: "Base Sepolia",
    contract: "0xC21A38478c3412e7253B79E6E1e9Cd3d15F5b73c",
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "_description",
            type: "string",
          },
          {
            internalType: "string",
            name: "_option1",
            type: "string",
          },
          {
            internalType: "string",
            name: "_option2",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_deadline",
            type: "uint256",
          },
        ],
        name: "createProposal",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_proposalId",
            type: "uint256",
          },
        ],
        name: "distributeRewards",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_proposalId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_winningOption",
            type: "uint256",
          },
        ],
        name: "finalizeProposal",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_proposalId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_amountUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_amountETH",
            type: "uint256",
          },
        ],
        name: "increaseBet",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_usdcToken",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
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
            indexed: true,
            internalType: "uint256",
            name: "proposalId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            indexed: false,
            internalType: "string",
            name: "option1",
            type: "string",
          },
          {
            indexed: false,
            internalType: "string",
            name: "option2",
            type: "string",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
        ],
        name: "ProposalCreated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "proposalId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "winningOption",
            type: "uint256",
          },
        ],
        name: "ProposalFinalized",
        type: "event",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amountUSDC",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amountETH",
            type: "uint256",
          },
        ],
        name: "RewardWithdrawn",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "proposalId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "totalRewardsUSDC",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "totalRewardsETH",
            type: "uint256",
          },
        ],
        name: "RewardsDistributed",
        type: "event",
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
        inputs: [
          {
            internalType: "uint256",
            name: "_proposalId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_option",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_amountUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_amountETH",
            type: "uint256",
          },
        ],
        name: "vote",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "proposalId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "option",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amountUSDC",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amountETH",
            type: "uint256",
          },
        ],
        name: "VotePlaced",
        type: "event",
      },
      {
        inputs: [],
        name: "getChainlinkDataFeedLatestAnswer",
        outputs: [
          {
            internalType: "int256",
            name: "",
            type: "int256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_proposalId",
            type: "uint256",
          },
        ],
        name: "getTotalPoolETH",
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
            name: "_proposalId",
            type: "uint256",
          },
        ],
        name: "getTotalPoolUSDC",
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
            name: "_proposalId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_user",
            type: "address",
          },
        ],
        name: "getUserStakeETH",
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
            name: "_proposalId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_user",
            type: "address",
          },
        ],
        name: "getUserStakeUSDC",
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
            name: "_proposalId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_user",
            type: "address",
          },
        ],
        name: "getUserVote",
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
        name: "proposalCount",
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
            name: "",
            type: "uint256",
          },
        ],
        name: "proposals",
        outputs: [
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "option1",
            type: "string",
          },
          {
            internalType: "string",
            name: "option2",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "option1Votes",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "option2Votes",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "option1PoolUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "option2PoolUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "option1PoolETH",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "option2PoolETH",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isFinalized",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "winningOption",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "usdcToken",
        outputs: [
          {
            internalType: "contract IERC20",
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
            name: "",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "userStakesETH",
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
            name: "",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "userStakesUSDC",
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
            name: "",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "userVoted",
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
    ],
  },
  {
    id: mantleSepoliaTestnet.id,
    chain: "Mantle Sepolia Testnet",
    contract: "0xA4CCEb9e84b9682ca559AA41DB57f4BECe586dc5",
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "_description",
            type: "string",
          },
          {
            internalType: "string",
            name: "_option1",
            type: "string",
          },
          {
            internalType: "string",
            name: "_option2",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_deadline",
            type: "uint256",
          },
        ],
        name: "createProposal",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_proposalId",
            type: "uint256",
          },
        ],
        name: "distributeRewards",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_proposalId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_winningOption",
            type: "uint256",
          },
        ],
        name: "finalizeProposal",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_proposalId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_amountUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_amountETH",
            type: "uint256",
          },
        ],
        name: "increaseBet",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
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
            indexed: true,
            internalType: "uint256",
            name: "proposalId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            indexed: false,
            internalType: "string",
            name: "option1",
            type: "string",
          },
          {
            indexed: false,
            internalType: "string",
            name: "option2",
            type: "string",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
        ],
        name: "ProposalCreated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "proposalId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "winningOption",
            type: "uint256",
          },
        ],
        name: "ProposalFinalized",
        type: "event",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amountUSDC",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amountETH",
            type: "uint256",
          },
        ],
        name: "RewardWithdrawn",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "proposalId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "totalRewardsUSDC",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "totalRewardsETH",
            type: "uint256",
          },
        ],
        name: "RewardsDistributed",
        type: "event",
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
        inputs: [
          {
            internalType: "uint256",
            name: "_proposalId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_option",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_amountUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_amountETH",
            type: "uint256",
          },
        ],
        name: "vote",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "proposalId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "option",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amountUSDC",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amountETH",
            type: "uint256",
          },
        ],
        name: "VotePlaced",
        type: "event",
      },
      {
        inputs: [],
        name: "getChainlinkDataFeedLatestAnswer",
        outputs: [
          {
            internalType: "int256",
            name: "",
            type: "int256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_proposalId",
            type: "uint256",
          },
        ],
        name: "getTotalPoolETH",
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
            name: "_proposalId",
            type: "uint256",
          },
        ],
        name: "getTotalPoolUSDC",
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
            name: "_proposalId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_user",
            type: "address",
          },
        ],
        name: "getUserStakeETH",
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
            name: "_proposalId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_user",
            type: "address",
          },
        ],
        name: "getUserStakeUSDC",
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
            name: "_proposalId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_user",
            type: "address",
          },
        ],
        name: "getUserVote",
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
        name: "proposalCount",
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
            name: "",
            type: "uint256",
          },
        ],
        name: "proposals",
        outputs: [
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "option1",
            type: "string",
          },
          {
            internalType: "string",
            name: "option2",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "option1Votes",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "option2Votes",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "option1PoolUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "option2PoolUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "option1PoolETH",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "option2PoolETH",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isFinalized",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "winningOption",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "usdcToken",
        outputs: [
          {
            internalType: "contract IERC20",
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
            name: "",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "userStakesETH",
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
            name: "",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "userStakesUSDC",
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
            name: "",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "userVoted",
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
    ],
  },
];
