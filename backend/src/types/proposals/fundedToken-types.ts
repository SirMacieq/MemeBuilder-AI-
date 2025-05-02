export interface FundedTokenQuery {
    _id: string;
    token: {
      name: string;
      symbol: string;
      description: string;
      logoURL: string;
    };
    selectedGoals: {
      lp: boolean;
      treasury: boolean;
      kol: boolean;
      ai: boolean;
    };
    fundingGoals: {
      lp: number;
      treasury: number;
      kol: number;
      ai: number;
    };
    softCap: number;
    hardCap: number | "dynamic";
    fundingModel: {
      dynamicUnlock: boolean;
      endsEarlyOnHardCap: boolean;
    };
    airdropModules?: {
      dropScore: boolean;
    };
    voting: {
      periodDays: number;
      voteUnit: string;
      escrowedFunds: boolean;
    };
    created_at?: number;
    proposer_wallet: string;
  }
  
  export interface FundedTokenDtoQuery {
    token: {
      name: string;
      symbol: string;
      description: string;
      logoURL: string;
    };
    selectedGoals: {
      lp: boolean;
      treasury: boolean;
      kol: boolean;
      ai: boolean;
    };
    fundingGoals: {
      lp: number;
      treasury: number;
      kol: number;
      ai: number;
    };
    softCap: number;
    hardCap: number | "dynamic";
    fundingModel: {
      dynamicUnlock: boolean;
      endsEarlyOnHardCap: boolean;
    };
    airdropModules?: {
      dropScore: boolean;
    };
    voting: {
      periodDays: number;
      voteUnit: string;
      escrowedFunds: boolean;
    };
    proposer_wallet: string;
  }
  