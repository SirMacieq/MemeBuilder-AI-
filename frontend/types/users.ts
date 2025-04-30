export enum UserRole {
  Admin = "admin",
  User = "user",
  Unauthenticated = "unauthenticated",
}

export type User = {
  id: string;
  email: string;
  passwordHash: string;
};

//
//
// Interfaces used for requests
//
//
export interface UserCreateRequest {
  email: string;
  pass: string;
}

export interface UserLoginRequest {
  email: string;
  pass: string;
}
