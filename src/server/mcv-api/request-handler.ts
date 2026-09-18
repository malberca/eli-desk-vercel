import { type VerifySignedRequestInput, verifySignedRequest } from "../../lib/bot-security/hmac-verifier";
import type {
  AuthenticatedTechnicalPrincipal,
  BotKeyRegistry,
  BotSecurityEnvironment,
  NonceReplayStore,
} from "../../lib/bot-security/security-types";
import { type RawBodyError, readBoundedRawBody } from "../bot-api/raw-body";
import { BotSecurityError } from "../bot-security/security-errors";
import type { McvRepository } from "./mcv-repository";
import {
  MCV_API_VERSION,
  MCV_CLAIM_CAPABILITY,
  MCV_CLAIM_DOMAIN,
  MCV_COMPLETE_CAPABILITY,
  MCV_COMPLETE_DOMAIN,
  MCV_PRINCIPAL_ID,
  type McvCompletionInput,
  type McvCompletionResult,
} from "./mcv-types";

type Verify = (input: VerifySignedRequestInput) => Promise<AuthenticatedTechnicalPrincipal>;
type HandlerKind = "claim" | "complete";

export type McvApiHandlerDependencies = {
  environment: BotSecurityEnvironment;
  keyRegistry: BotKeyRegistry;
  nonceStore: NonceReplayStore;
  repository: McvRepository;
  verify?: Verify;
  readBody?: (request: Request) => Promise<Uint8Array>;
};

function errorResponse(code: string, status: number, retryable = false): Response {
  return Response.json({ outcome: code, error: { code, retryable } }, { status });
}

function bodyError(error: unknown): Response {
  switch ((error as RawBodyError)?.code) {
    case "unsupported_method":
      return errorResponse("unsupported_method", 405);
    case "unsupported_content_type":
      return errorResponse("unsupported_content_type", 415);
    case "payload_too_large":
      return errorResponse("payload_too_large", 413);
    case "request_timeout":
      return errorResponse("request_timeout", 408, true);
    default:
      return errorResponse("invalid_request", 400);
  }
}

function authError(error: unknown): Response {
  if (error instanceof BotSecurityError && error.code === "timestamp_outside_window") {
    return errorResponse("timestamp_rejected", 401);
  }
  if (error instanceof BotSecurityError && error.code === "nonce_replay") {
    return errorResponse("replay_rejected", 409);
  }
  if (error instanceof BotSecurityError && error.code === "nonce_store_unavailable") {
    return errorResponse("dependency_unavailable", 503, true);
  }
  return errorResponse("authentication_failed", 401);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function exactKeys(value: Record<string, unknown>, expected: string[]): boolean {
  const keys = Object.keys(value);
  return keys.length === expected.length && keys.every((key) => expected.includes(key));
}

function validUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

function validateClaim(value: unknown): boolean {
  return (
    isRecord(value) &&
    exactKeys(value, ["apiVersion", "capability"]) &&
    value.apiVersion === MCV_API_VERSION &&
    value.capability === MCV_CLAIM_CAPABILITY
  );
}

function validateCompletion(value: unknown): McvCompletionInput | null {
  if (!isRecord(value) || value.apiVersion !== MCV_API_VERSION || value.capability !== MCV_COMPLETE_CAPABILITY) {
    return null;
  }

  if (
    !validUuid(value.deliveryId) ||
    typeof value.leaseToken !== "string" ||
    !/^[A-Za-z0-9_-]{43}$/.test(value.leaseToken)
  ) {
    return null;
  }

  if (value.outcome === "accepted") {
    if (
      !exactKeys(value, ["apiVersion", "capability", "deliveryId", "leaseToken", "outcome", "providerMessageId"]) ||
      value.providerMessageId !== null
    ) {
      return null;
    }

    return {
      deliveryId: value.deliveryId,
      leaseToken: value.leaseToken,
      outcome: "accepted",
      providerMessageId: null,
      errorCode: null,
    };
  }

  if (value.outcome === "sent") {
    if (
      !exactKeys(value, ["apiVersion", "capability", "deliveryId", "leaseToken", "outcome", "providerMessageId"]) ||
      typeof value.providerMessageId !== "string"
    ) {
      return null;
    }

    const providerMessageId = value.providerMessageId.trim();

    if (providerMessageId.length === 0 || providerMessageId.length > 512) {
      return null;
    }

    return {
      deliveryId: value.deliveryId,
      leaseToken: value.leaseToken,
      outcome: "sent",
      providerMessageId,
      errorCode: null,
    };
  }

  const errors = [
    "claim_payload_invalid",
    "accept_processing_failed",
    "eli_response_invalid",
    "provider_send_failed",
  ];

  if (
    value.outcome !== "retryable_failure" ||
    !exactKeys(value, [
      "apiVersion",
      "capability",
      "deliveryId",
      "leaseToken",
      "outcome",
      "providerMessageId",
      "errorCode",
    ]) ||
    value.providerMessageId !== null ||
    typeof value.errorCode !== "string" ||
    !errors.includes(value.errorCode)
  ) {
    return null;
  }

  return {
    deliveryId: value.deliveryId,
    leaseToken: value.leaseToken,
    outcome: "retryable_failure",
    providerMessageId: null,
    errorCode: value.errorCode as McvCompletionInput["errorCode"],
  };
}

function completionResponse(result: McvCompletionResult): Response {
  switch (result.resultOutcome) {
    case "completed":
    case "idempotent_success":
      return Response.json({
        accepted: true,
        deliveryId: result.deliveryId,
        status: result.deliveryStatus,
        providerMessageId: result.providerMessageId,
        ...(result.deliveryStatus === "failed" ? { nextAttemptAt: result.nextAttemptAt } : {}),
      });
    case "completion_conflict":
    case "stale_lease":
    case "lease_expired":
    case "already_sent":
    case "terminal_state":
      return errorResponse(result.resultOutcome, 409);
    case "delivery_not_found":
      return errorResponse("delivery_not_found", 404);
    case "invalid_completion":
      return errorResponse("schema_rejected", 422);
  }
}

async function handle(request: Request, kind: HandlerKind, dependencies: McvApiHandlerDependencies): Promise<Response> {
  let rawBody: Uint8Array;
  try {
    rawBody = await (dependencies.readBody ?? readBoundedRawBody)(request);
  } catch (error) {
    return bodyError(error);
  }
  const url = new URL(request.url);
  if (url.search || url.hash) return errorResponse("invalid_request", 400);
  const domain = kind === "claim" ? MCV_CLAIM_DOMAIN : MCV_COMPLETE_DOMAIN;
  try {
    const principal = await (dependencies.verify ?? verifySignedRequest)({
      domain,
      method: request.method,
      path: url.pathname,
      rawBody,
      headers: request.headers,
      environment: dependencies.environment,
      keyRegistry: dependencies.keyRegistry,
      nonceStore: dependencies.nonceStore,
    });
    if (
      principal.principalId !== MCV_PRINCIPAL_ID ||
      principal.tenantAuthority !== null ||
      principal.businessAuthority !== false
    ) {
      return errorResponse("authentication_failed", 401);
    }
  } catch (error) {
    return authError(error);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder().decode(rawBody));
  } catch {
    return errorResponse("invalid_request", 400);
  }

  try {
    if (kind === "claim") {
      if (!validateClaim(payload)) return errorResponse("invalid_request", 400);
      const claim = await dependencies.repository.claim();
      return claim ? Response.json({ apiVersion: MCV_API_VERSION, claim }) : new Response(null, { status: 204 });
    }
    const completion = validateCompletion(payload);
    if (!completion) return errorResponse("schema_rejected", 422);
    return completionResponse(await dependencies.repository.complete(completion));
  } catch {
    return errorResponse("dependency_unavailable", 503, true);
  }
}

export function handleMcvClaimRequest(request: Request, dependencies: McvApiHandlerDependencies): Promise<Response> {
  return handle(request, "claim", dependencies);
}

export function handleMcvCompleteRequest(request: Request, dependencies: McvApiHandlerDependencies): Promise<Response> {
  return handle(request, "complete", dependencies);
}
