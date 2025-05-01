import TreasuryToken from "../../../../entities/proposals/TreasuryToken";
import {
  TreasuryTokenDtoQuery,
  TreasuryTokenQuery,
} from "../../../../types/proposals/treasuryToken-types";
import { crudTestCreator } from "../crudTestCreator";

export const treasuryTokenRepositoryTests = (repositories: any) => {
  const { treasuryTokenRepository } = repositories;

  const treasuryToken1: TreasuryTokenDtoQuery = new TreasuryToken({
    token: {
      name: "PepeGPT",
      symbol: "PGPT",
      description:
        "PepeGPT is the meme agent of the chain — built by the people, funded by the DAO.",
      logoURL: "https://memesite.xyz/pepegpt.png",
    },
    chain: "Sonic SVM",
    fundingGoals: {
      lp: 40500,
      treasury: 36000,
      kol: 10800,
      ai: 2700,
    },
    softCap: 90000,
    hardCap: null, // can be null
    fundingModel: {
      source: "DAO_TREASURY",
      basedOnSelectedGoals: true,
      tokensCreatedOnApproval: true,
    },
    tokenomics: {
      supply: 1000000000,
      allocations: {
        lp: 50,
        daoVoters: 47.5,
        airdrop: 2.5,
      },
    },
    airdropModules: {
      dropScore: true,
      gta: true,
    },
    voting: {
      periodDays: 5,
      voteUnit: "1 NFT or token equivalent = 1 vote",
      quorum: "51%",
      escrowedFunds: false,
      autoExecuteOnApproval: true,
    },
    eligibilityRequirements: {
      previousSuccess: true,
      rateLimit: "1 per 14 days",
    },
    proposer_wallet: "wallet-tr-001",
  });

  const treasuryToken2: TreasuryTokenDtoQuery = new TreasuryToken({
    token: {
      name: "MemeMaster",
      symbol: "MEMEM",
      description:
        "MemeMaster is the ultimate memecoin with treasury-backed growth.",
      logoURL: "https://memesite.xyz/mememaster.png",
    },
    chain: "Ethereum",
    fundingGoals: {
      lp: 50000,
      treasury: 40000,
      kol: 12000,
      ai: 5000,
    },
    softCap: 85000,
    hardCap: 100000,
    fundingModel: {
      source: "DAO_TREASURY",
      basedOnSelectedGoals: true,
      tokensCreatedOnApproval: false,
    },
    tokenomics: {
      supply: 2000000000,
      allocations: {
        lp: 45,
        daoVoters: 50,
        airdrop: 5,
      },
    },
    airdropModules: {
      dropScore: false,
      gta: true,
    },
    voting: {
      periodDays: 7,
      voteUnit: "1 NFT = 1 vote",
      quorum: "60%",
      escrowedFunds: true,
      autoExecuteOnApproval: false,
    },
    eligibilityRequirements: {
      previousSuccess: false,
      rateLimit: "1 per 30 days",
    },
    proposer_wallet: "wallet-tr-002",
  });

  crudTestCreator<TreasuryTokenDtoQuery, TreasuryTokenQuery>(
    treasuryTokenRepository,
    treasuryToken1,
    treasuryToken2,
    "treasury_token_proposals"
  );
};
