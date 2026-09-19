"use client";

import * as React from "react";

import { Building2, ClipboardList, Clock3, FileText, MessageSquareText, TriangleAlert } from "lucide-react";

import { AccountActions } from "@/app/(main)/dashboard/_components/account-actions";
import { useDashboardUser } from "@/app/(main)/dashboard/_components/dashboard-shell-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type TicketRow, useDashboardMetrics, useTickets } from "@/hooks/use-eli-data";
import { cn } from "@/lib/utils";

import { ChartAreaInteractive } from "./chart-area-interactive";

function formatRelativeTime(value: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return `Hace ${Math.round(hours / 24)} d`;
}

function getTicketIcon(ticket: TicketRow) {
  return ticket.ticket_type === "urgencia"
    ? TriangleAlert
    : ticket.ticket_type === "pago"
      ? FileText
      : ticket.ticket_type === "consulta"
        ? MessageSquareText
        : ClipboardList;
}

function MobileGreetingMenu() {
  const { currentUser, logoutAction } = useDashboardUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="dashboard-greeting w-full text-left" aria-label="Abrir menú de usuario">
          <span className="block text-[clamp(3.75rem,13vw,7rem)] text-slate-900 leading-[0.88] tracking-[-0.06em]">
            <span className="font-light">Hola </span>
            <span className="font-bold">{currentUser.name}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-52 rounded-2xl p-1">
        <AccountActions
          includeSettings
          logoutAction={logoutAction}
          renderAction={(action) => {
            const Icon = action.icon;
            const item = (
              <DropdownMenuItem key={action.id} disabled={action.disabled} onSelect={() => void action.onSelect?.()}>
                <Icon />
                {action.label}
                {action.disabled && <span className="ml-auto text-muted-foreground text-xs">No disponible</span>}
              </DropdownMenuItem>
            );
            return action.id === "logout" ? (
              <React.Fragment key={action.id}>
                <DropdownMenuSeparator />
                {item}
              </React.Fragment>
            ) : (
              item
            );
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SummaryCard({
  title,
  value,
  detail,
  icon: Icon,
  loading,
}: {
  title: string;
  value: string | number;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  loading: boolean;
}) {
  return (
    <div className="rounded-[1.75rem] border border-blue-100/80 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4 shadow-[0_16px_45px_-30px_rgba(15,23,42,0.35)]">
      <div className="mb-5 inline-flex rounded-2xl bg-white/80 p-3 text-blue-700 shadow-sm">
        <Icon className="size-5" />
      </div>
      {loading ? (
        <div className="h-8 w-20 animate-pulse rounded-full bg-muted/70" />
      ) : (
        <>
          <p className="font-medium text-slate-700 text-sm">{title}</p>
          <p className="mt-3 font-semibold text-3xl text-slate-950 tracking-tight">{value}</p>
          <p className="mt-2 text-slate-500 text-sm">{detail}</p>
        </>
      )}
    </div>
  );
}

export function MobileDashboardHome() {
  const { metrics, loading: metricsLoading, error: metricsError } = useDashboardMetrics();
  const { tickets, loading: ticketsLoading, error: ticketsError } = useTickets();
  const recentTickets = tickets.slice(0, 3);

  return (
    <div className="space-y-6 md:hidden">
      <section className="relative flex min-h-[230px] items-center overflow-hidden rounded-[2rem] border border-white/70 bg-white/78 px-7 py-10 shadow-[0_25px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur-2xl">
        <MobileGreetingMenu />
      </section>
      <section className="space-y-3">
        <div>
          <h2 className="font-semibold text-2xl text-slate-900 tracking-tight">Resumen</h2>
          <p className="mt-1 text-muted-foreground text-sm">Tus indicadores principales del día.</p>
        </div>
        {metricsError ? (
          <p className="text-destructive text-sm">No se pudieron cargar los indicadores: {metricsError}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              title="Edificios activos"
              value={metrics.edificios}
              detail="bajo monitoreo"
              icon={Building2}
              loading={metricsLoading}
            />
            <SummaryCard
              title="Tickets abiertos"
              value={metrics.ticketsPendientes}
              detail="requieren seguimiento"
              icon={ClipboardList}
              loading={metricsLoading}
            />
            <SummaryCard
              title="Urgencias activas"
              value={metrics.ticketsUrgentes}
              detail={metrics.ticketsUrgentes > 0 ? "atención inmediata" : "sin incidentes críticos"}
              icon={TriangleAlert}
              loading={metricsLoading}
            />
            <SummaryCard
              title="Sin movimiento +48h"
              value={metrics.staleTickets48h}
              detail={metrics.staleTickets48h > 0 ? "requieren seguimiento" : "sin tickets estancados"}
              icon={Clock3}
              loading={metricsLoading}
            />
          </div>
        )}
      </section>
      <ChartAreaInteractive />
      <section id="actividad-reciente" className="space-y-3 pb-4">
        <div>
          <h2 className="font-semibold text-2xl text-slate-900 tracking-tight">Actividad reciente</h2>
          <p className="mt-1 text-muted-foreground text-sm">Últimos tickets registrados.</p>
        </div>
        <div className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/82 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
          {ticketsLoading ? (
            <div className="space-y-4 p-4">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-16 animate-pulse rounded-2xl bg-muted/50" />
              ))}
            </div>
          ) : ticketsError ? (
            <p className="p-5 text-destructive text-sm">No se pudo cargar la actividad: {ticketsError}</p>
          ) : recentTickets.length === 0 ? (
            <p className="p-5 text-muted-foreground text-sm">Todavía no hay actividad para mostrar.</p>
          ) : (
            recentTickets.map((ticket, index) => {
              const TicketIcon = getTicketIcon(ticket);
              const isClosed = ticket.status === "cerrado";
              return (
                <div
                  key={ticket.id}
                  className={cn(
                    "flex items-start gap-3 p-4",
                    index !== recentTickets.length - 1 && "border-border/50 border-b",
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
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 text-sm">
                          {ticket.ticket_code || "Nuevo ticket"}
                        </p>
                        <p className="mt-1 line-clamp-2 text-slate-700 text-sm">
                          {ticket.description || "Sin descripción"}
                        </p>
                      </div>
                      <span className="whitespace-nowrap font-medium text-muted-foreground text-xs">
                        {formatRelativeTime(ticket.created_at)}
                      </span>
                    </div>
                    <p className="mt-3 text-slate-500 text-xs uppercase tracking-[0.18em]">
                      {ticket.edificio_nombre || "Sin consorcio asignado"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
