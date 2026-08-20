import { NextResponse } from "next/server";

import { getAuthContext } from "@/lib/auth/get-auth-context";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const context = await getAuthContext();

    return NextResponse.json({
      ok: true,
      ...context,
    });
  } catch (error) {
    console.error("Auth context resolution error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to resolve auth context.",
      },
      { status: 500 },
    );
  }
}
