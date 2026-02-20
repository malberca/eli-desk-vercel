"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import bcrypt from "bcryptjs";

import { AUTH_COOKIE_NAME } from "@/config/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getValueFromCookie(key: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}

export async function setValueToCookie(
  key: string,
  value: string,
  options: { path?: string; maxAge?: number } = {},
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    path: options.path ?? "/",
    maxAge: options.maxAge ?? 60 * 60 * 24 * 7,
  });
}

export async function getPreference<T extends string>(key: string, allowed: readonly T[], fallback: T): Promise<T> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key);
  const value = cookie ? cookie.value.trim() : undefined;
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export async function loginAction(_prev: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Ingres\u00e1 correo y contrase\u00f1a." };
  }

  const { data: user, error } = await supabaseAdmin
    .from("admin_users")
    .select("id, email, password_hash, name, avatar_url")
    .eq("email", email)
    .single();

  if (error || !user) {
    console.error("Login DB error:", error);
    return { error: "Email o contrase\u00f1a incorrectos." };
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return { error: "Email o contrase\u00f1a incorrectos." };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    AUTH_COOKIE_NAME,
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar_url || "",
    }),
    {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
      sameSite: "lax",
    },
  );

  redirect("/dashboard/default");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}

export async function getLoggedAdmin(): Promise<{
  id: string;
  email: string;
  name: string;
} | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
