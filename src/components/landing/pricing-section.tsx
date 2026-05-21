"use client";

import { useCallback, useState } from "react";

import { toast } from "sonner";

import { type BuildingSize, ELI_PLAN_LIST, formatEliPrice, getPricingQuote, type PlanId } from "@/config/eli-pricing";

import { PlanCard } from "./plan-card";

export function PricingSection() {
  const [checkoutPreview, setCheckoutPreview] = useState<string | null>(null);

  const handleSelectPlan = useCallback((planId: PlanId, buildingSize: BuildingSize) => {
    const quote = getPricingQuote(planId, buildingSize);
    setCheckoutPreview(`${quote.planId} · ${quote.buildingSize}: primer pago ${formatEliPrice(quote.firstPayment)}`);
    toast.info("Checkout en preparación", {
      description: `Próximamente podrás pagar ${formatEliPrice(quote.firstPayment)} (mensual + onboarding). Integración GalioPay pendiente.`,
    });
  }, []);

  return (
    <section id="planes" className="scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">Planes por edificio</h2>
        <p className="mt-3 text-muted-foreground text-sm leading-relaxed sm:text-base">
          Cobro por consorcio / edificio, segmentado por cantidad de unidades. Precios en USD.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {ELI_PLAN_LIST.map((plan) => (
          <PlanCard key={plan.id} plan={plan} featured={plan.id === "pro"} onSelectPlan={handleSelectPlan} />
        ))}
      </div>

      {checkoutPreview ? (
        <output className="mt-6 block text-center text-muted-foreground text-xs">
          Selección actual: {checkoutPreview}
        </output>
      ) : null}

      <p className="mx-auto mt-8 max-w-2xl text-center text-muted-foreground text-xs leading-relaxed">
        WhatsApp requiere cuenta Business aprobada por Meta. Los costos de mensajería pueden variar según uso. Algunos
        componentes de IA tienen costos variables según consumo.
      </p>
    </section>
  );
}
