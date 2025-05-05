"use server";
import { userDelete } from "@/lib/api/user/user";
import { getClaims } from "@/lib/utils/authUtils/next-token-utils";

export default async function deleteUser() {
  const id = (await getClaims()).userId;
  await userDelete(id);
}
