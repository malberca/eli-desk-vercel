"use client";

import * as React from "react";

import { Ellipsis, Eye } from "lucide-react";

import {
  FilterSelect,
  InitialsAvatar,
  LIST_ACTION_CLASS,
  LIST_CELL_CLASS,
  LIST_HEAD_CLASS,
  ListCount,
  ListEmpty,
  ListSearch,
  ListTableCard,
  PILL_CLASS,
} from "@/app/(main)/dashboard/_components/list-table";
import { relationshipLabel } from "@/app/(main)/dashboard/consorcios/_components/community-labels";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { OnboardingRequest } from "@/server/onboarding/onboarding-repository";

const ALL = "todos";
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
const dateFormat = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", year: "numeric" });

function statusLabel(status: string) {
  const text = status.replaceAll("_", " ").trim().toLowerCase();
  return STATUS_LABELS[status] ?? text.charAt(0).toUpperCase() + text.slice(1);
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
        <ListSearch
          aria-label="Buscar solicitud"
          placeholder="Buscar por nombre, teléfono o email…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
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
        <ListCount count={requests.length} singular="solicitud" plural="solicitudes" />
      </div>

      {visibleRequests.length === 0 ? (
        <ListEmpty>No hay solicitudes que coincidan con la búsqueda.</ListEmpty>
      ) : (
        <ListTableCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={LIST_HEAD_CLASS}>Solicitante</TableHead>
                <TableHead className={LIST_HEAD_CLASS}>Contacto</TableHead>
                <TableHead className={LIST_HEAD_CLASS}>Consorcio / Unidad</TableHead>
                <TableHead className={LIST_HEAD_CLASS}>Relación</TableHead>
                <TableHead className={LIST_HEAD_CLASS}>Recibida</TableHead>
                <TableHead className={LIST_HEAD_CLASS}>Estado</TableHead>
                <TableHead className={LIST_HEAD_CLASS}>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className={LIST_CELL_CLASS}>
                    <InitialsAvatar name={request.name} index={requests.indexOf(request)} />
                  </TableCell>
                  <TableCell className={cn(LIST_CELL_CLASS, "text-[13px] text-muted-foreground leading-5")}>
                    <p>{request.phone ?? "Sin teléfono"}</p>
                    <p>{request.email}</p>
                  </TableCell>
                  <TableCell className={cn(LIST_CELL_CLASS, "text-[13px] text-muted-foreground leading-5")}>
                    <p className="font-medium text-foreground">{request.communityName}</p>
                    <p>Unidad {request.unitNumber ?? "s/n"}</p>
                  </TableCell>
                  <TableCell className={LIST_CELL_CLASS}>
                    <span
                      className={cn(
                        PILL_CLASS,
                        RELATIONSHIP_CLASSES[request.relationship.toLowerCase()] ?? "bg-muted text-muted-foreground",
                      )}
                    >
                      {relationshipLabel(request.relationship) ?? "Sin definir"}
                    </span>
                  </TableCell>
                  <TableCell className={cn(LIST_CELL_CLASS, "text-[13px] text-muted-foreground")}>
                    {dateFormat.format(new Date(request.createdAt))}
                  </TableCell>
                  <TableCell className={LIST_CELL_CLASS}>
                    <span
                      className={cn(PILL_CLASS, STATUS_CLASSES[request.status] ?? "bg-muted text-muted-foreground")}
                    >
                      {statusLabel(request.status)}
                    </span>
                  </TableCell>
                  <TableCell className={LIST_CELL_CLASS}>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" className={LIST_ACTION_CLASS}>
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
        </ListTableCard>
      )}
    </div>
  );
}
