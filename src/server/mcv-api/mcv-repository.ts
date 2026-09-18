import type { SupabaseClient } from "@supabase/supabase-js";

import type { McvClaim, McvCompletionInput, McvCompletionResult } from "./mcv-types";

export interface McvRepository {
  claim(): Promise<McvClaim | null>;
  complete(input: McvCompletionInput): Promise<McvCompletionResult>;
}

export class McvRepositoryError extends Error {
  constructor() {
    super("MCV repository operation failed.");
    this.name = "McvRepositoryError";
  }
}

type ClaimRow = {
  delivery_id: unknown;
  lease_token: unknown;
  lease_expires_at: unknown;
  attempt: unknown;
  recipient_email: unknown;
  ticket_id: unknown;
  ticket_code: unknown;
  description: unknown;
  closed_reason: unknown;
};

type CompletionRow = {
  result_outcome: unknown;
  delivery_id: unknown;
  delivery_status: unknown;
  provider_message_id: unknown;
  next_attempt_at: unknown;
  attempt_count: unknown;
  error_code: unknown;
};

const COMPLETION_OUTCOMES = new Set([
  "completed",
  "idempotent_success",
  "completion_conflict",
  "stale_lease",
  "lease_expired",
  "already_sent",
  "terminal_state",
  "delivery_not_found",
  "invalid_completion",
]);

function stringValue(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function nullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

export class SupabaseMcvRepository implements McvRepository {
  constructor(private readonly client: SupabaseClient) {}

  async claim(): Promise<McvClaim | null> {
    const { data, error } = await this.client.rpc("claim_mcv_ticket_closed_notification");
    if (error) throw new McvRepositoryError();
    const row = Array.isArray(data) ? data[0] : data;
    if (row === undefined || row === null) return null;
    if (typeof row !== "object") throw new McvRepositoryError();
    const value = row as ClaimRow;
    if (
      !stringValue(value.delivery_id) ||
      !stringValue(value.lease_token) ||
      !stringValue(value.lease_expires_at) ||
      !Number.isSafeInteger(value.attempt) ||
      (value.attempt as number) < 1 ||
      !stringValue(value.recipient_email) ||
      !stringValue(value.ticket_id) ||
      !stringValue(value.ticket_code) ||
      !nullableString(value.description) ||
      !stringValue(value.closed_reason)
    ) {
      throw new McvRepositoryError();
    }
    return {
      deliveryId: value.delivery_id,
      leaseToken: value.lease_token,
      leaseExpiresAt: value.lease_expires_at,
      attempt: value.attempt as number,
      event: {
        event: "ticket.closed",
        recipientEmail: value.recipient_email,
        ticketId: value.ticket_id,
        ticketCode: value.ticket_code,
        description: value.description,
        closedReason: value.closed_reason,
      },
    };
  }

  async complete(input: McvCompletionInput): Promise<McvCompletionResult> {
    const { data, error } = await this.client.rpc("complete_mcv_ticket_closed_notification", {
      p_delivery_id: input.deliveryId,
      p_lease_token: input.leaseToken,
      p_outcome: input.outcome,
      p_provider_message_id: input.providerMessageId,
      p_error_code: input.errorCode,
    });
    if (error) throw new McvRepositoryError();
    const row = Array.isArray(data) ? data[0] : data;
    if (!row || typeof row !== "object") throw new McvRepositoryError();
    const value = row as CompletionRow;
    if (
      !stringValue(value.result_outcome) ||
      !COMPLETION_OUTCOMES.has(value.result_outcome) ||
      !stringValue(value.delivery_id) ||
      !nullableString(value.delivery_status) ||
      !nullableString(value.provider_message_id) ||
      !nullableString(value.next_attempt_at) ||
      !(value.attempt_count === null || Number.isSafeInteger(value.attempt_count)) ||
      !nullableString(value.error_code)
    ) {
      throw new McvRepositoryError();
    }
    return {
      resultOutcome: value.result_outcome as McvCompletionResult["resultOutcome"],
      deliveryId: value.delivery_id,
      deliveryStatus: value.delivery_status,
      providerMessageId: value.provider_message_id,
      nextAttemptAt: value.next_attempt_at,
      attemptCount: value.attempt_count as number | null,
      errorCode: value.error_code,
    };
  }
}
