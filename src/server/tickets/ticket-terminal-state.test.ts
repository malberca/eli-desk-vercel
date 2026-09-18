import type { SupabaseClient } from "@supabase/supabase-js";

import { closeTicket, updateTicketStatus } from "./ticket-repository";
import { validateStatus } from "./ticket-service";
import assert from "node:assert/strict";
import { test } from "node:test";

type TicketRow = {
  id: string;
  organization_id: string;
  status: "abierto" | "en_proceso" | "cerrado";
  closed_reason: string | null;
  [key: string]: unknown;
};

function ticket(overrides: Partial<TicketRow> = {}): TicketRow {
  return {
    id: "ticket-001",
    organization_id: "org-001",
    edificio_id: "building-001",
    edificios: { nombre: "Edificio" },
    ticket_code: "ELI-2609-0001",
    ticket_type: "reclamo",
    priority: "media",
    category: "plomeria",
    description: "Perdida de agua.",
    status: "abierto",
    data: null,
    chat_id: "chat-001",
    created_at: "2026-09-16T10:00:00.000Z",
    updated_at: "2026-09-16T11:00:00.000Z",
    closed_reason: null,
    closed_by: null,
    closed_at: null,
    ...overrides,
  };
}

function createAtomicTicketClient(initial: TicketRow) {
  let row = { ...initial };
  const filters: Array<{ kind: "eq" | "neq" | "in"; field: string; value: unknown }> = [];
  let update: Partial<TicketRow> = {};

  const query = {
    update(value: Partial<TicketRow>) {
      update = value;
      return query;
    },
    eq(field: string, value: unknown) {
      filters.push({ kind: "eq", field, value });
      return query;
    },
    neq(field: string, value: unknown) {
      filters.push({ kind: "neq", field, value });
      return query;
    },
    in(field: string, value: unknown[]) {
      filters.push({ kind: "in", field, value });
      return query;
    },
    select() {
      return query;
    },
    async single() {
      const matches = filters.every((filter) => {
        const actual = row[filter.field];
        if (filter.kind === "eq") return actual === filter.value;
        if (filter.kind === "neq") return actual !== filter.value;
        return (filter.value as unknown[]).includes(actual);
      });
      if (!matches) {
        return { data: null, error: { code: "PGRST116", message: "No matching ticket transition." } };
      }
      row = { ...row, ...update };
      return { data: { ...row }, error: null };
    },
  };

  const client = {
    from(table: string) {
      assert.equal(table, "tickets");
      return query;
    },
  } as unknown as SupabaseClient;

  return { client, filters, row: () => ({ ...row }) };
}

test("A: dedicated close atomically transitions an open ticket to cerrado", async () => {
  const database = createAtomicTicketClient(ticket());
  const result = await closeTicket(database.client, "org-001", "ticket-001", "Reparado.");

  assert.equal(result.status, "cerrado");
  assert.equal(result.closed_reason, "Reparado.");
  assert.deepEqual(database.filters.find((filter) => filter.kind === "in" && filter.field === "status")?.value, [
    "abierto",
    "en_proceso",
  ]);
});

test("B: dedicated close rejects an already closed ticket", async () => {
  const database = createAtomicTicketClient(ticket({ status: "cerrado", closed_reason: "Original." }));

  await assert.rejects(closeTicket(database.client, "org-001", "ticket-001", "Replacement."));
});

test("C: a rejected second close cannot replace closed_reason", async () => {
  const database = createAtomicTicketClient(ticket({ status: "cerrado", closed_reason: "Original." }));

  await assert.rejects(closeTicket(database.client, "org-001", "ticket-001", "Replacement."));
  assert.equal(database.row().closed_reason, "Original.");
});

test("D: generic status mutation atomically refuses reopening a closed ticket", async () => {
  const database = createAtomicTicketClient(ticket({ status: "cerrado", closed_reason: "Original." }));

  await assert.rejects(updateTicketStatus(database.client, "org-001", "ticket-001", "abierto"));
  assert.equal(database.row().status, "cerrado");
  assert.equal(
    database.filters.some((filter) => filter.kind === "neq" && filter.field === "status" && filter.value === "cerrado"),
    true,
  );
});

test("E: generic status validation rejects entering cerrado", () => {
  assert.throws(() => validateStatus("cerrado"), /no es válido para esta acción/i);
});

test("F: normal non-terminal status transitions remain allowed", async () => {
  const database = createAtomicTicketClient(ticket({ status: "abierto" }));
  const result = await updateTicketStatus(database.client, "org-001", "ticket-001", "en_proceso");

  assert.equal(result.status, "en_proceso");
});

test("G: organization scoping remains part of the atomic transition", async () => {
  const database = createAtomicTicketClient(ticket({ organization_id: "org-002" }));

  await assert.rejects(updateTicketStatus(database.client, "org-001", "ticket-001", "en_proceso"));
  assert.equal(database.row().status, "abierto");
  assert.equal(
    database.filters.some(
      (filter) => filter.kind === "eq" && filter.field === "organization_id" && filter.value === "org-001",
    ),
    true,
  );
});
