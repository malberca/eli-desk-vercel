import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { NonceReplayStore, NonceReservation, NonceReservationResult } from "../../lib/bot-security/security-types";

export type McvHmacDomain = "ELI-N8N-MCV-CLAIM-V1" | "ELI-N8N-MCV-COMPLETE-V1";

export class SupabaseMcvReplayStore implements NonceReplayStore {
  constructor(private readonly domain: McvHmacDomain) {}

  async reserve(input: NonceReservation): Promise<NonceReservationResult> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !secretKey) throw new Error("MCV replay runtime configuration is unavailable.");
    const client = createClient(url, secretKey);
    const { data, error } = await client.rpc("reserve_n8n_mcv_hmac_request", {
      p_environment: input.environment,
      p_key_id: input.keyId,
      p_domain: this.domain,
      p_nonce: input.nonce,
      p_request_id: input.requestId,
    });
    if (error || typeof data !== "boolean") throw new Error("MCV replay reservation failed.");
    return data ? "reserved" : "replay";
  }
}

export function createSupabaseMcvReplayStore(domain: McvHmacDomain): NonceReplayStore {
  return new SupabaseMcvReplayStore(domain);
}
