import { isLogged } from "@/lib/utils/authUtils/next-token-utils";
import getCurrentUserData from "./lib/actions/user/getCurrentUserData";
import { NextRequest, NextResponse } from "next/server";

const middleware = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const isHomePage = path === "/";

  let res = NextResponse.next();

  if (isHomePage) {
    res.cookies.set("isHomePage", "true");
  } else {
    res.cookies.set("isHomePage", "false");

    const isLoggedBool = await isLogged();
    let user = null;
    try {
      user = await getCurrentUserData();
    } catch {}

    if (!isLoggedBool && path !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isLoggedBool && path === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path === "/dashboard" && !user?.nickname) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  return res;
};

export default middleware;

export const config = {
  matcher: [
    "/",
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
