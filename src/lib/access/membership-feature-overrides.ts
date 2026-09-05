"use server";

import { getAuthContext } from "@/lib/auth/get-auth-context";
import { createClient } from "@/lib/supabase/server";

import type {
  CreateMembershipFeatureOverrideInput,
  FeatureOverrideEffect,
  MembershipFeatureOverride,
} from "./feature-access-types";

type MembershipFeatureOverrideRow = {
  id: string;
  organization_id: string;
  membership_id: string;
  feature_id: MembershipFeatureOverride["featureId"];
  effect: FeatureOverrideEffect;
  created_at: string;
  updated_at: string;
};

function toMembershipFeatureOverride(row: MembershipFeatureOverrideRow): MembershipFeatureOverride {
  return {
    id: row.id,
    organizationId: row.organization_id,
    membershipId: row.membership_id,
    featureId: row.feature_id,
    effect: row.effect,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getPlatformOverrideClient() {
  const supabase = await createClient();
  const context = await getAuthContext(supabase);

  if (
    !context.authenticated ||
    context.status !== "resolved" ||
    context.userType !== "platform" ||
    (context.role !== "PLATFORM_OWNER" && context.role !== "PLATFORM_ADMIN")
  ) {
    throw new Error("No autorizado para administrar overrides de módulos.");
  }

  return supabase;
}

export async function readMembershipFeatureOverrides(membershipId: string): Promise<MembershipFeatureOverride[]> {
  const supabase = await getPlatformOverrideClient();
  const { data, error } = await supabase
    .from("membership_feature_overrides")
    .select("id, organization_id, membership_id, feature_id, effect, created_at, updated_at")
    .eq("membership_id", membershipId)
    .order("feature_id");

  if (error) {
    throw new Error(`No se pudieron leer los overrides de módulos: ${error.message}`);
  }

  return ((data as MembershipFeatureOverrideRow[] | null) ?? []).map(toMembershipFeatureOverride);
}

export async function createMembershipFeatureOverride(
  input: CreateMembershipFeatureOverrideInput,
): Promise<MembershipFeatureOverride> {
  const supabase = await getPlatformOverrideClient();
  const { data, error } = await supabase
    .from("membership_feature_overrides")
    .insert({
      organization_id: input.organizationId,
      membership_id: input.membershipId,
      feature_id: input.featureId,
      effect: input.effect,
    })
    .select("id, organization_id, membership_id, feature_id, effect, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(`No se pudo crear el override de módulo: ${error.message}`);
  }

  return toMembershipFeatureOverride(data as MembershipFeatureOverrideRow);
}

export async function updateMembershipFeatureOverrideEffect(
  overrideId: string,
  effect: FeatureOverrideEffect,
): Promise<MembershipFeatureOverride> {
  const supabase = await getPlatformOverrideClient();
  const { data, error } = await supabase
    .from("membership_feature_overrides")
    .update({ effect })
    .eq("id", overrideId)
    .select("id, organization_id, membership_id, feature_id, effect, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(`No se pudo actualizar el override de módulo: ${error.message}`);
  }

  return toMembershipFeatureOverride(data as MembershipFeatureOverrideRow);
}

export async function removeMembershipFeatureOverride(overrideId: string): Promise<void> {
  const supabase = await getPlatformOverrideClient();
  const { error } = await supabase.from("membership_feature_overrides").delete().eq("id", overrideId);

  if (error) {
    throw new Error(`No se pudo eliminar el override de módulo: ${error.message}`);
  }
}
