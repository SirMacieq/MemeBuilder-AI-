import { NextRequest, NextResponse } from "next/server";
import isAuth from "@/lib/utils/authUtils/getRole";

const middleware = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const isLogged = await isAuth();

  //
  //handle not logges case
  if (!isLogged && path !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  //
  //handling /login when isLogged
  if (isLogged && path === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
};
export default middleware;

//
// Execute the middleware for theses routes matcher
//
export const config = {
  matcher: ["/profile", "/profile/:path*"],
};
