export interface TokenDtoQuery {
    proposalId: string;
    createdAt: Date;
    token: {
      name: string;
      symbol: string;
      description: string;
      logoURL?: string;
      totalSupply: number;
      tokenAddress: string;
      network: "solana" | "sonic";
    };
    funding: {
      model: "presale" | "treasury-backed";
      softCap?: number;
      hardCap?: number | "dynamic";
      raisedAmount: number;
      fundingGoals: {
        lpPool?: number;
        treasuryReserve?: number;
        kolCampaign?: number;
        aiAgent?: number;
      };
      unlockModel?: {
        dynamicUnlock?: boolean;
        endsEarlyOnHardCap?: boolean;
      };
    };
    tokenomics: {
      allocations: {
        daoLp: number;
        daoVoters: number;
        contributorAirdrop: number;
        teamReserve?: number;
        [key: string]: number; // extensible for custom allocations
      };
    };
    airdropModules?: {
      dropScore?: boolean;
      gte?: boolean;
      gta?: boolean;
    };
    voting: {
      votingPeriodDays: number;
      quorumType: "investment-based" | "quorum-51%";
      eligibleUnit: string;
      totalVotes: number;
      passed: boolean;
    };
    launchMeta?: {
      deployedBy: string;
      txHash: string;
      blockNumber?: number;
    };
  }
  
  export interface TokenQuery extends TokenDtoQuery {
    _id: string;
    created_at?: number;
  }
  