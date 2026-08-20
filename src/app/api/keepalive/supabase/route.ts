import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const keepaliveSecret = process.env.SUPABASE_KEEPALIVE_SECRET ?? "";
const keepaliveTable = process.env.SUPABASE_KEEPALIVE_TABLE ?? "admin_users";

function isAuthorized(request: Request) {
  if (!keepaliveSecret) {
    return false;
  }

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${keepaliveSecret}`;
}

async function touchSupabase() {
  const { count, error } = await supabaseAdmin
    .from(keepaliveTable)
    .select("*", { count: "exact", head: true })
    .limit(1);

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await touchSupabase();

    return NextResponse.json({
      ok: true,
      source: "supabase-keepalive",
      table: keepaliveTable,
      touchedAt: new Date().toISOString(),
      count,
    });
  } catch (error) {
    console.error("Supabase keepalive failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Supabase keepalive failed",
      },
      { status: 500 },
    );
  }
}
