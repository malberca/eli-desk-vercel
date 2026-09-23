"use client";

import * as React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CommunityTicket } from "@/server/communities/community-repository";

import { paginate } from "./paginate";

const PAGE_SIZE = 10;
const TICKET_STATUS_LABELS: Record<string, string> = { abierto: "Abierto", en_proceso: "En proceso" };

export function ActiveTicketsTable({ tickets }: { tickets: CommunityTicket[] }) {
  const [page, setPage] = React.useState(1);
  const current = paginate(tickets, page, PAGE_SIZE);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead className="hidden md:table-cell">Unidad</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="hidden md:table-cell">Fecha</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {current.items.map((ticket) => (
            <TableRow key={ticket.id} className="align-top">
              <TableCell>
                <p className="font-semibold">{ticket.code}</p>
                <p className="text-muted-foreground text-xs md:hidden">
                  {[ticket.unitNumber, new Date(ticket.createdAt).toLocaleDateString("es-AR")]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </TableCell>
              <TableCell className="hidden md:table-cell">{ticket.unitNumber ?? "—"}</TableCell>
              <TableCell className="min-w-48 whitespace-normal text-muted-foreground">
                {ticket.description ?? "Sin descripción"}
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {new Date(ticket.createdAt).toLocaleDateString("es-AR")}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{TICKET_STATUS_LABELS[ticket.status] ?? ticket.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {current.pageCount > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Página anterior"
            disabled={current.page === 1}
            onClick={() => setPage(current.page - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-muted-foreground text-sm tabular-nums">
            {current.page} de {current.pageCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Página siguiente"
            disabled={current.page === current.pageCount}
            onClick={() => setPage(current.page + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
