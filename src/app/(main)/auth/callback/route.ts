import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const LOGIN_URL = "/login";
const OAUTH_CALLBACK_ERROR = "oauth_callback_failed";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    const loginUrl = new URL(LOGIN_URL, requestUrl);
    loginUrl.searchParams.set("error", OAUTH_CALLBACK_ERROR);

    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Supabase OAuth callback error:", error.message);

    const loginUrl = new URL(LOGIN_URL, requestUrl);
    loginUrl.searchParams.set("error", OAUTH_CALLBACK_ERROR);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(LOGIN_URL, requestUrl));
}
