import type { ReactNode } from "react";

import { PlatformShellClient } from "@/app/(main)/platform/_components/platform-shell-client";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/server/server-actions";

export default async function PlatformLayout({ children }: Readonly<{ children: ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email ?? "";
  const fullName = typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
  const name = typeof user?.user_metadata?.name === "string" ? user.user_metadata.name.trim() : "";
  const avatarUrl = typeof user?.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url.trim() : "";
  const picture = typeof user?.user_metadata?.picture === "string" ? user.user_metadata.picture.trim() : "";

  return (
    <PlatformShellClient
      currentUser={{
        name: fullName || name || email,
        email,
        avatar: avatarUrl || picture || "",
      }}
      logoutAction={logoutAction}
    >
      {children}
    </PlatformShellClient>
  );
}
