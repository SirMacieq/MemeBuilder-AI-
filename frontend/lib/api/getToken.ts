import { cookies } from "next/headers";

/**
 * gets api token from cookies, throws if not found
 */
export default async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("api-token")?.value;
  if (!token) throw new Error("No api token found in cookies");
  return token;
}
