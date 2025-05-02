import { Types } from "mongoose";
import { TokenQuery } from "../../../../types/token/token-types";

export type mongoTokenResponse = {
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
      [key: string]: number;
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
  created_at?: number;
  _id: Types.ObjectId;
  __v: number;
};

export const tokenTypeFormatter = (tokenMongoResponse: any): TokenQuery => {
  const mongoDoc: mongoTokenResponse = tokenMongoResponse._doc
    ? tokenMongoResponse._doc
    : tokenMongoResponse;

  const { _id, __v, ...rest } = mongoDoc;

  const token: TokenQuery = {
    ...rest,
    _id: _id.toString(),
  };

  return token;
};
