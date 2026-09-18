export const MCV_API_VERSION = "1";
export const MCV_CLAIM_CAPABILITY = "notifications.ticket_closed.claim";
export const MCV_COMPLETE_CAPABILITY = "notifications.ticket_closed.complete";
export const MCV_CLAIM_DOMAIN = "ELI-N8N-MCV-CLAIM-V1";
export const MCV_COMPLETE_DOMAIN = "ELI-N8N-MCV-COMPLETE-V1";
export const MCV_PRINCIPAL_ID = "n8n-mcv-coordinator-dev";

export type McvClaim = {
  deliveryId: string;
  leaseToken: string;
  leaseExpiresAt: string;
  attempt: number;
  event: {
    event: "ticket.closed";
    recipientEmail: string;
    ticketId: string;
    ticketCode: string;
    description: string | null;
    closedReason: string;
  };
};

export type McvCompletionInput = {
  deliveryId: string;
  leaseToken: string;
  outcome: "accepted" | "sent" | "retryable_failure";
  providerMessageId: string | null;
  errorCode:
    | "claim_payload_invalid"
    | "accept_processing_failed"
    | "eli_response_invalid"
    | "provider_send_failed"
    | null;
};

export type McvCompletionResult = {
  resultOutcome:
    | "completed"
    | "idempotent_success"
    | "completion_conflict"
    | "stale_lease"
    | "lease_expired"
    | "already_sent"
    | "terminal_state"
    | "delivery_not_found"
    | "invalid_completion";
  deliveryId: string;
  deliveryStatus: string | null;
  providerMessageId: string | null;
  nextAttemptAt: string | null;
  attemptCount: number | null;
  errorCode: string | null;
};
