import { UserDtoQuery } from "../../types/user/user-types";

const now = new Date().getTime();

export default class User {
  public wallet: string;
  public nickname: string | null;
  public bio: string | null;
  public avatar: string | null;
  public created_at: number;
  public last_login: number;

  constructor({
    wallet,
    nickname = null,
    bio = null,
    avatar = null,
    created_at,
    last_login,
  }: UserDtoQuery) {
    this.wallet = wallet;
    this.nickname = nickname;
    this.bio = bio;
    this.avatar = avatar;
    this.created_at = created_at ?? now;
    this.last_login = last_login ?? now;
  }
}
