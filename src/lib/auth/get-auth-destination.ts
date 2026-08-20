import type { AuthContext } from "./types";

export const LOGIN_ROUTE = "/login";
export const TENANT_HOME_ROUTE = "/dashboard/default";
export const PLATFORM_HOME_ROUTE = "/platform";
export const UNRESOLVED_ROUTE = "/auth/unresolved";
export const SELECT_ORGANIZATION_ROUTE = "/auth/select-organization";

export function getAuthDestination(context: AuthContext): string {
  if (!context.authenticated) {
    return LOGIN_ROUTE;
  }

  if (context.status === "organization_selection_required") {
    return SELECT_ORGANIZATION_ROUTE;
  }

  if (context.status === "unresolved") {
    return UNRESOLVED_ROUTE;
  }

  if (context.userType === "platform") {
    return PLATFORM_HOME_ROUTE;
  }

  return TENANT_HOME_ROUTE;
}
