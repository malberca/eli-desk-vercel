export type PlatformRole = "PLATFORM_OWNER" | "PLATFORM_ADMIN" | "SUPPORT" | "PLATFORM_VIEWER";

export type TenantRole = "TENANT_OWNER" | "ADMIN" | "OPERATOR" | "VIEWER";

export type UnresolvedReason =
  | "unknown_internal_user"
  | "platform_suspended"
  | "platform_inactive"
  | "membership_suspended"
  | "membership_inactive"
  | "membership_invited"
  | "organization_suspended"
  | "organization_cancelled"
  | "organization_archived"
  | "invalid_configuration";

export type AuthContext =
  | {
      authenticated: false;
      userId: null;
      email: null;
      userType: null;
      role: null;
      organizationId: null;
      status: "unauthenticated";
    }
  | {
      authenticated: true;
      userId: string;
      email: string | null;
      userType: "platform";
      role: PlatformRole;
      organizationId: null;
      status: "resolved";
    }
  | {
      authenticated: true;
      userId: string;
      email: string | null;
      userType: "tenant";
      role: TenantRole;
      organizationId: string;
      status: "resolved";
    }
  | {
      authenticated: true;
      userId: string;
      email: string | null;
      userType: null;
      role: null;
      organizationId: null;
      status: "unresolved";
      reason: UnresolvedReason;
    }
  | {
      authenticated: true;
      userId: string;
      email: string | null;
      userType: null;
      role: null;
      organizationId: null;
      status: "organization_selection_required";
    };
