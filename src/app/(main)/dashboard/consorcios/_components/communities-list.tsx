"use client";

import * as React from "react";

import Link from "next/link";

import { Eye } from "lucide-react";

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
import { communityStatusLabel } from "@/app/(main)/dashboard/consorcios/_components/community-labels";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { CommunitySummary } from "@/server/communities/community-repository";

const ALL = "todos";
const STATUS_CLASSES: Record<string, string> = {
  activo: "bg-green-500/10 text-green-700 dark:text-green-400",
};

export function CommunitiesList({ communities }: { communities: CommunitySummary[] }) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState(ALL);

  const query = search.trim().toLowerCase();
  const statuses = [...new Set(communities.flatMap((community) => community.status ?? []))];
  const visibleCommunities = communities.filter(
    (community) =>
      (!query || [community.name, community.address].some((value) => value.toLowerCase().includes(query))) &&
      (status === ALL || community.status === status),
  );

  if (communities.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-10 text-center text-muted-foreground text-sm">
        Todavía no hay consorcios cargados.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <ListSearch
          aria-label="Buscar consorcio"
          placeholder="Buscar por nombre o dirección…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <FilterSelect label="Filtrar por estado" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value={ALL}>Estado: Todos</option>
          {statuses.map((value) => (
            <option key={value} value={value}>
              Estado: {communityStatusLabel(value)}
            </option>
          ))}
        </FilterSelect>
        <ListCount count={communities.length} singular="consorcio" plural="consorcios" />
      </div>

      {visibleCommunities.length === 0 ? (
        <ListEmpty>No hay consorcios que coincidan con la búsqueda.</ListEmpty>
      ) : (
        <ListTableCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={LIST_HEAD_CLASS}>Consorcio</TableHead>
                <TableHead className={LIST_HEAD_CLASS}>Dirección</TableHead>
                <TableHead className={LIST_HEAD_CLASS}>Unidades</TableHead>
                <TableHead className={LIST_HEAD_CLASS}>Tickets activos</TableHead>
                <TableHead className={LIST_HEAD_CLASS}>Estado</TableHead>
                <TableHead className={LIST_HEAD_CLASS}>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleCommunities.map((community) => (
                <TableRow key={community.id}>
                  <TableCell className={LIST_CELL_CLASS}>
                    <InitialsAvatar name={community.name} index={communities.indexOf(community)} />
                  </TableCell>
                  <TableCell className={cn(LIST_CELL_CLASS, "text-[13px] text-muted-foreground")}>
                    {community.address}
                  </TableCell>
                  <TableCell className={LIST_CELL_CLASS}>{community.unitCount}</TableCell>
                  <TableCell className={LIST_CELL_CLASS}>
                    <span
                      className={cn(
                        PILL_CLASS,
                        community.activeTicketCount > 0
                          ? "bg-red-500/10 text-red-700 dark:text-red-400"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {community.activeTicketCount}
                    </span>
                  </TableCell>
                  <TableCell className={LIST_CELL_CLASS}>
                    <span
                      className={cn(
                        PILL_CLASS,
                        STATUS_CLASSES[community.status?.toLowerCase() ?? ""] ?? "bg-muted text-muted-foreground",
                      )}
                    >
                      {communityStatusLabel(community.status) ?? "Sin definir"}
                    </span>
                  </TableCell>
                  <TableCell className={LIST_CELL_CLASS}>
                    <Button asChild variant="outline" className={LIST_ACTION_CLASS}>
                      <Link href={`/dashboard/consorcios/${community.id}`}>
                        <Eye className="size-[18px]" />
                        Ver
                      </Link>
                    </Button>
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
