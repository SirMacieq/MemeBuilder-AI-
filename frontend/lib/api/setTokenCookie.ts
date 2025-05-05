import { cookies } from "next/headers";

/**
 * sets api-token cookie
 * this cookie holds the token for the express api
 */
export default async function setTokenCookie(token: string) {
  const exp = new Date(Date.now() + 60 * 60 * 1000);
  //
  //
  // set cookie containing the token
  //
  const cookieStore = await cookies();
  const isDev = process.env.NODE_ENV === "development";

  // condition on env to allow test on phone since server is hosted on
  // localhost and accessed with ip on local network
  // should work when prod site is on the same ip
  cookieStore.set("api-token", token, {
    httpOnly: true,
    secure: isDev ? undefined : true,
    expires: exp,
    sameSite: isDev ? undefined : "strict",
    path: "/",
  });
}
