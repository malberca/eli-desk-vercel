"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BUILDING_SIZES, type BuildingSize, ELI_PLAN_LIST, type PlanId } from "@/config/eli-pricing";

export function LeadForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      toast.info("Formulario de demo en preparación", {
        description:
          "Próximamente conectaremos este formulario. Mientras tanto, escribinos por los canales de contacto.",
      });
      e.currentTarget.reset();
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="demo" className="scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">Solicitar demo</h2>
        <p className="mt-3 text-muted-foreground text-sm sm:text-base">
          ¿Preferís ver ELI antes de contratar? Dejanos tus datos y te contactamos.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 grid max-w-xl gap-4 rounded-2xl border border-border/70 bg-muted/10 p-6 sm:p-8"
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lead-name">Nombre</Label>
            <Input id="lead-name" name="name" required disabled={pending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-email">Email</Label>
            <Input id="lead-email" name="email" type="email" required disabled={pending} />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lead-phone">Teléfono</Label>
            <Input id="lead-phone" name="phone" type="tel" disabled={pending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-org">Administración / empresa</Label>
            <Input id="lead-org" name="organizationName" disabled={pending} />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lead-buildings">Cantidad de edificios</Label>
            <Input id="lead-buildings" name="buildingsCount" type="number" min={1} disabled={pending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-units">Unidades aproximadas</Label>
            <Input id="lead-units" name="unitsCount" type="number" min={1} disabled={pending} />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Plan de interés</Label>
            <Select name="selectedPlan" disabled={pending}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar plan" />
              </SelectTrigger>
              <SelectContent>
                {ELI_PLAN_LIST.map((p) => (
                  <SelectItem key={p.id} value={p.id as PlanId}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tamaño típico</Label>
            <Select name="selectedSize" disabled={pending}>
              <SelectTrigger>
                <SelectValue placeholder="Tamaño del edificio" />
              </SelectTrigger>
              <SelectContent>
                {BUILDING_SIZES.map((s) => (
                  <SelectItem key={s} value={s as BuildingSize}>
                    {s === "small" ? "Chico" : s === "medium" ? "Medio" : "Grande"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-message">Mensaje</Label>
          <Textarea id="lead-message" name="message" rows={3} disabled={pending} />
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Enviando…" : "Solicitar contacto"}
        </Button>
      </form>
    </section>
  );
}
