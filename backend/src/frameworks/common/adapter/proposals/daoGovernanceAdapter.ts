import { Types } from "mongoose";
import { DaoGovernanceQuery } from "../../../../types/proposals/daoGovernance-types";

export type mongoDaoGovernanceResponse = {
  proposal: {
    name: string;
    description: string;
    relatedLinks?: string[];
  };
  governanceGoals: {
    subDAO: boolean;
    fundsAllocation: number;
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
  proposer_wallet: string;
  created_at?: number;
  _id: Types.ObjectId;
  __v: number;
};

export const daoGovernanceTypeFormatter = (
  daoGovernanceMongoResponse: any
): DaoGovernanceQuery => {
  const daoGovernanceMongo: mongoDaoGovernanceResponse =
    daoGovernanceMongoResponse._doc
      ? daoGovernanceMongoResponse._doc
      : daoGovernanceMongoResponse;

  const { _id } = daoGovernanceMongo;

  const formatted: any = {
    ...daoGovernanceMongo,
    _id: _id.toString(),
  };

  delete formatted.__v;

  const daoGovernance: DaoGovernanceQuery = {
    ...formatted,
    proposalType: "daoGovernance",
  };

  return daoGovernance;
};
