export const dummyFundedToken = {
  token: {
    name: "Test Token",
    symbol: "TST",
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
    lp: 0,
    treasury: 0,
    kol: 0,
    ai: 0,
  },
  softCap: 0,
  hardCap: 0,
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
