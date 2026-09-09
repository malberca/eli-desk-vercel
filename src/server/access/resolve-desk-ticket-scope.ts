import "server-only";

import { getDeskFeatureAccess } from "./resolve-desk-feature-access";

export type DeskTicketScope = { kind: "all_consorcios" } | { kind: "explicit"; consorcioIds: readonly string[] };

/** Returns only the server-resolved effective Tickets scope for read loaders. */
export async function getResolvedDeskTicketScope(): Promise<DeskTicketScope | null> {
  const access = await getDeskFeatureAccess("tickets");
  if (access?.state !== "resolved" || access.consorcioScope === null) return null;
  return access.consorcioScope;
}

export function isEmptyDeskTicketScope(scope: DeskTicketScope) {
  return scope.kind === "explicit" && scope.consorcioIds.length === 0;
}
