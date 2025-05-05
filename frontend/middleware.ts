import { isLogged } from "@/lib/utils/authUtils/next-token-utils";
import { NextRequest, NextResponse } from "next/server";

const middleware = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;

  const isLoggedBool = await isLogged();

  //
  //handle not logges case
  if (!isLoggedBool && path !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  //
  //handling /login when isLogged
  if (isLoggedBool && path === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
};
export default middleware;

//
// Execute the middleware for theses routes matcher
//
export const config = {
  matcher: ["/profile", "/profile/:path*", "/dashboard", "/dashboard/:path*"],
};
