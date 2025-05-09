"use server";
import getApiUrl from "@/lib/getApiUrl";
import getToken from "@/lib/api/getToken";
import { ResponseRequest } from "@/lib/api/genericResponse";

// DO NOT EDIT, copied from backend types
export interface TreasuryToken {
  _id: string;
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
  created_at?: number;
}
export type TreasuryTokenCreate = Omit<TreasuryToken, "_id" | "created_at">;
export type TreasuryTokenUpdate = Omit<
  TreasuryToken,
  "_id" | "created_at" | "proposer_wallet"
>;

// GET ALL
type TreasuryTokenGetAllResponse = ResponseRequest<{
  treasuryTokens: TreasuryToken[];
}>;
export async function treasuryTokenGetAll(): Promise<TreasuryTokenGetAllResponse> {
  const res = await fetch(getApiUrl() + "/proposals/treasury-token/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: await getToken(),
    },
  });
  const json = await res.json();
  if (json.status !== 200) {
    throw new Error(json.error?.error ?? "Unknown error");
  }
  return json;
}

//GET ONE
type TreasuryTokenGetOneResponse = ResponseRequest<{
  treasuryToken: TreasuryToken;
}>;
export async function treasuryTokenGetOne(
  id: string,
): Promise<TreasuryTokenGetOneResponse> {
  const res = await fetch(
    getApiUrl() + "/proposals/treasury-token/getById/" + id,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: await getToken(),
      },
    },
  );
  const json = await res.json();
  if (json.status !== 200) {
    throw new Error(json.error?.error ?? "Unknown error");
  }
  return json;
}

// CREATE
type TreasuryTokenCreateResponse = ResponseRequest<{
  treasuryToken: TreasuryToken;
}>;
export async function treasuryTokenCreate(
  data: TreasuryTokenCreate,
): Promise<TreasuryTokenCreateResponse> {
  const res = await fetch(getApiUrl() + "/proposals/treasury-token/add", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      authorization: await getToken(),
    },
  });
  const json = await res.json();
  if (json.status !== 200) {
    console.log(json);
    throw new Error(json.error?.error ?? "Unknown error");
  }
  return json;
}

//DELETE
type TreasuryTokenDeleteResponse = ResponseRequest<{
  treasuryToken: TreasuryToken;
}>;
export async function treasuryTokenDelete(
  id: string,
): Promise<TreasuryTokenDeleteResponse> {
  const res = await fetch(
    getApiUrl() + "/proposals/treasury-token/delete/" + id,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: await getToken(),
      },
    },
  );
  const json = await res.json();
  if (json.status !== 200) {
    throw new Error(json.error?.error ?? "Unknown error");
  }
  return json;
}

//UPDATE
type TreasuryTokenUpdateResponse = ResponseRequest<TreasuryToken>;
export async function treasuryTokenUpdate(
  id: string,
  data: TreasuryTokenUpdate,
): Promise<TreasuryTokenUpdateResponse> {
  const res = await fetch(
    getApiUrl() + "/proposals/treasury-token/updateById/" + id,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: await getToken(),
      },
    },
  );
  const json = await res.json();
  if (json.status !== 200) {
    throw new Error(json.error?.error ?? "Unknown error");
  }
  return json;
}
