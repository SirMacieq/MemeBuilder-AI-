import { Types } from "mongoose";
import { TreasuryTokenQuery } from "../../../../types/proposals/treasuryToken-types";

export type mongoTreasuryTokenResponse = {
  token: {
    name: string;
    symbol: string;
    description: string;
    logoUrl: string;
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
  proposal_id: string;
  proposer_wallet: string;
  created_at?: number;
  _id: Types.ObjectId;
  __v: number;
};

export const treasuryTokenTypeFormatter = (
  treasuryTokenMongoResponse: any
): TreasuryTokenQuery => {
  const treasuryTokenMongo: mongoTreasuryTokenResponse =
    treasuryTokenMongoResponse._doc
      ? treasuryTokenMongoResponse._doc
      : treasuryTokenMongoResponse;

  const { _id } = treasuryTokenMongo;

  const formatted: any = {
    ...treasuryTokenMongo,
    _id: _id.toString(),
  };

  delete formatted.__v;

  const treasuryToken: TreasuryTokenQuery = { ...formatted };

  return treasuryToken;
};
