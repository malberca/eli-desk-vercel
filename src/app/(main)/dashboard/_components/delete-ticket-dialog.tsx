"use client"

import * as React from "react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Trash2 } from "lucide-react"
import { softDeleteTicket, type TicketRow } from "@/hooks/use-eli-data"

interface DeleteTicketDialogProps {
  ticket: TicketRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

const DELETE_REASONS = [
  { value: "duplicado", label: "Duplicado" },
  { value: "spam", label: "Spam / Inapropiado" },
  { value: "error_vecino", label: "Error del vecino (ej: edificio equivocado)" },
  { value: "prueba", label: "Prueba de sistema" },
  { value: "otro", label: "Otro" },
]

export function DeleteTicketDialog({ ticket, open, onOpenChange, onDeleted }: DeleteTicketDialogProps) {
  const [reason, setReason] = React.useState("")
  const [otherReason, setOtherReason] = React.useState("")
  const [linkedTicket, setLinkedTicket] = React.useState("")
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  function resetForm() {
    setReason("")
    setOtherReason("")
    setLinkedTicket("")
    setError(null)
  }

  async function handleDelete() {
    if (!ticket) return
    if (!reason) {
      setError("Seleccioná un motivo.")
      return
    }

    let finalReason = reason
    if (reason === "duplicado" && linkedTicket.trim()) {
      finalReason = `Duplicado de ${linkedTicket.trim()}`
    } else if (reason === "otro") {
      if (!otherReason.trim()) {
        setError("Describí el motivo.")
        return
      }
      finalReason = otherReason.trim()
    }

    setSaving(true)
    setError(null)

    const result = await softDeleteTicket(ticket.id, finalReason)

    setSaving(false)

    if (!result.success) {
      setError(result.error ?? "Error al eliminar")
      return
    }

    resetForm()
    onOpenChange(false)
    onDeleted?.()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Eliminar ticket
          </DialogTitle>
          <DialogDescription>
            {ticket ? (
              <>
                <span className="font-mono font-medium">{ticket.ticket_code}</span>
                {ticket.description && (
                  <> — &ldquo;{ticket.description.slice(0, 60)}{ticket.description.length > 60 ? "..." : ""}&rdquo;</>
                )}
              </>
            ) : (
              "¿Estás seguro?"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Label className="text-sm font-medium">¿Por qué eliminás este ticket?</Label>
          <RadioGroup value={reason} onValueChange={setReason}>
            {DELETE_REASONS.map((r) => (
              <div key={r.value} className="flex items-center space-x-2">
                <RadioGroupItem value={r.value} id={`reason-${r.value}`} />
                <Label htmlFor={`reason-${r.value}`} className="font-normal cursor-pointer">
                  {r.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {reason === "duplicado" && (
            <div className="grid gap-2 pl-6">
              <Label htmlFor="linked-ticket" className="text-xs text-muted-foreground">
                Vincular con ticket # (opcional)
              </Label>
              <Input
                id="linked-ticket"
                value={linkedTicket}
                onChange={(e) => setLinkedTicket(e.target.value)}
                placeholder="Ej: ELI-2602-1234"
                className="h-8"
              />
            </div>
          )}

          {reason === "otro" && (
            <div className="grid gap-2 pl-6">
              <Label htmlFor="other-reason" className="text-xs text-muted-foreground">
                Describí el motivo
              </Label>
              <Input
                id="other-reason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Motivo..."
                className="h-8"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false) }}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
