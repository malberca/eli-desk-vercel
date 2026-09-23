import type { SupabaseClient } from "@supabase/supabase-js";

import { getCommunityDetail } from "./community-repository";
import assert from "node:assert/strict";
import { test } from "node:test";

const ORGANIZATION_ID = "org-1";
const COMMUNITY_ID = "edificio-a";

type RecordedCall = { table: string; method: string; args: unknown[] };

/** Cliente falso: devuelve filas por tabla y registra los filtros encadenados. */
function createFakeClient(rows: Record<string, unknown>) {
  const calls: RecordedCall[] = [];

  const client = {
    from(table: string) {
      calls.push({ table, method: "from", args: [] });
      const builder = Object.assign(Promise.resolve({ data: rows[table] ?? [], error: null }), {
        maybeSingle: () => Promise.resolve({ data: rows[table] ?? null, error: null }),
      }) as unknown as Record<string, unknown>;
      for (const method of ["select", "eq", "in", "is", "order"]) {
        builder[method] = (...args: unknown[]) => {
          calls.push({ table, method, args });
          return builder;
        };
      }
      return builder;
    },
  };

  return { client: client as unknown as SupabaseClient, calls };
}

const FULL_ROWS = {
  edificios: { id: COMMUNITY_ID, nombre: "Torre A" },
  unidades: [{ id: "u1", numero: "1A", piso: "1", tipo: "departamento", estado: "ocupada" }],
  resident_unit_links: [
    { unidad_id: "u1", residente_id: "r1", relationship_type: "inquilino", is_primary: false },
    { unidad_id: "u1", residente_id: "r2", relationship_type: "propietario", is_primary: true },
  ],
  residentes: [
    { id: "r1", nombre_completo: "Ana", telefono: null, email: null },
    { id: "r2", nombre_completo: "Beto", telefono: "11", email: "b@x.com" },
  ],
  tickets: [{ id: "t1", ticket_code: "ELI-1", description: "x", status: "abierto", created_at: "2026-09-01" }],
};

test("getCommunityDetail no consulta si el consorcio no está en el scope explicit", async () => {
  const { client, calls } = createFakeClient(FULL_ROWS);

  const result = await getCommunityDetail(
    client,
    ORGANIZATION_ID,
    { kind: "explicit", consorcioIds: ["otro"] },
    COMMUNITY_ID,
  );

  assert.equal(result, null);
  assert.equal(calls.length, 0);
});

test("getCommunityDetail devuelve null si el consorcio no existe en la organización", async () => {
  const { client } = createFakeClient({ ...FULL_ROWS, edificios: null });

  const result = await getCommunityDetail(client, ORGANIZATION_ID, { kind: "all_consorcios" }, COMMUNITY_ID);

  assert.equal(result, null);
});

test("getCommunityDetail filtra todas las tablas por organization_id", async () => {
  const { client, calls } = createFakeClient(FULL_ROWS);

  await getCommunityDetail(client, ORGANIZATION_ID, { kind: "all_consorcios" }, COMMUNITY_ID);

  for (const table of ["edificios", "unidades", "tickets", "resident_unit_links", "residentes"]) {
    const orgFilter = calls.find(
      (call) => call.table === table && call.method === "eq" && call.args[0] === "organization_id",
    );
    assert.deepEqual(orgFilter?.args, ["organization_id", ORGANIZATION_ID], table);
  }
});

test("getCommunityDetail arma unidades con residentes, principal primero", async () => {
  const { client } = createFakeClient(FULL_ROWS);

  const result = await getCommunityDetail(client, ORGANIZATION_ID, { kind: "all_consorcios" }, COMMUNITY_ID);

  assert.equal(result?.name, "Torre A");
  assert.deepEqual(
    result?.units[0].residents.map((resident) => [resident.name, resident.isPrimary]),
    [
      ["Beto", true],
      ["Ana", false],
    ],
  );
  assert.equal(result?.activeTickets[0].code, "ELI-1");
});
