"use client"

import * as React from "react"
import { useTickets, useEdificios, updateTicket, type TicketRow } from "@/hooks/use-eli-data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, CheckCircle2, Circle, Clock, AlertTriangle, ArrowUp, ArrowRight, ArrowDown } from "lucide-react"

// ─── Badge variants by ticket type ──────────────────────────────────
const typeConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  reclamo: { label: "Reclamo", variant: "destructive" },
  urgencia: { label: "Urgencia", variant: "destructive" },
  consulta: { label: "Consulta", variant: "secondary" },
  pago: { label: "Pago", variant: "outline" },
}

const statusConfig: Record<string, { label: string; className: string }> = {
  abierto: { label: "Abierto", className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  cerrado: { label: "Cerrado", className: "bg-green-500/10 text-green-600 border-green-500/30" },
  en_proceso: { label: "En proceso", className: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ─── Row Actions ─────────────────────────────────────────────────────
function TicketActions({ ticket, onUpdated }: { ticket: TicketRow; onUpdated: () => void }) {
  const [loading, setLoading] = React.useState(false)

  async function handleUpdate(fields: Parameters<typeof updateTicket>[1]) {
    setLoading(true)
    await updateTicket(ticket.id, fields)
    setLoading(false)
    onUpdated()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {ticket.ticket_code}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Estado */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Estado</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={() => handleUpdate({ status: "abierto" })}
              disabled={ticket.status === "abierto"}
            >
              <Circle className="mr-2 h-3.5 w-3.5 text-amber-500" />
              Abierto
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleUpdate({ status: "en_proceso" })}
              disabled={ticket.status === "en_proceso"}
            >
              <Clock className="mr-2 h-3.5 w-3.5 text-blue-500" />
              En proceso
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleUpdate({ status: "cerrado" })}
              disabled={ticket.status === "cerrado"}
            >
              <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-green-500" />
              Cerrado
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Prioridad */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Prioridad</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={() => handleUpdate({ priority: "alta" })}
              disabled={ticket.priority === "alta"}
            >
              <ArrowUp className="mr-2 h-3.5 w-3.5 text-red-500" />
              Alta
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleUpdate({ priority: "media" })}
              disabled={ticket.priority === "media"}
            >
              <ArrowRight className="mr-2 h-3.5 w-3.5 text-amber-500" />
              Media
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleUpdate({ priority: "baja" })}
              disabled={ticket.priority === "baja"}
            >
              <ArrowDown className="mr-2 h-3.5 w-3.5 text-green-500" />
              Baja
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Tipo */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Tipo</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={() => handleUpdate({ ticket_type: "reclamo" })}
              disabled={ticket.ticket_type === "reclamo"}
            >
              Reclamo
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleUpdate({ ticket_type: "urgencia" })}
              disabled={ticket.ticket_type === "urgencia"}
            >
              <AlertTriangle className="mr-2 h-3.5 w-3.5 text-red-500" />
              Urgencia
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleUpdate({ ticket_type: "consulta" })}
              disabled={ticket.ticket_type === "consulta"}
            >
              Consulta
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleUpdate({ ticket_type: "pago" })}
              disabled={ticket.ticket_type === "pago"}
            >
              Pago
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Main DataTable ──────────────────────────────────────────────────
export function DataTable() {
  const { tickets, loading, error, refetch } = useTickets()
  const { edificios } = useEdificios()
  const [search, setSearch] = React.useState("")
  const [filterType, setFilterType] = React.useState<string>("all")
  const [filterStatus, setFilterStatus] = React.useState<string>("all")
  const [filterEdificio, setFilterEdificio] = React.useState<string>("all")

  const filtered = React.useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        !search ||
        t.ticket_code?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.toLowerCase().includes(search.toLowerCase()) ||
        t.edificio_nombre?.toLowerCase().includes(search.toLowerCase())
      const matchType = filterType === "all" || t.ticket_type === filterType
      const matchStatus = filterStatus === "all" || t.status === filterStatus
      const matchEdificio = filterEdificio === "all" || t.edificio_nombre === filterEdificio
      return matchSearch && matchType && matchStatus && matchEdificio
    })
  }, [tickets, search, filterType, filterStatus, filterEdificio])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets</CardTitle>
        <CardDescription>
          {loading ? "Cargando..." : `${filtered.length} ticket${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          <Input
            placeholder="Buscar por código, descripción, consorcio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filterEdificio} onValueChange={setFilterEdificio}>
            <SelectTrigger className="w-48" size="sm">
              <SelectValue placeholder="Consorcio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los consorcios</SelectItem>
              {edificios.map((e) => (
                <SelectItem key={e.id} value={e.nombre}>
                  {e.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40" size="sm">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="reclamo">Reclamo</SelectItem>
              <SelectItem value="urgencia">Urgencia</SelectItem>
              <SelectItem value="consulta">Consulta</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40" size="sm">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="abierto">Abierto</SelectItem>
              <SelectItem value="cerrado">Cerrado</SelectItem>
              <SelectItem value="en_proceso">En proceso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        ) : error ? (
          <div className="flex h-40 items-center justify-center text-destructive">
            Error: {error}
          </div>
        ) : (
          <div className="overflow-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Consorcio</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Código</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Prioridad</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Descripción</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Creado</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground w-12">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      No se encontraron tickets
                    </td>
                  </tr>
                ) : (
                  filtered.map((ticket) => (
                    <tr key={ticket.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">
                        {ticket.edificio_nombre || <span className="text-muted-foreground italic">Sin asignar</span>}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {ticket.ticket_code || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={typeConfig[ticket.ticket_type]?.variant ?? "default"}>
                          {typeConfig[ticket.ticket_type]?.label ?? ticket.ticket_type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 capitalize">{ticket.priority}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={statusConfig[ticket.status]?.className ?? ""}
                        >
                          {statusConfig[ticket.status]?.label ?? ticket.status}
                        </Badge>
                      </td>
                      <td className="hidden max-w-xs truncate px-4 py-3 text-muted-foreground lg:table-cell">
                        {ticket.description || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(ticket.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <TicketActions ticket={ticket} onUpdated={refetch} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
