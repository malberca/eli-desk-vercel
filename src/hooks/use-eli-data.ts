"use client";

import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────
export interface DashboardMetrics {
  edificios: number;
  ticketsPendientes: number;
  ticketsUrgentes: number;
  tiempoPromedioResolucion: string;
}

export interface TicketRow {
  id: string;
  ticket_code: string;
  ticket_type: string;
  priority: string;
  category: string | null;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string | null;
  edificio_nombre: string | null;
  edificio_id: string | null;
  chat_id: string | null;
  data: Record<string, unknown> | null;
}

export interface ChartDataPoint {
  date: string;
  abiertos: number;
  enProceso: number;
  cerrados: number;
  total: number;
}

export interface Edificio {
  id: string;
  nombre: string;
  direccion: string | null;
  codigo: string | null;
}

// ─── Tag suggestions by ticket type ──────────────────────────────────
export const tagSuggestions: Record<string, string[]> = {
  reclamo: [
    "plomería",
    "electricidad",
    "ascensor",
    "limpieza",
    "ruidos",
    "humedad",
    "filtraciones",
    "pintura",
    "portería",
  ],
  urgencia: ["incendio", "inundación", "gas", "rotura caño", "ascensor trabado", "corte luz", "seguridad"],
  consulta: ["expensas", "reglamento", "mudanza", "mascotas", "estacionamiento", "horarios", "documentación"],
  pago: ["expensas", "extraordinarias", "mora", "recibo", "factura"],
};

// ─── Helper: calculate TPR ───────────────────────────────────────────
function calcularTPR(tickets: { created_at: string }[]): string {
  if (!tickets.length) return "—";

  const now = Date.now();
  const totalHours = tickets.reduce((sum, t) => {
    const created = new Date(t.created_at).getTime();
    return sum + (now - created) / (1000 * 60 * 60);
  }, 0);

  const avgHours = totalHours / tickets.length;

  if (avgHours >= 24) {
    const days = Math.floor(avgHours / 24);
    return `${days} día${days !== 1 ? "s" : ""}`;
  }
  return `${Math.round(avgHours)} hs`;
}

// ─── Helper: generate ticket code ────────────────────────────────────
function generateTicketCode(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `ELI-${yy}${mm}-${rand}`;
}

// ─── Hook: Metrics for Section Cards ─────────────────────────────────
export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    edificios: 0,
    ticketsPendientes: 0,
    ticketsUrgentes: 0,
    tiempoPromedioResolucion: "—",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [edificiosRes, ticketsPendientesRes, ticketsUrgentesRes, ticketsAbiertosRes] = await Promise.all([
        supabase.from("edificios").select("*", { count: "exact", head: true }),
        supabase
          .from("tickets")
          .select("*", { count: "exact", head: true })
          .is("deleted_at", null)
          .eq("status", "abierto"),
        supabase
          .from("tickets")
          .select("*", { count: "exact", head: true })
          .is("deleted_at", null)
          .eq("ticket_type", "urgencia")
          .eq("status", "abierto"),
        supabase.from("tickets").select("created_at").is("deleted_at", null).eq("status", "abierto"),
      ]);

      const tpr = calcularTPR(ticketsAbiertosRes.data ?? []);

      setMetrics({
        edificios: edificiosRes.count ?? 0,
        ticketsPendientes: ticketsPendientesRes.count ?? 0,
        ticketsUrgentes: ticketsUrgentesRes.count ?? 0,
        tiempoPromedioResolucion: tpr,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
}

// ─── Hook: Edificios list (for filter) ───────────────────────────────
export function useEdificios() {
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from("edificios").select("id, nombre, direccion, codigo").order("nombre");
      setEdificios(data ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { edificios, loading };
}

// ─── Hook: Tickets List for DataTable ────────────────────────────────
export function useTickets() {
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from("tickets")
        .select(`
          id, ticket_code, ticket_type, priority, category, 
          description, status, created_at, updated_at,
          edificio_id, chat_id, data,
          edificios ( nombre )
        `)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;

      const mapped: TicketRow[] = (data ?? []).map((t: any) => ({
        id: t.id,
        ticket_code: t.ticket_code,
        ticket_type: t.ticket_type,
        priority: t.priority,
        category: t.category,
        description: t.description,
        status: t.status,
        created_at: t.created_at,
        updated_at: t.updated_at,
        edificio_id: t.edificio_id,
        chat_id: t.chat_id ?? null,
        edificio_nombre: t.edificios?.nombre ?? null,
        data: t.data,
      }));

      setTickets(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, loading, error, refetch: fetchTickets };
}

// ─── Mutation: Update Ticket ─────────────────────────────────────────
export async function updateTicket(
  id: string,
  fields: Partial<{
    status: string;
    priority: string;
    ticket_type: string;
    category: string | null;
    description: string;
    edificio_id: string;
    data: Record<string, unknown>;
    closed_reason: string;
    closed_by: string;
    closed_at: string;
  }>,
): Promise<{ success: boolean; error?: string }> {
  const updateFields: Record<string, unknown> = {
    ...fields,
    updated_at: new Date().toISOString(),
  };

  // If reopening, clear closed fields
  if (fields.status && fields.status !== "cerrado") {
    updateFields.closed_reason = null;
    updateFields.closed_by = null;
    updateFields.closed_at = null;
  }

  const { error } = await supabase.from("tickets").update(updateFields).eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── Mutation: Soft Delete Ticket ────────────────────────────────────
export async function softDeleteTicket(
  id: string,
  reason: string,
  deletedBy = "dashboard-admin",
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("tickets")
    .update({
      deleted_at: new Date().toISOString(),
      deleted_reason: reason,
      deleted_by: deletedBy,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── Mutation: Updated Create Ticket ─────────────────────────────────────────
export async function createTicket(input: {
  edificio_id: string;
  ticket_type: string;
  priority: string;
  description: string;
  tags?: string[];
  created_by?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("tickets").insert({
    chat_id: "dashboard-manual",
    ticket_code: generateTicketCode(),
    ticket_type: input.ticket_type,
    priority: input.priority,
    category: input.tags?.[0] ?? null,
    description: input.description,
    status: "abierto",
    edificio_id: input.edificio_id,
    data: { tags: input.tags ?? [], source: "dashboard" },
    created_by: input.created_by ?? "dashboard",
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── Hook: Chart Data (tickets per day) ──────────────────────────────
export function useChartData() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: tickets, error: dbError } = await supabase
        .from("tickets")
        .select("status, created_at, updated_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

      if (dbError) throw dbError;

      const dateMap = new Map<string, { abiertos: number; enProceso: number; cerrados: number; total: number }>();

      tickets?.forEach((ticket) => {
        const createdDate = ticket.created_at?.split("T")[0];
        if (!createdDate) return;

        if (!dateMap.has(createdDate)) {
          dateMap.set(createdDate, { abiertos: 0, enProceso: 0, cerrados: 0, total: 0 });
        }
        const entry = dateMap.get(createdDate);
        if (!entry) return;
        entry.total += 1;

        if (ticket.status === "abierto") entry.abiertos += 1;
        if (ticket.status === "en_proceso") entry.enProceso += 1;
        if (ticket.status === "cerrado") entry.cerrados += 1;
      });

      const result: ChartDataPoint[] = Array.from(dateMap.entries())
        .map(([date, counts]) => ({ date, ...counts }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setChartData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching chart data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return { chartData, loading, error, refetch: fetchChartData };
}
