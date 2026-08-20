export type PlatformRole = "PLATFORM_OWNER" | "PLATFORM_ADMIN" | "SUPPORT" | "PLATFORM_VIEWER";

export type TenantRole = "TENANT_OWNER" | "ADMIN" | "OPERATOR" | "VIEWER";

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
