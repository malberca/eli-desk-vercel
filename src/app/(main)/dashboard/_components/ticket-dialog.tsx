"use client"

import * as React from "react"
import { useEdificios, createTicket, tagSuggestions } from "@/hooks/use-eli-data"
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
import { X, Loader2 } from "lucide-react"

interface CreateTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

export function CreateTicketDialog({ open, onOpenChange, onCreated }: CreateTicketDialogProps) {
  const { edificios } = useEdificios()
  const [edificioId, setEdificioId] = React.useState("")
  const [ticketType, setTicketType] = React.useState("")
  const [priority, setPriority] = React.useState("media")
  const [description, setDescription] = React.useState("")
  const [tags, setTags] = React.useState<string[]>([])
  const [tagInput, setTagInput] = React.useState("")
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Auto-suggest tags based on ticket type
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

  function resetForm() {
    setEdificioId("")
    setTicketType("")
    setPriority("media")
    setDescription("")
    setTags([])
    setTagInput("")
    setError(null)
  }

  async function handleSubmit() {
    if (!edificioId || !ticketType || !description.trim()) {
      setError("Completá consorcio, tipo y descripción.")
      return
    }

    setSaving(true)
    setError(null)

    const result = await createTicket({
      edificio_id: edificioId,
      ticket_type: ticketType,
      priority,
      description: description.trim(),
      tags,
    })

    setSaving(false)

    if (!result.success) {
      setError(result.error ?? "Error al crear ticket")
      return
    }

    resetForm()
    onOpenChange(false)
    onCreated?.()
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo Ticket</DialogTitle>
          <DialogDescription>Creá un ticket manual desde el dashboard.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Consorcio */}
          <div className="grid gap-2">
            <Label htmlFor="edificio">Consorcio *</Label>
            <Select value={edificioId} onValueChange={setEdificioId}>
              <SelectTrigger id="edificio">
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

          {/* Tipo + Prioridad */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select value={ticketType} onValueChange={setTicketType}>
                <SelectTrigger id="type">
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
              <Label htmlFor="priority">Prioridad</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descripción */}
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describí el problema o consulta..."
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
          <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false) }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
