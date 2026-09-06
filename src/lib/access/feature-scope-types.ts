import type { FeatureId } from "@/features/catalog/feature-catalog";

import type { EffectiveFeatureAccess } from "./feature-access-types";

export type TenantFeatureId = Extract<
  FeatureId,
  | "tickets"
  | "consorcios"
  | "residentes"
  | "documentos"
  | "notificaciones"
  | "reservas"
  | "equipo"
  | "seguridad"
  | "tenant_settings"
  | "tenant_support"
  | "reporting"
  | "contable"
  | "legales"
>;

export type ConsorcioScope = { kind: "all_consorcios" } | { kind: "explicit"; consorcioIds: readonly string[] };

export type MembershipFeatureScope = {
  id: string;
  organizationId: string;
  membershipId: string;
  featureId: TenantFeatureId;
  scopeMode: "all_consorcios" | "explicit_list";
  consorcioIds: readonly string[];
  createdAt: string;
  updatedAt: string;
};

export type ResolveFeatureScopeInput = {
  featureId: TenantFeatureId;
  effectiveAccess: EffectiveFeatureAccess;
  baseScope: ConsorcioScope | null;
  override: Pick<MembershipFeatureScope, "featureId" | "scopeMode" | "consorcioIds"> | null;
};

export type CreateMembershipFeatureScopeInput = {
  organizationId: string;
  membershipId: string;
  featureId: TenantFeatureId;
  scopeMode: MembershipFeatureScope["scopeMode"];
  consorcioIds?: readonly string[];
};
