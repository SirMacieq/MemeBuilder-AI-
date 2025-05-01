"use server";
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 *
 * server action to handle logout action.
 * it deletes the cookie with jwt token
 *
 */
const logoutAction = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("next-token");
  cookieStore.delete("api-token");

  redirect("/");
};

export default logoutAction;
