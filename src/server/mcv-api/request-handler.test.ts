import type { VerifySignedRequestInput } from "../../lib/bot-security/hmac-verifier";
import type {
  AuthenticatedTechnicalPrincipal,
  BotKeyRegistry,
  NonceReplayStore,
} from "../../lib/bot-security/security-types";
import { BotSecurityError } from "../bot-security/security-errors";
import type { McvRepository } from "./mcv-repository";
import type { McvCompletionResult } from "./mcv-types";
import { handleMcvClaimRequest, handleMcvCompleteRequest, type McvApiHandlerDependencies } from "./request-handler";
import assert from "node:assert/strict";
import { test } from "node:test";

const DELIVERY_ID = "11111111-1111-4111-8111-111111111111";
const TICKET_ID = "22222222-2222-4222-8222-222222222222";
const LEASE_TOKEN = "A".repeat(43);
const principal: AuthenticatedTechnicalPrincipal = {
  kind: "technical_integration",
  name: "integration:n8n",
  principalId: "n8n-mcv-coordinator-dev",
  environment: "dev",
  requestId: "request-1",
  keyId: "mcv-key-1",
  tenantAuthority: null,
  businessAuthority: false,
};

const claim = {
  deliveryId: DELIVERY_ID,
  leaseToken: LEASE_TOKEN,
  leaseExpiresAt: "2026-09-16T12:00:00Z",
  attempt: 1,
  event: {
    event: "ticket.closed" as const,
    recipientEmail: "resident@example.test",
    ticketId: TICKET_ID,
    ticketCode: "ELI-2609-0001",
    description: null,
    closedReason: "Resolved",
  },
};

class FakeRepository implements McvRepository {
  claimResult = claim as typeof claim | null;
  claimCalls = 0;
  completeCalls = 0;
  completionResult: McvCompletionResult = {
    resultOutcome: "completed",
    deliveryId: DELIVERY_ID,
    deliveryStatus: "accepted",
    providerMessageId: null,
    nextAttemptAt: null,
    attemptCount: 1,
    errorCode: null,
  };

  async claim() {
    this.claimCalls += 1;
    return this.claimResult;
  }

  async complete() {
    this.completeCalls += 1;
    return this.completionResult;
  }
}

function request(kind: "claim" | "complete", body: unknown): Request {
  return new Request(`https://eli.test/api/integrations/n8n/v1/mcv/ticket-closed/${kind}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function claimBody(extra: Record<string, unknown> = {}) {
  return { apiVersion: "1", capability: "notifications.ticket_closed.claim", ...extra };
}

function completeBody(extra: Record<string, unknown> = {}) {
  return {
    apiVersion: "1",
    capability: "notifications.ticket_closed.complete",
    deliveryId: DELIVERY_ID,
    leaseToken: LEASE_TOKEN,
    outcome: "accepted",
    providerMessageId: null,
    ...extra,
  };
}

function dependencies(
  repository = new FakeRepository(),
  verify: (input: VerifySignedRequestInput) => Promise<AuthenticatedTechnicalPrincipal> = async () => principal,
): McvApiHandlerDependencies {
  return {
    environment: "dev",
    keyRegistry: {} as BotKeyRegistry,
    nonceStore: {} as NonceReplayStore,
    repository,
    verify,
  };
}

test("claim returns one authoritative DB work item", async () => {
  const response = await handleMcvClaimRequest(request("claim", claimBody()), dependencies());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { apiVersion: "1", claim });
});

test("claim returns explicit empty 204 when no work exists", async () => {
  const repository = new FakeRepository();
  repository.claimResult = null;
  const response = await handleMcvClaimRequest(request("claim", claimBody()), dependencies(repository));
  assert.equal(response.status, 204);
  assert.equal(await response.text(), "");
});

for (const [name, code, status] of [
  ["invalid HMAC", "invalid_signature", 401],
  ["stale timestamp", "timestamp_outside_window", 401],
  ["transport replay", "nonce_replay", 409],
] as const) {
  test(`claim rejects ${name} before repository access`, async () => {
    const repository = new FakeRepository();
    const response = await handleMcvClaimRequest(
      request("claim", claimBody()),
      dependencies(repository, async () => {
        throw new BotSecurityError(code);
      }),
    );
    assert.equal(response.status, status);
    assert.equal(repository.claimCalls, 0);
  });
}

test("claim authenticates only the non-authoritative MCV principal", async () => {
  let observed: VerifySignedRequestInput | undefined;
  const response = await handleMcvClaimRequest(
    request("claim", claimBody()),
    dependencies(new FakeRepository(), async (input) => {
      observed = input;
      return principal;
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(observed?.domain, "ELI-N8N-MCV-CLAIM-V1");
  assert.equal(principal.tenantAuthority, null);
  assert.equal(principal.businessAuthority, false);
});

test("claim rejects organization and recipient injection", async () => {
  for (const field of ["organizationId", "recipientEmail"]) {
    const repository = new FakeRepository();
    const response = await handleMcvClaimRequest(
      request("claim", claimBody({ [field]: "attacker" })),
      dependencies(repository),
    );
    assert.equal(response.status, 400);
    assert.equal(repository.claimCalls, 0);
  }
});

test("claim rejects malformed authenticated JSON", async () => {
  const repository = new FakeRepository();
  const response = await handleMcvClaimRequest(request("claim", "{"), dependencies(repository));
  assert.equal(response.status, 400);
  assert.equal(repository.claimCalls, 0);
});

test("complete accepts a current lease", async () => {
  const response = await handleMcvCompleteRequest(request("complete", completeBody()), dependencies());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    accepted: true,
    deliveryId: DELIVERY_ID,
    status: "accepted",
    providerMessageId: null,
  });
});

test("complete accepts sent with provider message id", async () => {
  const repository = new FakeRepository();
  repository.completionResult = {
    ...repository.completionResult,
    deliveryStatus: "sent",
    providerMessageId: "provider-message-123",
  };

  const response = await handleMcvCompleteRequest(
    request("complete", completeBody({
      outcome: "sent",
      providerMessageId: "provider-message-123",
    })),
    dependencies(repository),
  );

  assert.equal(response.status, 200);
  assert.equal(repository.completeCalls, 1);
  assert.deepEqual(await response.json(), {
    accepted: true,
    deliveryId: DELIVERY_ID,
    status: "sent",
    providerMessageId: "provider-message-123",
  });
});

test("complete rejects sent without provider message id", async () => {
  const repository = new FakeRepository();

  const response = await handleMcvCompleteRequest(
    request("complete", completeBody({
      outcome: "sent",
      providerMessageId: null,
    })),
    dependencies(repository),
  );

  assert.equal(response.status, 422);
  assert.equal(repository.completeCalls, 0);
});

test("complete rejects accepted with provider message id", async () => {
  const repository = new FakeRepository();

  const response = await handleMcvCompleteRequest(
    request("complete", completeBody({
      providerMessageId: "provider-message-123",
    })),
    dependencies(repository),
  );

  assert.equal(response.status, 422);
  assert.equal(repository.completeCalls, 0);
});

test("complete accepts provider_send_failed as retryable failure", async () => {
  const repository = new FakeRepository();

  const response = await handleMcvCompleteRequest(
    request("complete", completeBody({
      outcome: "retryable_failure",
      providerMessageId: null,
      errorCode: "provider_send_failed",
    })),
    dependencies(repository),
  );

  assert.equal(response.status, 200);
  assert.equal(repository.completeCalls, 1);
});

for (const [outcome, status] of [
  ["idempotent_success", 200],
  ["completion_conflict", 409],
  ["stale_lease", 409],
] as const) {
  test(`complete maps ${outcome} deterministically`, async () => {
    const repository = new FakeRepository();
    repository.completionResult = { ...repository.completionResult, resultOutcome: outcome };
    const response = await handleMcvCompleteRequest(request("complete", completeBody()), dependencies(repository));
    assert.equal(response.status, status);
  });
}

test("complete rejects malformed authenticated body", async () => {
  const repository = new FakeRepository();
  const response = await handleMcvCompleteRequest(
    request("complete", completeBody({ organizationId: "attacker" })),
    dependencies(repository),
  );
  assert.equal(response.status, 422);
  assert.equal(repository.completeCalls, 0);
});

for (const [name, code, status] of [
  ["invalid HMAC", "invalid_signature", 401],
  ["stale timestamp", "timestamp_outside_window", 401],
  ["transport replay", "nonce_replay", 409],
] as const) {
  test(`complete rejects ${name} before repository access`, async () => {
    const repository = new FakeRepository();
    const response = await handleMcvCompleteRequest(
      request("complete", completeBody()),
      dependencies(repository, async () => {
        throw new BotSecurityError(code);
      }),
    );
    assert.equal(response.status, status);
    assert.equal(repository.completeCalls, 0);
  });
}

test("claim and complete select distinct trusted domains", async () => {
  const domains: string[] = [];
  const verify = async (input: VerifySignedRequestInput) => {
    domains.push(input.domain);
    return principal;
  };
  await handleMcvClaimRequest(request("claim", claimBody()), dependencies(new FakeRepository(), verify));
  await handleMcvCompleteRequest(request("complete", completeBody()), dependencies(new FakeRepository(), verify));
  assert.deepEqual(domains, ["ELI-N8N-MCV-CLAIM-V1", "ELI-N8N-MCV-COMPLETE-V1"]);
});

test("BOT principal cannot authorize MCV", async () => {
  const repository = new FakeRepository();
  const response = await handleMcvClaimRequest(
    request("claim", claimBody()),
    dependencies(repository, async () => ({ ...principal, principalId: "n8n-bot-dev" })),
  );
  assert.equal(response.status, 401);
  assert.equal(repository.claimCalls, 0);
});

test("MCV response never exposes service-role material", async () => {
  const response = await handleMcvClaimRequest(request("claim", claimBody()), dependencies());
  const text = await response.text();
  assert.doesNotMatch(text, /service.role|SUPABASE_SERVICE_ROLE_KEY/i);
});
