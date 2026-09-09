import type {
  BotSecurityEnvironment,
  NonceReplayStore,
  NonceReservation,
  NonceReservationResult,
} from "../../lib/bot-security/security-types";

export const NONCE_RETENTION_SECONDS = 10 * 60;

export type ReserveNonceInput = {
  environment: BotSecurityEnvironment;
  keyId: string;
  nonce: string;
  requestId: string;
  now: number;
};

export interface DurableNonceStore {
  reserveNonce(input: NonceReservation): Promise<NonceReservationResult>;
}

export class ServerNonceReplayStore implements NonceReplayStore {
  private readonly store: DurableNonceStore;

  constructor(store: DurableNonceStore) {
    this.store = store;
  }

  reserve(input: NonceReservation): Promise<NonceReservationResult> {
    return this.store.reserveNonce(input);
  }
}

export function createNonceReservation(input: ReserveNonceInput): NonceReservation {
  return {
    environment: input.environment,
    keyId: input.keyId,
    nonce: input.nonce,
    requestId: input.requestId,
    reservedAt: input.now,
    retentionSeconds: NONCE_RETENTION_SECONDS,
  };
}
