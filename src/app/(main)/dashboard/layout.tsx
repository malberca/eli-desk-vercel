import type { ReactNode } from "react";

import { cookies } from "next/headers";

import { DashboardShellClient } from "@/app/(main)/dashboard/_components/dashboard-shell-client";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import { SIDEBAR_COLLAPSIBLE_VALUES, SIDEBAR_VARIANT_VALUES } from "@/lib/preferences/layout";
import { createClient } from "@/lib/supabase/server";
import { resolveDeskFeatureAccess } from "@/server/access/resolve-desk-feature-access";
import { getPreference, logoutAction } from "@/server/server-actions";
import { listTicketEdificios } from "@/server/tickets/ticket-actions";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const [variant, collapsible, authContext, ticketEdificios] = await Promise.all([
    getPreference("sidebar_variant", SIDEBAR_VARIANT_VALUES, "inset"),
    getPreference("sidebar_collapsible", SIDEBAR_COLLAPSIBLE_VALUES, "icon"),
    getAuthContext(supabase),
    listTicketEdificios(),
  ]);
  const deskAccess = (await resolveDeskFeatureAccess()).map(({ featureId, lifecycle, state }) => ({
    featureId,
    lifecycle,
    state,
  }));
  const email = user?.email ?? "";
  const fullName = typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
  const name = typeof user?.user_metadata?.name === "string" ? user.user_metadata.name.trim() : "";
  const avatarUrl = typeof user?.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url.trim() : "";
  const picture = typeof user?.user_metadata?.picture === "string" ? user.user_metadata.picture.trim() : "";
  const currentUser = {
    id: user?.id ?? "",
    name: fullName || name || email,
    email,
    avatar: avatarUrl || picture || "",
  };
  const deploymentVersion = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";

  const ticketRealtimeScope = {
    organizationId:
      authContext.status === "resolved" && authContext.userType === "tenant" ? authContext.organizationId : null,
    consorcioIds: ticketEdificios.success ? ticketEdificios.data.map((edificio) => edificio.id) : [],
  };

  return (
    <DashboardShellClient
      defaultOpen={defaultOpen}
      variant={variant}
      collapsible={collapsible}
      currentUser={currentUser}
      logoutAction={logoutAction}
      deskAccess={deskAccess}
      deploymentVersion={deploymentVersion}
      ticketRealtimeScope={ticketRealtimeScope}
    >
      {children}
    </DashboardShellClient>
  );
}
