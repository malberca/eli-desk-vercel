import { AUTH_COOKIE_NAME } from "@/config/auth"

export interface SessionUser {
  id: string
  name: string
  email: string
  avatar: string
}

export function getSessionUser(): SessionUser | null {
  if (typeof document === "undefined") return null
  try {
    const raw = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`))
      ?.split("=")
      .slice(1)
      .join("=")
    if (!raw) return null
    const data = JSON.parse(decodeURIComponent(raw))
    return {
      id: data.id || "",
      name: data.name || "Admin",
      email: data.email || "",
      avatar: data.avatar || "",
    }
  } catch {
    return null
  }
}
