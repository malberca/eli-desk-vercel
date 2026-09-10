import { RuntimeBotKeyRegistry } from "./runtime-key-registry";
import assert from "node:assert/strict";
import { test } from "node:test";

const original = process.env.ELI_N8N_BOT_HMAC_KEYS_JSON;
const registry = new RuntimeBotKeyRegistry();

function configure(value: unknown) {
  process.env.ELI_N8N_BOT_HMAC_KEYS_JSON = JSON.stringify(value);
}

test.after(() => {
  if (original === undefined) delete process.env.ELI_N8N_BOT_HMAC_KEYS_JSON;
  else process.env.ELI_N8N_BOT_HMAC_KEYS_JSON = original;
});

test("resolves active and retiring keys by key id and environment", async () => {
  configure([
    { keyId: "active", environment: "dev", state: "active", secret: "secret-a", principalId: "n8n-bot-dev" },
    {
      keyId: "retiring",
      environment: "dev",
      state: "retiring",
      secret: "secret-r",
      principalId: "n8n-bot-dev",
      validUntil: 4_000_000_000,
    },
  ]);
  assert.equal((await registry.resolve("active", "dev"))?.state, "active");
  assert.equal((await registry.resolve("retiring", "dev"))?.validUntil, 4_000_000_000);
});

test("rejects unknown keys and environment mismatches", async () => {
  configure([{ keyId: "dev-key", environment: "dev", state: "active", secret: "secret", principalId: "n8n-bot-dev" }]);
  assert.equal(await registry.resolve("unknown", "dev"), null);
  assert.equal(await registry.resolve("dev-key", "prod"), null);
});

test("fails closed for malformed, duplicate, or ambiguous key configuration", async () => {
  configure([
    { keyId: "same", environment: "dev", state: "active", secret: "a", principalId: "n8n-bot-dev", extra: true },
  ]);
  assert.equal(await registry.resolve("same", "dev"), null);
  configure([
    { keyId: "same", environment: "dev", state: "active", secret: "a", principalId: "n8n-bot-dev" },
    { keyId: "same", environment: "prod", state: "active", secret: "b", principalId: "n8n-bot-dev" },
  ]);
  assert.equal(await registry.resolve("same", "dev"), null);
  process.env.ELI_N8N_BOT_HMAC_KEYS_JSON = "not-json";
  assert.equal(await registry.resolve("same", "dev"), null);
});

test("does not accept legacy single-key environment variables", async () => {
  delete process.env.ELI_N8N_BOT_HMAC_KEYS_JSON;
  process.env.ELI_N8N_BOT_HMAC_KEY_ID = "legacy";
  process.env.ELI_N8N_BOT_HMAC_SECRET = "legacy-secret";
  assert.equal(await registry.resolve("legacy", "dev"), null);
  delete process.env.ELI_N8N_BOT_HMAC_KEY_ID;
  delete process.env.ELI_N8N_BOT_HMAC_SECRET;
});
