"use client"

import * as React from "react"
import { useEdificios, updateTicket, tagSuggestions, type TicketRow } from "@/hooks/use-eli-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Loader2, Pencil } from "lucide-react"

interface EditTicketDialogProps {
  ticket: TicketRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated?: () => void
}

export function EditTicketDialog({ ticket, open, onOpenChange, onUpdated }: EditTicketDialogProps) {
  const { edificios } = useEdificios()
  const [edificioId, setEdificioId] = React.useState("")
  const [ticketType, setTicketType] = React.useState("")
  const [priority, setPriority] = React.useState("")
  const [status, setStatus] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [tags, setTags] = React.useState<string[]>([])
  const [tagInput, setTagInput] = React.useState("")
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Load ticket data when dialog opens
  React.useEffect(() => {
    if (ticket && open) {
      setEdificioId(ticket.edificio_id ?? "")
      setTicketType(ticket.ticket_type ?? "")
      setPriority(ticket.priority ?? "media")
      setStatus(ticket.status ?? "abierto")
      setDescription(ticket.description ?? "")
      setCategory(ticket.category ?? "")
      const existingTags = (ticket.data as any)?.tags ?? []
      setTags(Array.isArray(existingTags) ? existingTags : [])
      setTagInput("")
      setError(null)
    }
  }, [ticket, open])

  const suggestions = React.useMemo(() => {
    if (!ticketType) return []
    return (tagSuggestions[ticketType] ?? []).filter((s) => !tags.includes(s))
  }, [ticketType, tags])

  function addTag(tag: string) {
    const clean = tag.trim().toLowerCase()
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean])
    }
    setTagInput("")
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  async function handleSave() {
    if (!ticket) return
    if (!edificioId || !ticketType || !description.trim()) {
      setError("Completá consorcio, tipo y descripción.")
      return
    }

    setSaving(true)
    setError(null)

    const result = await updateTicket(ticket.id, {
      ticket_type: ticketType,
      priority,
      status,
      category: tags[0] ?? category ?? null,
      data: { ...(ticket.data as object ?? {}), tags, source: (ticket.data as any)?.source ?? "chatbot" },
    })

    // Update edificio_id separately if changed
    if (result.success && edificioId !== ticket.edificio_id) {
      const { supabase } = await import("@/lib/supabase")
      await supabase
        .from("tickets")
        .update({ edificio_id: edificioId, description: description.trim() })
        .eq("id", ticket.id)
    } else if (result.success) {
      const { supabase } = await import("@/lib/supabase")
      await supabase
        .from("tickets")
        .update({ description: description.trim() })
        .eq("id", ticket.id)
    }

    setSaving(false)

    if (!result.success) {
      setError(result.error ?? "Error al guardar")
      return
    }

    onOpenChange(false)
    onUpdated?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Editar ticket
          </DialogTitle>
          <DialogDescription>
            {ticket?.ticket_code ?? ""}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Consorcio */}
          <div className="grid gap-2">
            <Label>Consorcio</Label>
            <Select value={edificioId} onValueChange={setEdificioId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar consorcio" />
              </SelectTrigger>
              <SelectContent>
                {edificios.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo + Prioridad + Estado */}
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select value={ticketType} onValueChange={setTicketType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reclamo">Reclamo</SelectItem>
                  <SelectItem value="urgencia">Urgencia</SelectItem>
                  <SelectItem value="consulta">Consulta</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Prioridad</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Estado</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abierto">Abierto</SelectItem>
                  <SelectItem value="en_proceso">En proceso</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descripción */}
          <div className="grid gap-2">
            <Label>Descripción</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del ticket..."
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-0.5 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Escribí un tag y presioná Enter..."
            />
            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {suggestions.slice(0, 6).map((s) => (
                  <Badge
                    key={s}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent text-xs"
                    onClick={() => addTag(s)}
                  >
                    + {s}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
