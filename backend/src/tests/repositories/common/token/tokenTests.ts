import Token from "../../../../entities/token/Token";
import {
  TokenDtoQuery,
  TokenQuery,
} from "../../../../types/token/token-types";
import { crudTestCreator } from "../crudTestCreator";

export const tokenRepositoryTests = (repositories: any) => {
  const { tokenRepository } = repositories;

  const token1: TokenDtoQuery = new Token({
    proposalId: "proposal-token-001",
    createdAt: new Date("2025-01-01"),
    token: {
      name: "CommunityToken",
      symbol: "COM",
      description: "A token to empower the DAO community.",
      logoURL: "https://example.com/logo1.png",
      totalSupply: 1000000,
      tokenAddress: "0xabc123",
      network: "sonic",
    },
    funding: {
      model: "presale",
      softCap: 50000,
      hardCap: "dynamic",
      raisedAmount: 75000,
      fundingGoals: {
        lpPool: 30000,
        treasuryReserve: 20000,
        kolCampaign: 15000,
        aiAgent: 10000,
      },
      unlockModel: {
        dynamicUnlock: true,
        endsEarlyOnHardCap: false,
      },
    },
    tokenomics: {
      allocations: {
        daoLp: 300000,
        daoVoters: 200000,
        contributorAirdrop: 100000,
        teamReserve: 400000
      },
    },
    airdropModules: {
      dropScore: true,
      gte: true,
      gta: false,
    },
    voting: {
      votingPeriodDays: 7,
      quorumType: "investment-based",
      eligibleUnit: "1 NFT = 1 vote",
      totalVotes: 1000,
      passed: true,
    },
    launchMeta: {
      deployedBy: "wallet-deployer-001",
      txHash: "0xlaunchhash1",
      blockNumber: 123456,
    },
  });

  const token2: TokenDtoQuery = new Token({
    proposalId: "proposal-token-002",
    createdAt: new Date("2025-03-15"),
    token: {
      name: "BuilderToken",
      symbol: "BLD",
      description: "Token for contributors and builders.",
      logoURL: "https://example.com/logo2.png",
      totalSupply: 2000000,
      tokenAddress: "0xdef456",
      network: "solana",
    },
    funding: {
      model: "treasury-backed",
      raisedAmount: 100000,
      fundingGoals: {
        lpPool: 40000,
        treasuryReserve: 30000,
      },
      unlockModel: {
        dynamicUnlock: true,
        endsEarlyOnHardCap: false,
      },
    },
    tokenomics: {
      allocations: {
        daoLp: 500000,
        daoVoters: 250000,
        contributorAirdrop: 250000,
        teamReserve: 400000
      },
    },
    airdropModules: {
      dropScore: true,
      gte: true,
      gta: false,
    },
    voting: {
      votingPeriodDays: 10,
      quorumType: "quorum-51%",
      eligibleUnit: "1 token = 1 vote",
      totalVotes: 1500,
      passed: false,
    },
    launchMeta: {
      deployedBy: "wallet-deployer-002",
      txHash: "0xlaunchhash2",
    },
  });

  crudTestCreator<TokenDtoQuery, TokenQuery>(
    tokenRepository,
    token1,
    token2,
    "token"
  );
};
