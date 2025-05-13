"use server";
import "server-only";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 *
 * server action to handle logout action.
 * it deletes the cookie with jwt token
 *
 * redirects to home
 *
 */
const logoutAction = async () => {
  const cookieStore = await cookies();

  if (!cookieStore.has("next-token")) {
    return;
  }
  cookieStore.delete("next-token");
  cookieStore.delete("api-token");

  revalidatePath("/");
};

export default logoutAction;
