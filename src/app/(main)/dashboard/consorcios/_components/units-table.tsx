"use client";

import * as React from "react";

import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CommunityUnit } from "@/server/communities/community-repository";

import { relationshipLabel, unitStatusLabel, unitTypeLabel } from "./community-labels";
import { ALL, filterUnits, type ResidentsFilter, statusOptions } from "./filter-units";

const SELECT_CLASS = "h-10 rounded-md border bg-background px-3 text-sm";

export function UnitsTable({ units }: { units: CommunityUnit[] }) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState(ALL);
  const [residents, setResidents] = React.useState<ResidentsFilter>(ALL);
  const visibleUnits = filterUnits(units, { search, status, residents });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
          <Input
            aria-label="Buscar unidad o residente"
            placeholder="Buscar unidad o residente"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 pl-9"
          />
        </div>
        <select
          aria-label="Filtrar por estado"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className={SELECT_CLASS}
        >
          <option value={ALL}>Todos los estados</option>
          {statusOptions(units).map((value) => (
            <option key={value} value={value}>
              {unitStatusLabel(value)}
            </option>
          ))}
        </select>
        <select
          aria-label="Filtrar por residentes"
          value={residents}
          onChange={(event) => setResidents(event.target.value as ResidentsFilter)}
          className={SELECT_CLASS}
        >
          <option value={ALL}>Con y sin residentes</option>
          <option value="con">Con residentes</option>
          <option value="sin">Sin residentes</option>
        </select>
      </div>

      {visibleUnits.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
          No hay unidades que coincidan con la búsqueda.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unidad</TableHead>
              <TableHead className="hidden md:table-cell">Piso</TableHead>
              <TableHead className="hidden md:table-cell">Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Residentes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleUnits.map((unit) => (
              <TableRow key={unit.id} className="align-top">
                <TableCell>
                  <p className="font-semibold">{unit.number ?? "s/n"}</p>
                  <p className="text-muted-foreground text-xs md:hidden">
                    {[unit.floor && `Piso ${unit.floor}`, unitTypeLabel(unit.type)].filter(Boolean).join(" · ")}
                  </p>
                </TableCell>
                <TableCell className="hidden md:table-cell">{unit.floor ?? "—"}</TableCell>
                <TableCell className="hidden md:table-cell">{unitTypeLabel(unit.type) ?? "—"}</TableCell>
                <TableCell>
                  {unit.status ? <Badge variant="outline">{unitStatusLabel(unit.status)}</Badge> : "—"}
                </TableCell>
                <TableCell className="whitespace-normal">
                  {unit.residents.length === 0 ? (
                    <span className="text-muted-foreground">Sin residentes</span>
                  ) : (
                    <ul className="space-y-1.5">
                      {unit.residents.map((resident) => (
                        <li key={resident.id}>
                          <div className="flex flex-wrap items-center gap-x-2">
                            <span className="font-medium">{resident.name}</span>
                            {resident.relationship && (
                              <span className="text-muted-foreground">{relationshipLabel(resident.relationship)}</span>
                            )}
                            {resident.isPrimary && <Badge variant="secondary">Principal</Badge>}
                          </div>
                          {(resident.phone || resident.email) && (
                            <p className="break-all text-muted-foreground text-xs">
                              {[resident.phone, resident.email].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
