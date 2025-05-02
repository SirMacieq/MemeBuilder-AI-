import FundedToken from "../../../../entities/proposals/FundedToken";
import { FundedTokenDtoQuery, FundedTokenQuery } from "../../../../types/proposals/fundedToken-types";
import { crudTestCreator } from "../crudTestCreator";

export const fundedTokenRepositoryTests = (repositories: any) => {
  const { fundedTokenRepository } = repositories;

  const fundedToken1: FundedTokenDtoQuery = new FundedToken({
    token: {
      name: "TurboFrog",
      symbol: "TFROG",
      description: "TurboFrog is the fastest memecoin on-chain. Powered by the DAO.",
      logoURL: "https://memesite.xyz/turbofrog.png"
    },
    selectedGoals: {
      lp: true,
      treasury: true,
      kol: false,
      ai: false
    },
    fundingGoals: {
      lp: 40500,
      treasury: 36000,
      kol: 10800,
      ai: 2700
    },
    softCap: 90000,
    hardCap: "dynamic",
    fundingModel: {
      dynamicUnlock: true,
      endsEarlyOnHardCap: true
    },
    airdropModules: {
      dropScore: true
    },
    voting: {
      periodDays: 5,
      voteUnit: "1 NFT or token equivalent = 1 vote",
      escrowedFunds: true
    },
    proposer_wallet: "wallet-fr-001"
  });

  const fundedToken2: FundedTokenDtoQuery = new FundedToken({
    token: {
      name: "PepeAI",
      symbol: "PEPAI",
      description: "Pepe with brains. Meme and AI unite!",
      logoURL: "https://memesite.xyz/pepeai.png"
    },
    selectedGoals: {
      lp: true,
      treasury: false,
      kol: true,
      ai: true
    },
    fundingGoals: {
      lp: 50000,
      treasury: 0,
      kol: 15000,
      ai: 3000
    },
    softCap: 68000,
    hardCap: 80000,
    fundingModel: {
      dynamicUnlock: false,
      endsEarlyOnHardCap: true
    },
    airdropModules: {
      dropScore: false
    },
    voting: {
      periodDays: 5,
      voteUnit: "1 NFT = 1 vote",
      escrowedFunds: true
    },
    proposer_wallet: "wallet-fr-002"
  });

  crudTestCreator<FundedTokenDtoQuery, FundedTokenQuery>(
    fundedTokenRepository,
    fundedToken1,
    fundedToken2,
    "funded_token_proposals"
  );
};
