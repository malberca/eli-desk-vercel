import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/config/auth";

// Rollback reference preserved for AUTH-09.
export function middleware(request: NextRequest) {
  const session = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/login";
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/dashboard/default", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
