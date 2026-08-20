import { type NextRequest, NextResponse } from "next/server";

import { applySupabaseProxyResponse, createProxyClient } from "@/lib/supabase/proxy";

function withNoStore(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/login";
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  const { supabase, getResponse } = createProxyClient(request);
  const { data, error } = await supabase.auth.getClaims();

  const isAuthenticated = !error && Boolean(data?.claims?.sub);
  const supabaseResponse = getResponse();

  if (isDashboard && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);

    return withNoStore(applySupabaseProxyResponse(NextResponse.redirect(loginUrl), supabaseResponse));
  }

  if (isLoginPage && isAuthenticated) {
    return withNoStore(
      applySupabaseProxyResponse(NextResponse.redirect(new URL("/dashboard/default", request.url)), supabaseResponse),
    );
  }

  return withNoStore(supabaseResponse);
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/login"],
};
