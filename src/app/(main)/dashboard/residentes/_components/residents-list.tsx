"use client";

import * as React from "react";

import Link from "next/link";

import { Search } from "lucide-react";

import { relationshipLabel } from "@/app/(main)/dashboard/consorcios/_components/community-labels";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ResidentSummary } from "@/server/residents/resident-repository";

import { ALL, communityOptions, filterResidents, type StatusFilter } from "./filter-residents";

const SELECT_CLASS = "h-10 rounded-md border bg-background px-3 text-sm";

export function ResidentsList({ residents }: { residents: ResidentSummary[] }) {
  const [search, setSearch] = React.useState("");
  const [communityId, setCommunityId] = React.useState(ALL);
  const [status, setStatus] = React.useState<StatusFilter>(ALL);
  const visibleResidents = filterResidents(residents, { search, communityId, status });

  if (residents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground text-sm">
        Todavía no hay residentes cargados.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
          <Input
            aria-label="Buscar residente"
            placeholder="Buscar por nombre, teléfono o email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 pl-9"
          />
        </div>
        <select
          aria-label="Filtrar por consorcio"
          value={communityId}
          onChange={(event) => setCommunityId(event.target.value)}
          className={SELECT_CLASS}
        >
          <option value={ALL}>Todos los consorcios</option>
          {communityOptions(residents).map((community) => (
            <option key={community.id} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Filtrar por estado"
          value={status}
          onChange={(event) => setStatus(event.target.value as StatusFilter)}
          className={SELECT_CLASS}
        >
          <option value={ALL}>Todos los estados</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
      </div>

      {visibleResidents.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
          No hay residentes que coincidan con la búsqueda.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Residente</TableHead>
              <TableHead>Unidades</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleResidents.map((resident) => (
              <TableRow key={resident.id} className="align-top">
                <TableCell className="whitespace-normal">
                  <p className="font-semibold">{resident.name}</p>
                  {(resident.phone || resident.email) && (
                    <p className="break-all text-muted-foreground text-xs">
                      {[resident.phone, resident.email].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </TableCell>
                <TableCell className="whitespace-normal">
                  {resident.units.length === 0 ? (
                    <span className="text-muted-foreground">Sin unidad</span>
                  ) : (
                    <ul className="space-y-1.5">
                      {resident.units.map((unit) => (
                        <li key={unit.unitId} className="flex flex-wrap items-center gap-x-2">
                          <span className="font-medium">{unit.unitNumber ?? "s/n"}</span>
                          <Link
                            href={`/dashboard/consorcios/${unit.communityId}`}
                            className="underline-offset-4 hover:underline"
                          >
                            {unit.communityName}
                          </Link>
                          {unit.relationship && (
                            <span className="text-muted-foreground">{relationshipLabel(unit.relationship)}</span>
                          )}
                          {unit.isPrimary && <Badge variant="secondary">Principal</Badge>}
                        </li>
                      ))}
                    </ul>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{resident.active ? "Activo" : "Inactivo"}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
