import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import type { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataTableColumnHeader } from "../../../../../components/data-table/data-table-column-header";
import type { Ticket } from "@/data/schemas";

function formatDateShort(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function statusLabel(status: Ticket["status"]) {
  if (status === "PENDIENTE") return "Pendiente";
  if (status === "EN_CURSO") return "En curso";
  return "Finalizado";
}

export const dashboardColumns: ColumnDef<Ticket>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Título" />,
    cell: ({ row }) => (
      <div className="max-w-[260px] truncate font-medium">
        {row.original.title}
      </div>
    ),
  },

  {
    id: "ticketFecha",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ticket / Fecha" />,
    accessorFn: (row) => row.createdAt, // para permitir sorting por fecha si querés
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.id}</span>
        <span className="text-xs text-muted-foreground">{formatDateShort(row.original.createdAt)}</span>
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => {
      const st = row.original.status;

      // Sin colores “fancy”: solo outline, y texto.
      return (
        <Badge variant="outline" className="px-2 text-muted-foreground">
          {statusLabel(st)}
        </Badge>
      );
    },
  },

  {
    accessorKey: "consorcio",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Consorcio" />,
    cell: ({ row }) => (
      <div className="max-w-[260px] truncate">
        {row.original.consorcio}
      </div>
    ),
  },

  {
    accessorKey: "proveedor",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Proveedor" />,
    cell: ({ row }) => (
      <div className="max-w-[220px] truncate">
        {row.original.proveedor}
      </div>
    ),
  },

  {
    accessorKey: "tag",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tag" />,
    cell: ({ row }) => (
      <Badge variant="outline" className="px-2 text-muted-foreground">
        {row.original.tag}
      </Badge>
    ),
  },

  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <EllipsisVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Ver</DropdownMenuItem>
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
  },
];
