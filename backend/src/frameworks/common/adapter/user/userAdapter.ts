import { Types } from "mongoose";
import { UserQuery } from "../../../../types/user/user-types";

export type mongoUserResponse = {
  wallet: string;
  nickname: string | null;
  bio: string | null;
  avatar: string | null;
  created_at?: number; //timestamp,
  last_login?: number; //timestamp,
  _id: Types.ObjectId;
  __v: number;
};

export const userTypeFormatter = (userMongoResponse: any): UserQuery => {
  const userMongo: mongoUserResponse = userMongoResponse._doc
    ? userMongoResponse._doc
    : userMongoResponse;
  const { _id } = userMongo;
  const formatted: any = { ...userMongo, _id: _id.toString() };
  delete formatted.__v;
  const user: UserQuery = { ...formatted };
  return user;
};
