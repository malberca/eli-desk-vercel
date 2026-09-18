import { parseRuntimeKeys } from "../bot-security/runtime-key-parser";
import { MCV_PRINCIPAL_ID } from "./mcv-types";
import assert from "node:assert/strict";
import { test } from "node:test";

const mcvConfig = JSON.stringify([
  { keyId: "mcv-dev-1", environment: "dev", state: "active", secret: "mcv-test-secret", principalId: MCV_PRINCIPAL_ID },
]);
const botConfig = JSON.stringify([
  { keyId: "bot-dev-1", environment: "dev", state: "active", secret: "bot-test-secret", principalId: "n8n-bot-dev" },
]);

test("resolves only a dedicated MCV principal from dedicated config", () => {
  const key = parseRuntimeKeys(mcvConfig, MCV_PRINCIPAL_ID)?.[0];
  assert.equal(key?.principalId, MCV_PRINCIPAL_ID);
  assert.equal(key?.keyId, "mcv-dev-1");
});

test("BOT key cannot satisfy MCV registry parser", () => {
  assert.equal(parseRuntimeKeys(botConfig, MCV_PRINCIPAL_ID), null);
});

test("MCV key cannot satisfy BOT registry parser", () => {
  assert.equal(parseRuntimeKeys(mcvConfig, "n8n-bot-dev"), null);
});

test("registry parser rejects duplicate or malformed key configuration", () => {
  assert.equal(parseRuntimeKeys("not-json", MCV_PRINCIPAL_ID), null);
  assert.equal(
    parseRuntimeKeys(
      JSON.stringify([
        { keyId: "same", environment: "dev", state: "active", secret: "a", principalId: MCV_PRINCIPAL_ID },
        { keyId: "same", environment: "prod", state: "active", secret: "b", principalId: MCV_PRINCIPAL_ID },
      ]),
      MCV_PRINCIPAL_ID,
    ),
    null,
  );
});
