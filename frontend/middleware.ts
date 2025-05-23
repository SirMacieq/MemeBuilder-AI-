import { isLogged } from "@/lib/utils/authUtils/next-token-utils";
import getCurrentUserData from "./lib/actions/user/getCurrentUserData";
import { NextRequest, NextResponse } from "next/server";

const middleware = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;

  const isLoggedBool = await isLogged();
  let user = null;
  try {
    user = await getCurrentUserData();
  } catch {}

  //
  //handle not logges case
  if (!isLoggedBool && path !== "/login") {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }
  //
  //handling /login when isLogged
  if (isLoggedBool && path === "/login") {
    const redirect = req.nextUrl.searchParams.get("redirect");
    if (redirect) {
      return NextResponse.redirect(new URL(redirect, req.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (path === "/dashboard" && !user?.nickname) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
};
export default middleware;

//
// Execute the middleware for theses routes matcher
//
export const config = {
  matcher: [
    "/login",
    "/profile",
    "/profile/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/proposals",
    "/proposals/:path*",
    "/proposal",
    "/proposal/:path*",
  ],
};
