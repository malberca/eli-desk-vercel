import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/config/auth";

// MVP: admin credentials
// TODO: migrate to Supabase Auth
const ADMIN_USERS = [
  {
    email: "adm.biancoc@gmail.com",
    password: "eli2025",
    name: "Carolina Bianco",
    role: "Administrador de Consorcios",
  },
];

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return NextResponse.json({ error: "Ingresá email y contraseña." }, { status: 400 });
  }

  const admin = ADMIN_USERS.find(
    (u) => u.email.toLowerCase() === email && u.password === password
  );

  if (!admin) {
    return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify({
    email: admin.email,
    name: admin.name,
    role: admin.role,
  }), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    sameSite: "lax",
  });

  return NextResponse.json({ success: true });
}
