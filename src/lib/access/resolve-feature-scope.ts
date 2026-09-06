import type { ConsorcioScope, ResolveFeatureScopeInput } from "./feature-scope-types";

function normalizeScope(scope: ConsorcioScope): ConsorcioScope {
  if (scope.kind === "all_consorcios") {
    return scope;
  }

  return {
    kind: "explicit",
    consorcioIds: [...new Set(scope.consorcioIds)].sort(),
  };
}

/**
 * Applies an optional feature-level restriction to an already-authorized base scope.
 * It never resolves module access or widens the membership's base scope.
 */
export function resolveFeatureScope(input: ResolveFeatureScopeInput): ConsorcioScope | null {
  if (
    input.featureId !== input.effectiveAccess.featureId ||
    (input.override !== null && input.override.featureId !== input.featureId) ||
    !input.effectiveAccess.allowed ||
    input.baseScope === null
  ) {
    return null;
  }

  const baseScope = normalizeScope(input.baseScope);

  if (input.override === null || input.override.scopeMode === "all_consorcios") {
    return baseScope;
  }

  if (baseScope.kind === "all_consorcios") {
    return {
      kind: "explicit",
      consorcioIds: [...new Set(input.override.consorcioIds)].sort(),
    };
  }

  const baseIds = new Set(baseScope.consorcioIds);
  return {
    kind: "explicit",
    consorcioIds: [...new Set(input.override.consorcioIds)].filter((id) => baseIds.has(id)).sort(),
  };
}
