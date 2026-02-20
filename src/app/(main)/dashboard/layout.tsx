import type { ReactNode } from "react";

import { cookies } from "next/headers";

import { DashboardShellClient } from "@/app/(main)/dashboard/_components/dashboard-shell-client";
import { SIDEBAR_COLLAPSIBLE_VALUES, SIDEBAR_VARIANT_VALUES } from "@/lib/preferences/layout";
import { getPreference, logoutAction } from "@/server/server-actions";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const [variant, collapsible] = await Promise.all([
    getPreference("sidebar_variant", SIDEBAR_VARIANT_VALUES, "inset"),
    getPreference("sidebar_collapsible", SIDEBAR_COLLAPSIBLE_VALUES, "icon"),
  ]);

  return (
    <DashboardShellClient
      defaultOpen={defaultOpen}
      variant={variant}
      collapsible={collapsible}
      logoutAction={logoutAction}
    >
      {children}
    </DashboardShellClient>
  );
}
