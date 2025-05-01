export interface TreasuryTokenDtoQuery {
  proposalType: "treasuryToken";
  token: {
    name: string;
    symbol: string;
    description: string;
    logoURL: string;
  };
  chain: string;
  fundingGoals: {
    lp: number;
    treasury: number;
    kol: number;
    ai: number;
  };
  softCap: number;
  hardCap: number | null;
  fundingModel: {
    source: string;
    basedOnSelectedGoals: boolean;
    tokensCreatedOnApproval: boolean;
  };
  tokenomics: {
    supply: number;
    allocations: {
      lp: number;
      daoVoters: number;
      airdrop: number;
    };
  };
  airdropModules: {
    dropScore: boolean;
    gta: boolean;
  };
  voting: {
    periodDays: number;
    voteUnit: string;
    quorum: string;
    escrowedFunds: boolean;
    autoExecuteOnApproval: boolean;
  };
  eligibilityRequirements: {
    previousSuccess: boolean;
    rateLimit: string;
  };
  proposer_wallet: string;
}

export interface TreasuryTokenQuery extends TreasuryTokenDtoQuery {
  _id: string;
  created_at?: number;
}
