import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { AUTH_COOKIE_NAME } from "@/config/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return NextResponse.json({ error: "Ingresá email y contraseña." }, { status: 400 });
  }

  const { data: user, error } = await supabaseAdmin
    .from("admin_users")
    .select("email, password_hash, name")
    .eq("email", email)
    .single();

  if (error || !user) {
    console.error("Login DB error:", error);
    return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(
    AUTH_COOKIE_NAME,
    JSON.stringify({
      email: user.email,
      name: user.name,
      role: "admin",
    }),
    {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "lax",
    },
  );

  return NextResponse.json({ success: true });
}
