import "server-only";

import { createClient } from "@supabase/supabase-js";

import { type McvRepository, McvRepositoryError, SupabaseMcvRepository } from "./mcv-repository";

export function createServerMcvRepository(): McvRepository {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secretKey) throw new McvRepositoryError();
  return new SupabaseMcvRepository(createClient(url, secretKey));
}
