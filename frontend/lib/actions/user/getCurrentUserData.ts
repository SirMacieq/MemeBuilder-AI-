"use server";
import { userGetById } from "@/lib/api/user/user";
import { getClaims } from "@/lib/utils/authUtils/next-token-utils";

/**
 * Gets the current user data
 * Throws if not found
 */
export default async function getCurrentUserData() {
  const claims = await getClaims();
  const res = await userGetById(claims.userId);
  return res.content.user;
}
