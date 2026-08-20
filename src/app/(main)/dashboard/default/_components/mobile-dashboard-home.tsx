"use client";

import * as React from "react";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bell,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardList,
  Clock,
  ExternalLink,
  FileText,
  GitMerge,
  MessageSquareText,
  Megaphone,
  MoreVertical,
  Pencil,
  Search,
  SlidersHorizontal,
  Trash2,
  TriangleAlert,
  Users,
} from "lucide-react";

import { DeleteTicketDialog } from "@/app/(main)/dashboard/_components/delete-ticket-dialog";
import { EditTicketDialog } from "@/app/(main)/dashboard/_components/edit-ticket-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDashboardMetrics, useTickets, updateTicket, type TicketRow } from "@/hooks/use-eli-data";
import { cn } from "@/lib/utils";

function formatRelativeTime(value: string) {
  const createdAt = new Date(value).getTime();
  const diffMs = Date.now() - createdAt;
  const minutes = Math.max(1, Math.round(diffMs / (1000 * 60)));

  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;

  const days = Math.round(hours / 24);
  return `Hace ${days} d`;
}

function getTicketIcon(ticket: TicketRow) {
  switch (ticket.ticket_type) {
    case "urgencia":
      return TriangleAlert;
    case "pago":
      return FileText;
    case "consulta":
      return MessageSquareText;
    default:
      return ClipboardList;
  }
}

function SummaryCard({
  title,
  value,
  detail,
  icon: Icon,
  tone,
  loading,
}: {
  title: string;
  value: string | number;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "blue" | "mint" | "amber" | "violet";
  loading: boolean;
}) {
  const toneClasses = {
    blue: "from-blue-50 via-white to-sky-50 border-blue-100/80 text-blue-700",
    mint: "from-emerald-50 via-white to-cyan-50 border-emerald-100/80 text-emerald-700",
    amber: "from-amber-50 via-white to-orange-50 border-amber-100/80 text-amber-700",
    violet: "from-violet-50 via-white to-fuchsia-50 border-violet-100/80 text-violet-700",
  };

  return (
    <div
      className={cn(
        "rounded-[1.75rem] border bg-gradient-to-br p-4 shadow-[0_16px_45px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl",
        toneClasses[tone],
      )}
    >
      <div className="mb-5 inline-flex rounded-2xl bg-white/80 p-3 shadow-sm">
        <Icon className="size-5" />
      </div>
      {loading ? (
        <>
          <div className="h-4 w-24 animate-pulse rounded-full bg-muted/70" />
          <div className="mt-4 h-8 w-20 animate-pulse rounded-full bg-muted/70" />
          <div className="mt-3 h-4 w-28 animate-pulse rounded-full bg-muted/70" />
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-foreground/80">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
        </>
      )}
    </div>
  );
}

function QuickAction({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-28 flex-col items-start justify-between rounded-[1.5rem] border border-white/80 bg-white/80 p-4 shadow-[0_16px_45px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-transform active:scale-[0.98]"
    >
      <span className="rounded-2xl bg-blue-50 p-3 text-blue-700">
        <Icon className="size-5" />
      </span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </Link>
  );
}

function MobileTicketActions({
  ticket,
  onUpdated,
  onEdit,
  onDelete,
}: {
  ticket: TicketRow;
  onUpdated: () => void;
  onEdit: (ticket: TicketRow) => void;
  onDelete: (ticket: TicketRow) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<"root" | "estado" | "prioridad" | "tipo">("root");

  async function handleUpdate(fields: Parameters<typeof updateTicket>[1]) {
    setLoading(true);
    await updateTicket(ticket.id, fields);
    setLoading(false);
    setOpen(false);
    setActiveMenu("root");
    onUpdated();
  }

  const currentMenuTitle =
    activeMenu === "estado" ? "Estado" : activeMenu === "prioridad" ? "Prioridad" : activeMenu === "tipo" ? "Tipo" : null;

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setActiveMenu("root");
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={loading}
          className="flex size-9 items-center justify-center rounded-2xl border border-border/70 bg-background/80 text-slate-500 shadow-sm transition-colors hover:text-slate-900 disabled:opacity-50"
          aria-label="Opciones del ticket"
        >
          <MoreVertical className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-[min(18rem,calc(100vw-2rem))] rounded-3xl p-0 shadow-2xl">
        <DropdownMenuLabel className="px-5 py-4 font-mono text-base text-slate-500">
          {currentMenuTitle ? (
            <button type="button" onClick={() => setActiveMenu("root")} className="flex items-center gap-2 text-slate-500">
              <ChevronLeft className="size-4" />
              <span>{currentMenuTitle}</span>
            </button>
          ) : (
            ticket.ticket_code
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {activeMenu === "root" ? (
          <>
            {[
              { key: "estado", label: "Estado" },
              { key: "prioridad", label: "Prioridad" },
              { key: "tipo", label: "Tipo" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveMenu(item.key as "estado" | "prioridad" | "tipo")}
                className="flex w-full items-center px-5 py-4 text-left text-[1.05rem] transition-colors hover:bg-accent"
              >
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="size-4 opacity-50" />
              </button>
            ))}

            <DropdownMenuSeparator />

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setActiveMenu("root");
                onEdit(ticket);
              }}
              className="flex w-full items-center gap-3 px-5 py-4 text-left text-[1.05rem] transition-colors hover:bg-accent"
            >
              <Pencil className="size-5" />
              Editar
            </button>
            <div className="flex items-center gap-3 px-5 py-4 text-[1.05rem] opacity-40">
              <GitMerge className="size-5" />
              Merge
              <span className="ml-auto text-sm">Soon</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-4 text-[1.05rem] opacity-40">
              <ExternalLink className="size-5" />
              Escalar
              <span className="ml-auto text-sm">Soon</span>
            </div>

            <DropdownMenuSeparator />

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setActiveMenu("root");
                onDelete(ticket);
              }}
              className="flex w-full items-center gap-3 px-5 py-4 text-left text-[1.05rem] text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="size-5" />
              Eliminar
            </button>
          </>
        ) : null}

        {activeMenu === "estado" ? (
          <div className="py-2">
            <button
              type="button"
              onClick={() => handleUpdate({ status: "abierto" })}
              disabled={ticket.status === "abierto" || loading}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-[1.05rem] transition-colors hover:bg-accent disabled:opacity-40"
            >
              <Circle className="size-4 text-amber-400" />
              Abierto
            </button>
            <button
              type="button"
              onClick={() => handleUpdate({ status: "en_proceso" })}
              disabled={ticket.status === "en_proceso" || loading}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-[1.05rem] transition-colors hover:bg-accent disabled:opacity-40"
            >
              <Clock className="size-4 text-blue-500" />
              En proceso
            </button>
            <button
              type="button"
              onClick={() => handleUpdate({ status: "cerrado" })}
              disabled={ticket.status === "cerrado" || loading}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-[1.05rem] transition-colors hover:bg-accent disabled:opacity-40"
            >
              <CheckCircle2 className="size-4 text-emerald-500" />
              Cerrado
            </button>
          </div>
        ) : null}

        {activeMenu === "prioridad" ? (
          <div className="py-2">
            <button
              type="button"
              onClick={() => handleUpdate({ priority: "alta" })}
              disabled={ticket.priority === "alta" || loading}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-[1.05rem] transition-colors hover:bg-accent disabled:opacity-40"
            >
              <ArrowUp className="size-4 text-rose-400" />
              Alta
            </button>
            <button
              type="button"
              onClick={() => handleUpdate({ priority: "media" })}
              disabled={ticket.priority === "media" || loading}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-[1.05rem] transition-colors hover:bg-accent disabled:opacity-40"
            >
              <ArrowRight className="size-4 text-amber-500" />
              Media
            </button>
            <button
              type="button"
              onClick={() => handleUpdate({ priority: "baja" })}
              disabled={ticket.priority === "baja" || loading}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-[1.05rem] transition-colors hover:bg-accent disabled:opacity-40"
            >
              <ArrowDown className="size-4 text-emerald-500" />
              Baja
            </button>
          </div>
        ) : null}

        {activeMenu === "tipo" ? (
          <div className="py-2">
            <button
              type="button"
              onClick={() => handleUpdate({ ticket_type: "reclamo" })}
              disabled={ticket.ticket_type === "reclamo" || loading}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-[1.05rem] transition-colors hover:bg-accent disabled:opacity-40"
            >
              Reclamo
            </button>
            <button
              type="button"
              onClick={() => handleUpdate({ ticket_type: "urgencia" })}
              disabled={ticket.ticket_type === "urgencia" || loading}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-[1.05rem] transition-colors hover:bg-accent disabled:opacity-40"
            >
              <TriangleAlert className="size-4 text-red-500" />
              Urgencia
            </button>
            <button
              type="button"
              onClick={() => handleUpdate({ ticket_type: "consulta" })}
              disabled={ticket.ticket_type === "consulta" || loading}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-[1.05rem] transition-colors hover:bg-accent disabled:opacity-40"
            >
              Consulta
            </button>
            <button
              type="button"
              onClick={() => handleUpdate({ ticket_type: "pago" })}
              disabled={ticket.ticket_type === "pago" || loading}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-[1.05rem] transition-colors hover:bg-accent disabled:opacity-40"
            >
              Pago
            </button>
          </div>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MobileDashboardHome() {
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const { tickets, loading: ticketsLoading, refetch } = useTickets();
  const [editTicket, setEditTicket] = React.useState<TicketRow | null>(null);
  const [deleteTicket, setDeleteTicket] = React.useState<TicketRow | null>(null);

  const recentTickets = tickets.slice(0, 3);

  return (
    <>
      <div className="space-y-6 md:hidden">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/78 p-4 shadow-[0_25px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-x-6 top-0 h-24 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="flex size-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-slate-700 shadow-sm"
              aria-label="Notificaciones"
            >
              <Bell className="size-5" />
            </button>
            <button
              type="button"
              className="flex size-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-slate-700 shadow-sm"
              aria-label="Mensajes"
            >
              <MessageSquareText className="size-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              className="flex h-14 flex-1 items-center gap-3 rounded-full border border-white/80 bg-background/90 px-5 text-left shadow-sm"
              aria-label="Buscar"
            >
              <Search className="size-5 text-slate-500" />
              <span className="text-sm text-muted-foreground">Buscar...</span>
            </button>
            <button
              type="button"
              className="flex size-14 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-slate-700 shadow-sm"
              aria-label="Filtros"
            >
              <SlidersHorizontal className="size-5" />
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Resumen</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tus indicadores principales del día.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              title="Edificios activos"
              value={metrics.edificios}
              detail="bajo monitoreo"
              icon={Building2}
              tone="blue"
              loading={metricsLoading}
            />
            <SummaryCard
              title="Tickets abiertos"
              value={metrics.ticketsPendientes}
              detail="requieren seguimiento"
              icon={ClipboardList}
              tone="mint"
              loading={metricsLoading}
            />
            <SummaryCard
              title="Urgencias activas"
              value={metrics.ticketsUrgentes}
              detail={metrics.ticketsUrgentes > 0 ? "atención inmediata" : "sin incidentes críticos"}
              icon={TriangleAlert}
              tone="amber"
              loading={metricsLoading}
            />
            <SummaryCard
              title="Tiempo medio"
              value={metrics.tiempoPromedioResolucion}
              detail="de resolución"
              icon={CalendarClock}
              tone="violet"
              loading={metricsLoading}
            />
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Accesos rápidos</h2>
            <p className="mt-1 text-sm text-muted-foreground">Atajos a los módulos más usados.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction href="/dashboard/coming-soon" label="Reclamos" icon={MessageSquareText} />
            <QuickAction href="/dashboard/coming-soon" label="Avisos" icon={Megaphone} />
            <QuickAction href="/dashboard/coming-soon" label="Proveedores" icon={Users} />
            <QuickAction href="/dashboard/coming-soon" label="Documentos" icon={FileText} />
          </div>
        </section>

        <section id="actividad-reciente" className="space-y-3 pb-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Actividad reciente</h2>
              <p className="mt-1 text-sm text-muted-foreground">Últimos movimientos en la operación.</p>
            </div>
            <Link href="/dashboard/coming-soon" className="text-sm font-medium text-blue-600">
              Ver todo
            </Link>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/82 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            {ticketsLoading ? (
              <div className="space-y-4 p-4">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="rounded-2xl border border-border/60 p-4">
                    <div className="h-4 w-32 animate-pulse rounded-full bg-muted/70" />
                    <div className="mt-3 h-4 w-48 animate-pulse rounded-full bg-muted/70" />
                    <div className="mt-3 h-4 w-20 animate-pulse rounded-full bg-muted/70" />
                  </div>
                ))}
              </div>
            ) : recentTickets.length === 0 ? (
              <div className="p-5 text-sm text-muted-foreground">Todavía no hay actividad para mostrar.</div>
            ) : (
              recentTickets.map((ticket, index) => {
                const TicketIcon = getTicketIcon(ticket);
                const isClosed = ticket.status === "cerrado";

                return (
                  <div
                    key={ticket.id}
                    className={cn(
                      "flex items-start gap-3 p-4",
                      index !== recentTickets.length - 1 && "border-b border-border/50",
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl p-3",
                        isClosed ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-700",
                      )}
                    >
                      <TicketIcon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p
                                className={cn(
                                  "truncate text-sm",
                                  isClosed ? "font-normal text-slate-400" : "font-semibold text-slate-900",
                                )}
                              >
                                {ticket.ticket_code || "Nuevo ticket"}
                              </p>
                              <p
                                className={cn(
                                  "mt-1 line-clamp-2 text-sm",
                                  isClosed ? "font-normal text-slate-400" : "font-semibold text-slate-700",
                                )}
                              >
                                {ticket.description || "Sin descripción"}
                              </p>
                            </div>
                            <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
                              {formatRelativeTime(ticket.created_at)}
                            </span>
                          </div>
                          <p
                            className={cn(
                              "mt-3 text-xs uppercase tracking-[0.18em]",
                              isClosed ? "font-normal text-slate-400" : "font-medium text-slate-500",
                            )}
                          >
                            {ticket.edificio_nombre || "Sin consorcio asignado"}
                          </p>
                        </div>
                        <MobileTicketActions
                          ticket={ticket}
                          onUpdated={refetch}
                          onEdit={setEditTicket}
                          onDelete={setDeleteTicket}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <EditTicketDialog
        ticket={editTicket}
        open={!!editTicket}
        onOpenChange={(open) => {
          if (!open) setEditTicket(null);
        }}
        onUpdated={refetch}
      />
      <DeleteTicketDialog
        ticket={deleteTicket}
        open={!!deleteTicket}
        onOpenChange={(open) => {
          if (!open) setDeleteTicket(null);
        }}
        onDeleted={refetch}
      />
    </>
  );
}
