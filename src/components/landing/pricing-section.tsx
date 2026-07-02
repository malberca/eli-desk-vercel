"use client";

import { useCallback, useState } from "react";

import Image from "next/image";

import { toast } from "sonner";

import { type BuildingSize, ELI_PLAN_LIST, formatEliPrice, getPricingQuote, type PlanId } from "@/config/eli-pricing";

import { LANDING_GRADIENT_ASSETS } from "./landing-gradient-glow";
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
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <div className="absolute inset-x-0 top-1/2 h-[120%] min-h-full w-full -translate-y-1/2 [mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_86%,transparent_100%)]">
            <Image
              src={LANDING_GRADIENT_ASSETS.pricingAmbient}
              alt=""
              fill
              unoptimized
              sizes="100vw"
              className="object-cover object-[center_42%] opacity-[0.32] blur-md mix-blend-screen sm:opacity-[0.36]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/25 to-background/90" />
        </div>

        <div className="relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">Planes por edificio</h2>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed sm:text-base">
              Cobro por consorcio / edificio, segmentado por cantidad de unidades. Precios en USD.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-stretch">
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
            WhatsApp requiere cuenta Business aprobada por Meta. Los costos de mensajería pueden variar según uso.
            Algunos componentes de IA tienen costos variables según consumo.
          </p>
        </div>
      </div>
    </section>
  );
}
