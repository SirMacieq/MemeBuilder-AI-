import { Types } from "mongoose";
import { FundedTokenQuery } from "../../../../types/proposals/fundedToken-types";

export type mongoFundedTokenResponse = {
  token: {
    name: string;
    symbol: string;
    description: string;
    logoUrl: string;
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
  proposal_id: string;
  proposer_wallet: string;
  created_at?: number;
  _id: Types.ObjectId;
  __v: number;
};

export const fundedTokenTypeFormatter = (
  fundedTokenMongoResponse: any
): FundedTokenQuery => {
  const fundedTokenMongo: mongoFundedTokenResponse =
    fundedTokenMongoResponse._doc
      ? fundedTokenMongoResponse._doc
      : fundedTokenMongoResponse;

  const { _id } = fundedTokenMongo;

  const formatted: any = {
    ...fundedTokenMongo,
    _id: _id.toString(),
  };

  delete formatted.__v;

  const fundedToken: FundedTokenQuery = { ...formatted };

  return fundedToken;
};
