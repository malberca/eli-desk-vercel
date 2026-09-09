import { BotSecurityError } from "../../server/bot-security/security-errors";
import type { HeaderSource, SignedHeaders } from "./security-types";

const HEADER_NAMES = [
  "X-ELI-Key-Id",
  "X-ELI-Timestamp",
  "X-ELI-Nonce",
  "X-ELI-Request-Id",
  "X-ELI-Body-SHA256",
  "X-ELI-Signature",
] as const;

const KEY_ID_PATTERN = /^[A-Za-z0-9._~-]{1,128}$/;
const TIMESTAMP_PATTERN = /^[0-9]{1,12}$/;
const NONCE_PATTERN = /^[A-Za-z0-9_-]{22,512}$/;
const REQUEST_ID_PATTERN = /^[A-Za-z0-9._~:-]{1,200}$/;
const BODY_HASH_PATTERN = /^[a-f0-9]{64}$/;
const SIGNATURE_PATTERN = /^v1=[A-Za-z0-9_-]{43}$/;

function getHeaderValues(source: HeaderSource, name: string): readonly string[] {
  const values = source.getAll?.(name);
  if (values) {
    return values;
  }

  const value = source.get(name);
  return value === null ? [] : [value];
}

function requireSingleHeader(source: HeaderSource, name: (typeof HEADER_NAMES)[number]): string {
  const values = getHeaderValues(source, name);

  if (values.length === 0) {
    throw new BotSecurityError("missing_header");
  }

  if (values.length !== 1) {
    throw new BotSecurityError("duplicate_header");
  }

  const rawValue = values[0];
  const value = rawValue?.trim();
  if (!value || rawValue !== value) {
    throw new BotSecurityError("invalid_header");
  }

  return value;
}

export function parseSignedHeaders(source: HeaderSource): SignedHeaders {
  const keyId = requireSingleHeader(source, "X-ELI-Key-Id");
  const timestampValue = requireSingleHeader(source, "X-ELI-Timestamp");
  const nonce = requireSingleHeader(source, "X-ELI-Nonce");
  const requestId = requireSingleHeader(source, "X-ELI-Request-Id");
  const bodySha256 = requireSingleHeader(source, "X-ELI-Body-SHA256");
  const signature = requireSingleHeader(source, "X-ELI-Signature");

  if (!KEY_ID_PATTERN.test(keyId)) {
    throw new BotSecurityError("invalid_header");
  }

  if (!TIMESTAMP_PATTERN.test(timestampValue)) {
    throw new BotSecurityError("invalid_timestamp");
  }

  if (!NONCE_PATTERN.test(nonce)) {
    throw new BotSecurityError("invalid_header");
  }

  if (!REQUEST_ID_PATTERN.test(requestId)) {
    throw new BotSecurityError("invalid_header");
  }

  if (!BODY_HASH_PATTERN.test(bodySha256)) {
    throw new BotSecurityError("invalid_body_hash");
  }

  if (!SIGNATURE_PATTERN.test(signature)) {
    throw new BotSecurityError("invalid_signature");
  }

  const timestamp = Number(timestampValue);
  if (!Number.isSafeInteger(timestamp)) {
    throw new BotSecurityError("invalid_timestamp");
  }

  return {
    keyId,
    timestamp,
    nonce,
    requestId,
    bodySha256,
    signature,
  };
}
