"use client";

import * as React from "react";

import { ChevronDown, Ellipsis, Eye, Search } from "lucide-react";

import { relationshipLabel } from "@/app/(main)/dashboard/consorcios/_components/community-labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { OnboardingRequest } from "@/server/onboarding/onboarding-repository";

const ALL = "todos";
const PILL_CLASS = "inline-flex h-7 items-center whitespace-nowrap rounded-full px-3 font-medium text-[13px]";
const SELECT_CLASS =
  "h-11 appearance-none rounded-[10px] border bg-background pr-10 pl-4 font-medium text-[13px] shadow-xs";
// status is free text in the DB; unknown values fall back to a readable label and a neutral pill.
const STATUS_LABELS: Record<string, string> = {
  PENDING_VERIFICATION: "Pendiente de verificación",
};
const STATUS_CLASSES: Record<string, string> = {
  PENDING_VERIFICATION: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};
const RELATIONSHIP_CLASSES: Record<string, string> = {
  propietario: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  inquilino: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
};
const AVATAR_CLASSES = [
  "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  "bg-green-500/10 text-green-700 dark:text-green-400",
  "bg-amber-500/10 text-amber-700 dark:text-amber-400",
];
const dateFormat = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", year: "numeric" });

function statusLabel(status: string) {
  const text = status.replaceAll("_", " ").trim().toLowerCase();
  return STATUS_LABELS[status] ?? text.charAt(0).toUpperCase() + text.slice(1);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function FilterSelect({ label, ...props }: React.ComponentProps<"select"> & { label: string }) {
  return (
    <div className="relative">
      <select aria-label={label} className={SELECT_CLASS} {...props} />
      <ChevronDown className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3.5 size-4" />
    </div>
  );
}

export function OnboardingRequestsList({ requests }: { requests: OnboardingRequest[] }) {
  const [search, setSearch] = React.useState("");
  const [community, setCommunity] = React.useState(ALL);
  const [status, setStatus] = React.useState(ALL);

  const query = search.trim().toLowerCase();
  const communities = [...new Set(requests.map((request) => request.communityName))].sort();
  const statuses = [...new Set(requests.map((request) => request.status))];
  const visibleRequests = requests.filter(
    (request) =>
      (!query || [request.name, request.phone, request.email].some((value) => value?.toLowerCase().includes(query))) &&
      (community === ALL || request.communityName === community) &&
      (status === ALL || request.status === status),
  );

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-10 text-center text-muted-foreground text-sm">
        Todavía no hay solicitudes de onboarding.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative md:w-[480px]">
          <Search className="-translate-y-1/2 absolute top-1/2 left-4 size-[18px] text-muted-foreground" />
          <Input
            aria-label="Buscar solicitud"
            placeholder="Buscar por nombre, teléfono o email…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 rounded-[10px] pl-11"
          />
        </div>
        <FilterSelect
          label="Filtrar por consorcio"
          value={community}
          onChange={(event) => setCommunity(event.target.value)}
        >
          <option value={ALL}>Consorcio: Todos</option>
          {communities.map((name) => (
            <option key={name} value={name}>
              Consorcio: {name}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect label="Filtrar por estado" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value={ALL}>Estado: Todos</option>
          {statuses.map((value) => (
            <option key={value} value={value}>
              Estado: {statusLabel(value)}
            </option>
          ))}
        </FilterSelect>
        <span className="font-medium text-muted-foreground text-xs md:ml-auto">
          {requests.length} {requests.length === 1 ? "solicitud" : "solicitudes"}
        </span>
      </div>

      {visibleRequests.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-8 text-center text-muted-foreground text-sm">
          No hay solicitudes que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-11 px-4">Solicitante</TableHead>
                <TableHead className="h-11 px-4">Contacto</TableHead>
                <TableHead className="h-11 px-4">Consorcio / Unidad</TableHead>
                <TableHead className="h-11 px-4">Relación</TableHead>
                <TableHead className="h-11 px-4">Recibida</TableHead>
                <TableHead className="h-11 px-4">Estado</TableHead>
                <TableHead className="h-11 px-4">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3.5">
                      <span
                        className={cn(
                          "inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] font-semibold text-sm",
                          AVATAR_CLASSES[requests.indexOf(request) % AVATAR_CLASSES.length],
                        )}
                      >
                        {initials(request.name)}
                      </span>
                      <span className="font-semibold">{request.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-[13px] text-muted-foreground leading-5">
                    <p>{request.phone ?? "Sin teléfono"}</p>
                    <p>{request.email}</p>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-[13px] text-muted-foreground leading-5">
                    <p className="font-medium text-foreground">{request.communityName}</p>
                    <p>Unidad {request.unitNumber ?? "s/n"}</p>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                      className={cn(
                        PILL_CLASS,
                        RELATIONSHIP_CLASSES[request.relationship.toLowerCase()] ?? "bg-muted text-muted-foreground",
                      )}
                    >
                      {relationshipLabel(request.relationship) ?? "Sin definir"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-[13px] text-muted-foreground">
                    {dateFormat.format(new Date(request.createdAt))}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                      className={cn(PILL_CLASS, STATUS_CLASSES[request.status] ?? "bg-muted text-muted-foreground")}
                    >
                      {statusLabel(request.status)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Button variant="outline" className="h-11 rounded-[10px] px-4 text-[13px]">
                        <Eye className="size-[18px]" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Más acciones"
                        className="size-11 rounded-[10px]"
                      >
                        <Ellipsis className="size-[18px]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
