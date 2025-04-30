"use server";
import "server-only";
import { cookies } from "next/headers";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { ErrorType, Response, ResponseStatus } from "@/types/serverResponse";
import { UserRole } from "@/types/users";
import { CustomJWTClaims } from "@/types/auth";
import { UserLoginRequest } from "@/types/users";
import { encode } from "../../utils/authUtils/jwtUtils";

/**
 *
 * server action to handle login action.
 * If auth succeded, it sets a cookie with jwt token
 *
 */
export const loginAction = async (
  _res: Response<UserLoginRequest>,
  fd: FormData,
): Promise<Response> => {
  const email = fd.get("email");
  const pass = fd.get("password");

  const envKey = process.env.ADMIN_KEY;
  let jwtSecret = process.env.JWT_SECRET;
  // checking all entries
  if (!key) {
    return {
      status: ResponseStatus.Error,
      type: ErrorType.UnprocessableEntity,
    };
  }
  if (!envKey) {
    return {
      status: ResponseStatus.Error,
      type: ErrorType.InternalError,
      message: "undefined ADMIN_KEY in env",
    };
  }
  if (!jwtSecret) {
    return {
      status: ResponseStatus.Error,
      type: ErrorType.InternalError,
      message: "undefined JWT_SECRET in env",
    };
  }
  jwtSecret = jwtSecret.toString();

  //
  //
  // now we can check if the key is matching with hash stored in env
  //
  //
  if (bcrypt.compareSync(key as string, envKey)) {
    // creating new token valid for 1hour
    const claims: CustomJWTClaims = {
      userId: "admin",
      userRole: UserRole.User,
    };
    const token = await encode(claims);
    //storing expiration date of now + 1h
    const exp = new Date(Date.now() + 60 * 60 * 1000);

    //
    // set cookie containing the token
    //
    const cookieStore = await cookies();
    const isDev = process.env.NODE_ENV === "development";

    // condition on env to allow test on phone since server is hosted on
    // localhost and accessed with ip on local network
    // should work when prod site is on the same ip
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: isDev ? undefined : true,
      expires: exp,
      sameSite: isDev ? undefined : "strict",
      path: "/",
    });

    //
    // finally returning Ok response
    //
    redirect("/profile");
  }

  // if we reached here, it means the key is not matching
  return {
    status: ResponseStatus.Error,
    type: ErrorType.Unauthorized,
    message: "invalid key",
  };
};
