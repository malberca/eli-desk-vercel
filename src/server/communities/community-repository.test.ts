import type { SupabaseClient } from "@supabase/supabase-js";

import { getCommunityDetail, listCommunities } from "./community-repository";
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
  edificios: {
    id: COMMUNITY_ID,
    nombre: "Torre A",
    direccion: "Ugarte 2200",
    estado: "activo",
    created_at: "2026-07-15",
  },
  unidades: [{ id: "u1", numero: "1A", piso: "1", tipo: "departamento", estado: "ocupada" }],
  resident_unit_links: [
    { unidad_id: "u1", residente_id: "r1", relationship_type: "inquilino", is_primary: false },
    { unidad_id: "u1", residente_id: "r2", relationship_type: "propietario", is_primary: true },
  ],
  residentes: [
    { id: "r1", nombre_completo: "Ana", telefono: null, email: null },
    { id: "r2", nombre_completo: "Beto", telefono: "11", email: "b@x.com" },
  ],
  tickets: [
    { id: "t1", ticket_code: "ELI-1", unidad_id: "u1", description: "x", status: "abierto", created_at: "2026-09-01" },
    { id: "t2", ticket_code: "ELI-2", unidad_id: null, description: "y", status: "abierto", created_at: "2026-08-01" },
  ],
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
  assert.equal(result?.address, "Ugarte 2200");
  assert.equal(result?.status, "activo");
  assert.equal(result?.createdAt, "2026-07-15");
  assert.deepEqual(
    result?.units[0].residents.map((resident) => [resident.name, resident.isPrimary]),
    [
      ["Beto", true],
      ["Ana", false],
    ],
  );
  assert.equal(result?.activeTickets[0].code, "ELI-1");
});

test("getCommunityDetail muestra el número de unidad de cada ticket, o null si no tiene", async () => {
  const { client } = createFakeClient(FULL_ROWS);

  const result = await getCommunityDetail(client, ORGANIZATION_ID, { kind: "all_consorcios" }, COMMUNITY_ID);

  assert.deepEqual(
    result?.activeTickets.map((ticket) => [ticket.code, ticket.unitNumber]),
    [
      ["ELI-1", "1A"],
      ["ELI-2", null],
    ],
  );
});

test("listCommunities devuelve dirección y estado de cada consorcio", async () => {
  const { client } = createFakeClient({
    edificios: [{ id: COMMUNITY_ID, nombre: "Torre A", direccion: "Ugarte 2200", estado: "activo" }],
    unidades: [{ edificio_id: COMMUNITY_ID }],
    tickets: [],
  });

  const [community] = await listCommunities(client, ORGANIZATION_ID, { kind: "all_consorcios" });

  assert.deepEqual(community, {
    id: COMMUNITY_ID,
    name: "Torre A",
    address: "Ugarte 2200",
    status: "activo",
    unitCount: 1,
    activeTicketCount: 0,
  });
});
