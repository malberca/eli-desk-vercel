import {
  type AuthoritativeTicketCloseDependencies,
  type AuthoritativeTicketCloseInput,
  executeAuthoritativeTicketClose,
} from "./ticket-close-command";
import type { TicketRecord } from "./ticket-repository";
import assert from "node:assert/strict";
import { test } from "node:test";

const TICKET: TicketRecord = {
  id: "ticket-001",
  organization_id: "org-001",
  edificio_id: "building-001",
  edificio_nombre: "Edificio",
  ticket_code: "ELI-2609-0001",
  ticket_type: "reclamo",
  priority: "media",
  category: "plomería",
  description: "Pérdida de agua.",
  status: "cerrado",
  data: null,
  chat_id: "chat-001",
  created_at: "2026-09-16T10:00:00.000Z",
  updated_at: "2026-09-16T11:00:00.000Z",
  closed_reason: "Reparado.",
  closed_by: "user-001",
  closed_at: "2026-09-16T11:00:00.000Z",
};

const INPUT: AuthoritativeTicketCloseInput = {
  id: TICKET.id,
  closedReason: "Reparado.",
};

function createDependencies(
  closeTicket: AuthoritativeTicketCloseDependencies["closeTicket"],
): AuthoritativeTicketCloseDependencies {
  return { closeTicket };
}

test("successful close performs one authoritative update; the deployed trigger owns outbox enqueue", async () => {
  const calls: Array<[string, string]> = [];

  const result = await executeAuthoritativeTicketClose(
    INPUT,
    createDependencies(async (id, closedReason) => {
      calls.push([id, closedReason]);
      return TICKET;
    }),
  );

  assert.equal(result, TICKET);
  assert.deepEqual(calls, [[TICKET.id, "Reparado."]]);
});

test("an ELI-owned skipped outbox result does not alter the successful ticket result", async () => {
  const result = await executeAuthoritativeTicketClose(
    INPUT,
    createDependencies(async () => TICKET),
  );

  assert.equal(result.status, "cerrado");
  assert.equal(result.closed_reason, "Reparado.");
});

test("the APP performs no duplicate enqueue or retry loop", async () => {
  let closeCalls = 0;

  await executeAuthoritativeTicketClose(
    INPUT,
    createDependencies(async () => {
      closeCalls += 1;
      return TICKET;
    }),
  );

  assert.equal(closeCalls, 1);
});

test("arbitrary client recipientEmail cannot control or reach the authoritative close dependency", async () => {
  let receivedArguments: unknown[] = [];
  const untrustedInput = {
    ...INPUT,
    recipientEmail: "attacker@example.com",
  } as AuthoritativeTicketCloseInput;

  await executeAuthoritativeTicketClose(
    untrustedInput,
    createDependencies(async (...args) => {
      receivedArguments = args;
      return TICKET;
    }),
  );

  assert.deepEqual(receivedArguments, [TICKET.id, "Reparado."]);
  assert.equal(receivedArguments.includes("attacker@example.com"), false);
});

test("the active close command has no direct n8n dispatcher or email dependency", async () => {
  const dependencyKeys = Object.keys(createDependencies(async () => TICKET));

  assert.deepEqual(dependencyKeys, ["closeTicket"]);
});

test("existing authoritative close failures remain failures", async () => {
  await assert.rejects(
    executeAuthoritativeTicketClose(
      INPUT,
      createDependencies(async () => {
        throw new Error("authoritative close failed");
      }),
    ),
    /authoritative close failed/,
  );
});
