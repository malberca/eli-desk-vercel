import type { SupabaseClient } from "@supabase/supabase-js";

import type { ConsorcioScope } from "@/lib/access/feature-scope-types";

// Domain uses community/unit; the DB still names them edificios/unidades.
export type CommunitySummary = {
  id: string;
  name: string;
  unitCount: number;
  activeTicketCount: number;
};

function countBy(rows: { edificio_id: unknown }[]) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const id = String(row.edificio_id);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

export async function listCommunities(
  supabase: SupabaseClient,
  organizationId: string,
  scope: ConsorcioScope,
): Promise<CommunitySummary[]> {
  if (scope.kind === "explicit" && scope.consorcioIds.length === 0) return [];

  let communitiesQuery = supabase
    .from("edificios")
    .select("id, nombre")
    .eq("organization_id", organizationId)
    .order("nombre");
  let unitsQuery = supabase.from("unidades").select("edificio_id").eq("organization_id", organizationId);
  let ticketsQuery = supabase
    .from("tickets")
    .select("edificio_id")
    .eq("organization_id", organizationId)
    .is("deleted_at", null)
    .in("status", ["abierto", "en_proceso"]);

  if (scope.kind === "explicit") {
    communitiesQuery = communitiesQuery.in("id", scope.consorcioIds);
    unitsQuery = unitsQuery.in("edificio_id", scope.consorcioIds);
    ticketsQuery = ticketsQuery.in("edificio_id", scope.consorcioIds);
  }

  const [communities, units, tickets] = await Promise.all([communitiesQuery, unitsQuery, ticketsQuery]);
  if (communities.error) throw new Error(communities.error.message);
  if (units.error) throw new Error(units.error.message);
  if (tickets.error) throw new Error(tickets.error.message);

  const unitCounts = countBy(units.data ?? []);
  const ticketCounts = countBy(tickets.data ?? []);

  return ((communities.data ?? []) as { id: string; nombre: string }[]).map((row) => ({
    id: row.id,
    name: row.nombre,
    unitCount: unitCounts.get(row.id) ?? 0,
    activeTicketCount: ticketCounts.get(row.id) ?? 0,
  }));
}
