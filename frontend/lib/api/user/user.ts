"use server";
import getApiUrl from "@/lib/envGetters/getApiUrl";
import getToken from "../getToken";
import { ResponseRequest } from "../genericResponse";

export interface User {
  _id: string;
  wallet: string;
  nickname: string | null;
  bio: string | null;
  avatar: string | null;
  created_at?: number; //timestamp,
}

interface UserSigninRequest {
  /** wallet public key in string format */
  wallet: string;
  signedMessage: string;
  message: string;
}
interface UserSigninResponseNew {
  status: number;
  error: { error: string; msg: string } | null;
  content: {
    user: User;
    title: string;
    msg: string;
    /** token to be used in header */
    validationToken: string;
  };
}
interface UserSigninResponseOld {
  status: number;
  error: { error: string; msg: string } | null;
  content: {
    user: User;
    /** token to be used in header */
    token: string;
  };
}
type UserSigninResponse = UserSigninResponseNew | UserSigninResponseOld;

export async function userSignin(data: UserSigninRequest) {
  const res = await fetch(getApiUrl() + "/user/signin", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  const json = (await res.json()) as UserSigninResponse;
  if (json.status !== 200 && json.status !== 201) {
    throw new Error(json.error?.error ?? "Unknown error");
  }
  return json;
}

type UserGetAllResponse = ResponseRequest<{ users: User[] }>;
export async function userGetAll(): Promise<UserGetAllResponse> {
  const res = await fetch(getApiUrl() + "/user/all", { method: "GET" });
  const json = await res.json();
  if (json.status !== 200) {
    throw new Error(json.error?.error ?? "Unknown error");
  }
  return json;
}

type UserGetByIdResponse = ResponseRequest<{ user: User }>;
export async function userGetById(id: string): Promise<UserGetByIdResponse> {
  const res = await fetch(getApiUrl() + "/user/getById/" + id, {
    method: "GET",
  });

  const json = await res.json();
  if (json.status !== 200) {
    throw new Error(json.error?.error ?? "Unknown error");
  }
  return json;
}

interface UserUpdateByIdRequest {
  nickname: string;
  bio: string;
  avatar?: string;
}
type UserUpdateByIdResponse = ResponseRequest<{ user: User }>;
export async function userUpdateById(
  data: UserUpdateByIdRequest,
  id: string,
): Promise<UserUpdateByIdResponse> {
  const res = await fetch(getApiUrl() + "/user/updateById/" + id, {
    method: "PUT",
    headers: {
      authorization: await getToken(),
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.status !== 200) {
    throw new Error(json.error?.error ?? "Unknown error");
  }
  return json;
}

type UserDeleteResponse = ResponseRequest<{ user: User }>;
export async function userDelete(id: string): Promise<UserDeleteResponse> {
  const res = await fetch(getApiUrl() + "/user/delete/" + id, {
    method: "DELETE",
    headers: {
      authorization: await getToken(),
    },
  });
  const json = await res.json();
  if (json.status !== 200) {
    throw new Error(json.error?.error ?? "Unknown error");
  }
  return json;
}
