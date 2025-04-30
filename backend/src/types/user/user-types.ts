export interface UserQuery {
    _id: string;
    wallet: string;
    nickname: string | null;
    bio: string | null;
    created_at?: number; //timestamp,
    last_login?: number; //timestamp,
}

export interface UserDtoQuery {
    wallet: string;
    nickname: string | null;
    bio: string | null;
    created_at?: number; //timestamp,
    last_login?: number; //timestamp,
}

export interface UserSigninQuery {
    wallet: string;
}