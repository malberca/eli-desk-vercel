import type { FeatureId, FeatureLifecycle } from "@/features/catalog/feature-catalog";

export type ContextualFeatureAvailability = "available" | "unavailable";
export type FeatureOverrideEffect = "grant" | "deny";

export type MembershipFeatureOverride = {
  id: string;
  organizationId: string;
  membershipId: string;
  featureId: FeatureId;
  effect: FeatureOverrideEffect;
  createdAt: string;
  updatedAt: string;
};

export type ResolveFeatureAccessInput = {
  featureId: FeatureId;
  lifecycle: FeatureLifecycle;
  contextualAvailability: ContextualFeatureAvailability;
  rolePresetAllowed: boolean;
  override: FeatureOverrideEffect | null;
};

export type EffectiveFeatureAccess = {
  featureId: FeatureId;
  allowed: boolean;
  reason: "coming_soon" | "context_unavailable" | "override_denied" | "override_granted" | "role_preset";
};

export type CreateMembershipFeatureOverrideInput = Pick<
  MembershipFeatureOverride,
  "organizationId" | "membershipId" | "featureId" | "effect"
>;
