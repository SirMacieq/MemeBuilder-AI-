export interface DaoGovernanceDtoQuery {
  proposalType: "daoGovernance";
  proposal: {
    name: string;
    description: string;
    relatedLinks?: string[];
  };
  governanceGoals: {
    subDAO: boolean;
    fundsAllocation?: number;
    otherActions: boolean;
  };
  governanceFunding?: {
    subDAOCreation?: number;
    generalReserve?: number;
  };
  quorum: number;
  voting: {
    periodDays: number;
    voteUnit: string;
  };
  proposal_id: string;
  proposer_wallet: string;
}

export interface DaoGovernanceQuery extends DaoGovernanceDtoQuery {
  _id: string;
  created_at?: number;
}
