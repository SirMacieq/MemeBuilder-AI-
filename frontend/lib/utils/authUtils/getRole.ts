"use server";
import "server-only";
import { cookies } from "next/headers";
import { UserRole } from "@/types/users";
import { decode } from "./jwtUtils";
import { CustomJWTClaims } from "@/types/auth";

/**
 * gets the auth status
 * from the session cookies
 * @async
 *
 */
export const getRole = async (): Promise<UserRole> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return UserRole.Unauthenticated;
  }
  const claims = await getClaims();
  return claims.userRole;
};

/**
 * Retrives the token from cookie store end returns claims
 * @async
 * @returns claims
 *
 */
export const getClaims = async (): Promise<CustomJWTClaims> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new Error("No token found");
  }
  try {
    const claims = await decode(token);
    return claims;
  } catch {
    throw new Error("Failed to decode token");
  }
};
