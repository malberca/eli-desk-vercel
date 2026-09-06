import type { SupabaseClient } from "@supabase/supabase-js";

import { randomInt } from "node:crypto";

export const TICKET_STATUSES = ["abierto", "en_proceso", "cerrado"] as const;
export const TICKET_TYPES = ["reclamo", "urgencia", "consulta", "pago"] as const;
export const TICKET_PRIORITIES = ["alta", "media", "baja", "normal"] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];
export type TicketType = (typeof TICKET_TYPES)[number];
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export type TicketRecord = {
  id: string;
  organization_id: string;
  edificio_id: string;
  edificio_nombre: string | null;
  ticket_code: string;
  ticket_type: string;
  priority: string;
  category: string | null;
  description: string | null;
  status: string;
  data: Record<string, unknown> | null;
  chat_id: string;
  created_at: string;
  updated_at: string;
  closed_reason: string | null;
  closed_by: string | null;
  closed_at: string | null;
};

type DbClient = SupabaseClient;
const MAX_TICKET_CODE_ATTEMPTS = 5;

const TICKET_SELECT = `
  id, organization_id, edificio_id, ticket_code, ticket_type, priority,
  category, description, status, data, chat_id, created_at, updated_at,
  closed_reason, closed_by, closed_at,
  edificios!tickets_edificio_org_fkey ( nombre )
`;

function normalizeTicket(row: Record<string, unknown>): TicketRecord {
  const edificio = Array.isArray(row.edificios) ? row.edificios[0] : row.edificios;
  const edificioRow = (edificio ?? {}) as Record<string, unknown>;

  return {
    id: String(row.id),
    organization_id: String(row.organization_id),
    edificio_id: String(row.edificio_id),
    edificio_nombre: typeof edificioRow.nombre === "string" ? edificioRow.nombre : null,
    ticket_code: String(row.ticket_code),
    ticket_type: String(row.ticket_type),
    priority: String(row.priority),
    category: typeof row.category === "string" ? row.category : null,
    description: typeof row.description === "string" ? row.description : null,
    status: String(row.status),
    data: row.data && typeof row.data === "object" ? (row.data as Record<string, unknown>) : null,
    chat_id: String(row.chat_id),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    closed_reason: typeof row.closed_reason === "string" ? row.closed_reason : null,
    closed_by: typeof row.closed_by === "string" ? row.closed_by : null,
    closed_at: typeof row.closed_at === "string" ? row.closed_at : null,
  };
}

type DatabaseError = { code?: string; constraint?: string; details?: string; message: string };

function throwDatabaseError(error: DatabaseError): never {
  throw new Error(error.message);
}

function isTicketCodeConflict(error: DatabaseError) {
  if (error.code !== "23505") return false;
  const context = `${error.constraint ?? ""} ${error.details ?? ""} ${error.message}`.toLowerCase();
  return context.includes("ticket_code");
}

export async function listTickets(supabase: DbClient): Promise<TicketRecord[]> {
  const { data, error } = await supabase
    .from("tickets")
    .select(TICKET_SELECT)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throwDatabaseError(error);
  return ((data ?? []) as Record<string, unknown>[]).map(normalizeTicket);
}

export async function listEdificios(supabase: DbClient) {
  const { data, error } = await supabase.from("edificios").select("id, nombre").order("nombre");
  if (error) throwDatabaseError(error);
  return (data ?? []) as { id: string; nombre: string }[];
}

export async function getDashboardSummary(supabase: DbClient) {
  const [edificios, abiertos, urgencias] = await Promise.all([
    supabase.from("edificios").select("id", { count: "exact", head: true }),
    supabase
      .from("tickets")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null)
      .eq("status", "abierto"),
    supabase
      .from("tickets")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null)
      .eq("status", "abierto")
      .eq("ticket_type", "urgencia"),
  ]);

  if (edificios.error) throwDatabaseError(edificios.error);
  if (abiertos.error) throwDatabaseError(abiertos.error);
  if (urgencias.error) throwDatabaseError(urgencias.error);

  return {
    edificios: edificios.count ?? 0,
    ticketsPendientes: abiertos.count ?? 0,
    ticketsUrgentes: urgencias.count ?? 0,
  };
}

export async function getTicketTrend(supabase: DbClient) {
  const { data, error } = await supabase
    .from("tickets")
    .select("status, created_at, updated_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: true });
  if (error) throwDatabaseError(error);
  return (data ?? []) as { status: string; created_at: string | null; updated_at: string | null }[];
}

async function assertEdificioAccess(supabase: DbClient, organizationId: string, edificioId: string) {
  const { data, error } = await supabase
    .from("edificios")
    .select("id")
    .eq("id", edificioId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (error) throwDatabaseError(error);
  if (!data) throw new Error("El consorcio no pertenece a la organización autorizada.");
}

export type CreateTicketInput = {
  edificio_id: string;
  ticket_type: TicketType;
  priority: TicketPriority;
  category: string | null;
  description: string;
};

export async function createTicket(
  supabase: DbClient,
  organizationId: string,
  createdByUserId: string,
  input: CreateTicketInput,
): Promise<TicketRecord> {
  await assertEdificioAccess(supabase, organizationId, input.edificio_id);
  const now = new Date();
  const prefix = `ELI-${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}`;

  for (let attempt = 0; attempt < MAX_TICKET_CODE_ATTEMPTS; attempt += 1) {
    const ticketCode = `${prefix}-${String(randomInt(0, 10000)).padStart(4, "0")}`;
    const { data, error } = await supabase
      .from("tickets")
      .insert({
        chat_id: "dashboard-manual",
        ticket_code: ticketCode,
        ticket_type: input.ticket_type,
        priority: input.priority,
        category: input.category,
        description: input.description,
        status: "abierto",
        edificio_id: input.edificio_id,
        organization_id: organizationId,
        created_via: "eli_desk",
        created_by_user_id: createdByUserId,
      })
      .select(TICKET_SELECT)
      .single();

    if (!error) return normalizeTicket(data as Record<string, unknown>);
    if (isTicketCodeConflict(error)) continue;
    throwDatabaseError(error);
  }

  throw new Error("No se pudo generar un código de ticket único.");
}

export type UpdateTicketInput = Pick<
  CreateTicketInput,
  "edificio_id" | "ticket_type" | "priority" | "category" | "description"
>;

export async function updateTicket(
  supabase: DbClient,
  organizationId: string,
  id: string,
  input: UpdateTicketInput,
): Promise<TicketRecord> {
  await assertEdificioAccess(supabase, organizationId, input.edificio_id);
  const { data, error } = await supabase
    .from("tickets")
    .update(input)
    .eq("id", id)
    .eq("organization_id", organizationId)
    .select(TICKET_SELECT)
    .single();

  if (error) throwDatabaseError(error);
  return normalizeTicket(data as Record<string, unknown>);
}

export async function updateTicketStatus(
  supabase: DbClient,
  organizationId: string,
  id: string,
  status: Exclude<TicketStatus, "cerrado">,
): Promise<TicketRecord> {
  const { data, error } = await supabase
    .from("tickets")
    .update({ status })
    .eq("id", id)
    .eq("organization_id", organizationId)
    .select(TICKET_SELECT)
    .single();

  if (error) throwDatabaseError(error);
  return normalizeTicket(data as Record<string, unknown>);
}

export async function closeTicket(
  supabase: DbClient,
  organizationId: string,
  id: string,
  closedReason: string,
): Promise<TicketRecord> {
  const { data, error } = await supabase
    .from("tickets")
    .update({
      status: "cerrado",
      closed_reason: closedReason,
    })
    .eq("id", id)
    .eq("organization_id", organizationId)
    .select(TICKET_SELECT)
    .single();

  if (error) throwDatabaseError(error);
  return normalizeTicket(data as Record<string, unknown>);
}
