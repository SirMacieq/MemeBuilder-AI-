"use server";
import "server-only";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";

import { ErrorType, Response, ResponseStatus } from "@/types/serverResponse";
import { UserRole } from "@/types/users";
import { CustomJWTClaims } from "@/types/auth";
import { encode } from "../../utils/authUtils/jwtUtils";
import { userSignin } from "@/lib/api/user/user";
import setTokenCookie from "@/lib/api/setTokenCookie";
import { revalidatePath } from "next/cache";
import getCurrentUserData from "../user/getCurrentUserData";

/**
 *
 * server action to handle signin action.
 * If auth succeded, it sets a cookie with jwt token
 * @param walletId wallet pubKey in string format
 * @param signedMessage signed message in base64
 * @param message message
 */
const signinAction = async (
  walletId: string,
  signedMessage: string,
  message: string,
): Promise<Response> => {
  let user = null;
  try {
    const cookieStore = await cookies();
    const isDev = process.env.NODE_ENV === "development";

    // is alerady signed in return
    if (cookieStore.has("next-token"))
      return {
        status: ResponseStatus.Ok,
      };
    const res = await userSignin({ wallet: walletId, signedMessage, message });

    //
    // Setting api cookie
    //
    if ("token" in res.content) {
      setTokenCookie(res.content.token);
    } else if ("validationToken" in res.content) {
      setTokenCookie(res.content.validationToken);
    } else {
      throw new Error("Unknown response");
    }

    // creating new token valid for 1hour
    const claims: CustomJWTClaims = {
      userId: res.content.user._id,
      userRole: UserRole.User,
    };

    const token = await encode(claims);
    //storing expiration date of now + 1h
    const exp = new Date(Date.now() + 60 * 60 * 1000);

    //
    // set cookie containing the token for next backend
    //

    // condition on env to allow test on phone since server is hosted on
    // localhost and accessed with ip on local network
    // should work when prod site is on the same ip
    cookieStore.set("next-token", token, {
      httpOnly: true,
      secure: isDev ? undefined : true,
      expires: exp,
      sameSite: isDev ? undefined : "strict",
      path: "/",
    });

    //
    // finally returning Ok response
    //
    try {
      user = await getCurrentUserData();
    } catch {}
  } catch {
    return {
      type: ErrorType.InternalError,
      status: ResponseStatus.Error,
    };
  }
  revalidatePath("/");
  if (!user?.nickname) {
    redirect("/profile");
  }
  return {
    status: ResponseStatus.Ok,
  };
};
export default signinAction;
