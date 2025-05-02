"use server";
import getApiUrl from "@/lib/getApiUrl";
import getToken from "@/lib/api/getToken";
import { ResponseRequest } from "@/lib/api/genericResponse";

export interface FundedToken {
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
type FundedTokenCreate = Omit<FundedToken, "_id" | "created_at">;
type FundedTokenUpdate = Omit<
  FundedToken,
  "_id" | "created_at" | "proposer_wallet"
>;

// GET ALL
type FundedTokenGetAllResponse = ResponseRequest<{
  fundedTokens: FundedToken[];
}>;
export async function fundedTokenGetAll(): Promise<FundedTokenGetAllResponse> {
  const res = await fetch(getApiUrl() + "/proposals/funded-token/all", {
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
type FundedTokenGetOneResponse = ResponseRequest<{ fundedToken: FundedToken }>;
export async function fundedTokenGetOne(
  id: string,
): Promise<FundedTokenGetOneResponse> {
  const res = await fetch(
    getApiUrl() + "/proposals/funded-token/getById/" + id,
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
type FundedTokenCreateResponse = ResponseRequest<{ fundedToken: FundedToken }>;
export async function fundedTokenCreate(
  data: FundedTokenCreate,
): Promise<FundedTokenCreateResponse> {
  const res = await fetch(getApiUrl() + "/proposals/funded-token/add", {
    method: "POST",
    body: JSON.stringify(data),
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

//DELETE
type FundedTokenDeleteResponse = ResponseRequest<{ fundedToken: FundedToken }>;
export async function fundedTokenDelete(
  id: string,
): Promise<FundedTokenDeleteResponse> {
  const res = await fetch(
    getApiUrl() + "/proposals/funded-token/delete/" + id,
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
type FundedTokenUpdateResponse = ResponseRequest<FundedToken>;
export async function fundedTokenUpdate(
  id: string,
  data: FundedTokenUpdate,
): Promise<FundedTokenUpdateResponse> {
  const res = await fetch(
    getApiUrl() + "/proposals/funded-token/updateById/" + id,
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
