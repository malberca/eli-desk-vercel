"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/config/auth";
import { supabase } from "@/lib/supabase";

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

export async function loginAction(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Ingresá correo y contraseña." };
  }

  // Validate against Supabase using the secure function
  const { data, error } = await supabase.rpc("validate_admin_login", {
    p_email: email,
    p_password: password,
  });

  if (error || !data || data.length === 0) {
    return { error: "Email o contraseña incorrectos." };
  }

  const admin = data[0];

  // Store session info in cookie
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify({
    id: admin.id,
    email: admin.email,
    name: admin.name,
  }), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
    httpOnly: true,
    sameSite: "lax",
  });

  redirect("/dashboard/default");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}

// Helper: obtener datos del admin logueado desde la cookie
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
