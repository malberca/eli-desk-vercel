import "server-only";

import type { BotHmacKey, BotKeyRegistry, BotSecurityEnvironment } from "../../lib/bot-security/security-types";
import { parseRuntimeKeys } from "../bot-security/runtime-key-parser";
import { MCV_PRINCIPAL_ID } from "./mcv-types";

const KEY_CONFIG_ENV = "ELI_N8N_MCV_HMAC_KEYS_JSON";

export class RuntimeMcvKeyRegistry implements BotKeyRegistry {
  async resolve(keyId: string, environment: BotSecurityEnvironment): Promise<BotHmacKey | null> {
    return (
      parseRuntimeKeys(process.env[KEY_CONFIG_ENV], MCV_PRINCIPAL_ID)?.find(
        (candidate) => candidate.keyId === keyId && candidate.environment === environment,
      ) ?? null
    );
  }
}

export function createRuntimeMcvKeyRegistry(): BotKeyRegistry {
  return new RuntimeMcvKeyRegistry();
}
