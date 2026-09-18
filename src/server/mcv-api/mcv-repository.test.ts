import type { SupabaseClient } from "@supabase/supabase-js";

import { McvRepositoryError, SupabaseMcvRepository } from "./mcv-repository";
import assert from "node:assert/strict";
import { test } from "node:test";

function repository(result: { data: unknown; error: unknown }) {
  const client = {
    async rpc() {
      return result;
    },
  } as unknown as SupabaseClient;
  return new SupabaseMcvRepository(client);
}

test("maps the exact claim RPC row to the frozen event", async () => {
  const value = await repository({
    data: [
      {
        delivery_id: "11111111-1111-4111-8111-111111111111",
        lease_token: "A".repeat(43),
        lease_expires_at: "2026-09-16T12:00:00Z",
        attempt: 1,
        recipient_email: "resident@example.test",
        ticket_id: "22222222-2222-4222-8222-222222222222",
        ticket_code: "ELI-2609-0001",
        description: null,
        closed_reason: "Resolved",
      },
    ],
    error: null,
  }).claim();
  assert.equal(value?.event.event, "ticket.closed");
  assert.equal(value?.event.recipientEmail, "resident@example.test");
});

test("claim returns null only for an empty RPC result", async () => {
  assert.equal(await repository({ data: [], error: null }).claim(), null);
});

test("claim fails closed on ambiguous DB shape", async () => {
  await assert.rejects(
    () => repository({ data: [{ delivery_id: "only-one-field" }], error: null }).claim(),
    McvRepositoryError,
  );
});

test("complete rejects unknown DB outcomes", async () => {
  await assert.rejects(
    () =>
      repository({
        data: [
          {
            result_outcome: "invented",
            delivery_id: "11111111-1111-4111-8111-111111111111",
            delivery_status: null,
            provider_message_id: null,
            next_attempt_at: null,
            attempt_count: null,
            error_code: null,
          },
        ],
        error: null,
      }).complete({
        deliveryId: "11111111-1111-4111-8111-111111111111",
        leaseToken: "A".repeat(43),
        outcome: "accepted",
        providerMessageId: null,
        errorCode: null,
      }),
    McvRepositoryError,
  );
});
