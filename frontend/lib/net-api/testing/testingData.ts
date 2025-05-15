import { BN } from "@coral-xyz/anchor";

export const dummyFundedToken = {
  token: {
    name: "Test Token 2",
    symbol: "waaaaah",
    description: "Test Description",
    logoURL: "https://test.com/logo.png",
  },
  selectedGoals: {
    lp: false,
    treasury: false,
    kol: false,
    ai: false,
  },
  fundingGoals: {
    lp: 10,
    treasury: 10,
    kol: 10,
    ai: 10,
  },
  softCap: new BN(0),
  hardCap: new BN(0),
  fundingModel: {
    dynamicUnlock: false,
    endsEarlyOnHardCap: false,
  },
  airdropModules: {
    dropScore: false,
  },
  voting: {
    periodDays: 0,
    voteUnit: "DAYS",
    escrowedFund: false,
  },
};
