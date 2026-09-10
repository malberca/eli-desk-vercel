import type { BotSecurityEnvironment } from "../../../../../../lib/bot-security/security-types";
import { createApiResponse } from "../../../../../../server/bot-api/api-errors";
import { authorizeBotCapability, dispatchRegisteredCapability } from "../../../../../../server/bot-api/authorization";
import { handleBotApiRequest } from "../../../../../../server/bot-api/request-handler";
import { createServerBotIdentityRepository } from "../../../../../../server/bot-identity/channel-identity-repository";
import { createRuntimeBotKeyRegistry } from "../../../../../../server/bot-security/runtime-key-registry";
import { createSupabaseNonceReplayStore } from "../../../../../../server/bot-security/supabase-nonce-store";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const environment = process.env.ELI_N8N_BOT_ENVIRONMENT;
  if (environment !== "dev" && environment !== "prod") {
    return createApiResponse("internal_error", { code: "runtime_configuration_unavailable", category: "internal" });
  }

  try {
    return await handleBotApiRequest(request, {
      environment: environment as BotSecurityEnvironment,
      keyRegistry: createRuntimeBotKeyRegistry(),
      nonceStore: createSupabaseNonceReplayStore(),
      identityRepository: createServerBotIdentityRepository(),
      authorize: authorizeBotCapability,
      dispatch: dispatchRegisteredCapability,
    });
  } catch {
    return createApiResponse("internal_error", { code: "internal_error", category: "internal" });
  }
}
