"use server";
import getApiUrl from "@/lib/getApiUrl";
import getToken from "@/lib/api/getToken";
import { ResponseRequest } from "@/lib/api/genericResponse";

export interface DaoGovToken {
  _id: string;
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
  created_at?: number;
  proposer_wallet: string;
}
export type DaoGovTokenCreate = Omit<DaoGovToken, "_id" | "created_at">;
export type DaoGovTokenUpdate = Omit<
  DaoGovToken,
  "_id" | "created_at" | "proposer_wallet"
>;

// GET ALL
type DaoGovTokenGetAllResponse = ResponseRequest<{
  daoGovernances: DaoGovToken[];
}>;
export async function daoGovTokenGetAll(): Promise<DaoGovTokenGetAllResponse> {
  const res = await fetch(getApiUrl() + "/proposals/dao-governance/all", {
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
type DaoGovTokenGetOneResponse = ResponseRequest<{
  daoGovernance: DaoGovToken;
}>;
export async function daoGovTokenGetOne(
  id: string,
): Promise<DaoGovTokenGetOneResponse> {
  const res = await fetch(
    getApiUrl() + "/proposals/dao-governance/getById/" + id,
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
type DaoGovTokenCreateResponse = ResponseRequest<{
  daoGovernance: DaoGovToken;
}>;
export async function daoGovTokenCreate(
  data: DaoGovTokenCreate,
): Promise<DaoGovTokenCreateResponse> {
  const res = await fetch(getApiUrl() + "/proposals/dao-governance/add", {
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
type DaoGovTokenDeleteResponse = ResponseRequest<{
  daoGovernance: DaoGovToken;
}>;
export async function daoGovTokenDelete(
  id: string,
): Promise<DaoGovTokenDeleteResponse> {
  const res = await fetch(
    getApiUrl() + "/proposals/dao-governance/delete/" + id,
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
type DaoGovTokenUpdateResponse = ResponseRequest<DaoGovToken>;
export async function daoGovTokenUpdate(
  id: string,
  data: DaoGovTokenUpdate,
): Promise<DaoGovTokenUpdateResponse> {
  const res = await fetch(
    getApiUrl() + "/proposals/dao-governance/updateById/" + id,
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
