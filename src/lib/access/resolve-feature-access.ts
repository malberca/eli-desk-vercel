import type { EffectiveFeatureAccess, ResolveFeatureAccessInput } from "./feature-access-types";

/**
 * Resolves module access from already-trusted lifecycle, availability, preset, and override inputs.
 * It intentionally does not resolve organization/plan availability or role presets.
 */
export function resolveFeatureAccess(input: ResolveFeatureAccessInput): EffectiveFeatureAccess {
  if (input.lifecycle === "coming_soon") {
    return { featureId: input.featureId, allowed: false, reason: "coming_soon" };
  }

  if (input.contextualAvailability === "unavailable") {
    return { featureId: input.featureId, allowed: false, reason: "context_unavailable" };
  }

  if (input.override === "deny") {
    return { featureId: input.featureId, allowed: false, reason: "override_denied" };
  }

  if (input.override === "grant") {
    return { featureId: input.featureId, allowed: true, reason: "override_granted" };
  }

  return { featureId: input.featureId, allowed: input.rolePresetAllowed, reason: "role_preset" };
}
