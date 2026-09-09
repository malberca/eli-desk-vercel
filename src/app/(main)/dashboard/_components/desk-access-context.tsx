"use client";

import * as React from "react";

import type { FeatureId } from "@/features/catalog/feature-catalog";
import type {
  DeskFeatureAccessPresentation,
  DeskFeatureAccessState,
} from "@/server/access/resolve-desk-feature-access";

const DeskAccessContext = React.createContext<readonly DeskFeatureAccessPresentation[] | null>(null);

export function DeskAccessProvider({
  value,
  children,
}: Readonly<{ value: readonly DeskFeatureAccessPresentation[]; children: React.ReactNode }>) {
  return <DeskAccessContext.Provider value={value}>{children}</DeskAccessContext.Provider>;
}

export function useDeskFeatureAccess(featureId: FeatureId) {
  const views = React.useContext(DeskAccessContext);
  return views?.find((view) => view.featureId === featureId) ?? null;
}

export function useDeskNavigationState(featureId?: FeatureId): DeskFeatureAccessState {
  const views = React.useContext(DeskAccessContext);
  return featureId ? (views?.find((view) => view.featureId === featureId)?.state ?? "error") : "resolved";
}
