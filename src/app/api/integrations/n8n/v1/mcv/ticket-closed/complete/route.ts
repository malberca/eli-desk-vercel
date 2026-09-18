import type { BotSecurityEnvironment } from "@/lib/bot-security/security-types";
import { handleMcvCompleteRequest } from "@/server/mcv-api/request-handler";
import { createRuntimeMcvKeyRegistry } from "@/server/mcv-api/runtime-key-registry";
import { createServerMcvRepository } from "@/server/mcv-api/server-mcv-repository";
import { createSupabaseMcvReplayStore } from "@/server/mcv-api/supabase-replay-store";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const environment = process.env.ELI_N8N_MCV_ENVIRONMENT;
  if (environment !== "dev" && environment !== "prod") {
    return Response.json(
      { outcome: "internal_error", error: { code: "runtime_configuration_unavailable", retryable: false } },
      { status: 500 },
    );
  }
  try {
    return await handleMcvCompleteRequest(request, {
      environment: environment as BotSecurityEnvironment,
      keyRegistry: createRuntimeMcvKeyRegistry(),
      nonceStore: createSupabaseMcvReplayStore("ELI-N8N-MCV-COMPLETE-V1"),
      repository: createServerMcvRepository(),
    });
  } catch {
    return Response.json(
      { outcome: "internal_error", error: { code: "internal_error", retryable: false } },
      { status: 500 },
    );
  }
}
