import { createClient } from "@/lib/supabase/server";

import type { AuthContext, PlatformRole, TenantRole } from "./types";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

const PLATFORM_ROLES = ["PLATFORM_OWNER", "PLATFORM_ADMIN", "SUPPORT", "PLATFORM_VIEWER"] as const;

const TENANT_ROLES = ["TENANT_OWNER", "ADMIN", "OPERATOR", "VIEWER"] as const;

type AuthUser = {
  id: string;
  email?: string | null;
};

type PlatformUserRow = {
  user_id: string;
  role: PlatformRole;
  status: string;
};

type MembershipRow = {
  user_id: string;
  organization_id: string;
  role: TenantRole;
  status: string;
};

type AuthIdentity = {
  userId: string;
  email?: string | null;
};

const ACTIVE_STATUS = "active";

function isPlatformRole(role: string): role is PlatformRole {
  return PLATFORM_ROLES.includes(role as PlatformRole);
}

function isTenantRole(role: string): role is TenantRole {
  return TENANT_ROLES.includes(role as TenantRole);
}

function getAuthenticatedBase(user: AuthUser) {
  return {
    authenticated: true as const,
    userId: user.id,
    email: user.email ?? null,
  };
}

function getUnauthenticatedContext(): AuthContext {
  return {
    authenticated: false,
    userId: null,
    email: null,
    userType: null,
    role: null,
    organizationId: null,
    status: "unauthenticated",
  };
}

function getControlledAuthenticatedContext(
  identity: AuthIdentity,
  status: "unresolved" | "organization_selection_required",
): AuthContext {
  return {
    authenticated: true,
    userId: identity.userId,
    email: identity.email ?? null,
    userType: null,
    role: null,
    organizationId: null,
    status,
  };
}

async function getActivePlatformUsers(supabase: SupabaseServerClient, userId: string): Promise<PlatformUserRow[]> {
  const { data, error } = await supabase
    .from("platform_users")
    .select("user_id, role, status")
    .eq("user_id", userId)
    .eq("status", ACTIVE_STATUS)
    .limit(2);

  if (error) {
    throw new Error(`Failed to resolve platform auth context: ${error.message}`);
  }

  return (data ?? []) as PlatformUserRow[];
}

async function getActiveMemberships(supabase: SupabaseServerClient, userId: string): Promise<MembershipRow[]> {
  const { data, error } = await supabase
    .from("memberships")
    .select("user_id, organization_id, role, status")
    .eq("user_id", userId)
    .eq("status", ACTIVE_STATUS)
    .limit(2);

  if (error) {
    throw new Error(`Failed to resolve tenant auth context: ${error.message}`);
  }

  return (data ?? []) as MembershipRow[];
}

export async function getAuthContext(client?: SupabaseServerClient): Promise<AuthContext> {
  const supabase = client ?? (await createClient());
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return getUnauthenticatedContext();
  }

  return getAuthContextForIdentity(supabase, {
    userId: user.id,
    email: user.email ?? null,
  });
}

export async function getAuthContextForIdentity(
  supabase: SupabaseServerClient,
  identity: AuthIdentity,
): Promise<AuthContext> {
  const base = getAuthenticatedBase({
    id: identity.userId,
    email: identity.email ?? null,
  });
  const platformUsers = await getActivePlatformUsers(supabase, identity.userId);

  if (platformUsers.length === 1) {
    if (!isPlatformRole(platformUsers[0].role)) {
      return getControlledAuthenticatedContext(identity, "unresolved");
    }

    return {
      ...base,
      userType: "platform",
      role: platformUsers[0].role,
      organizationId: null,
      status: "resolved",
    };
  }

  if (platformUsers.length > 1) {
    return getControlledAuthenticatedContext(identity, "unresolved");
  }

  const memberships = await getActiveMemberships(supabase, identity.userId);

  if (memberships.length === 0) {
    return getControlledAuthenticatedContext(identity, "unresolved");
  }

  if (memberships.length === 1) {
    if (!isTenantRole(memberships[0].role)) {
      return getControlledAuthenticatedContext(identity, "unresolved");
    }

    return {
      ...base,
      userType: "tenant",
      role: memberships[0].role,
      organizationId: memberships[0].organization_id,
      status: "resolved",
    };
  }

  return getControlledAuthenticatedContext(identity, "organization_selection_required");
}
