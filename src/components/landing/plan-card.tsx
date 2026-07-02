"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BUILDING_SIZE_DEFINITIONS,
  BUILDING_SIZES,
  type BuildingSize,
  calcFirstPayment,
  formatEliPrice,
  getMonthlyPrice,
  getOnboardingPrice,
  type PlanDefinition,
} from "@/config/eli-pricing";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: PlanDefinition;
  featured?: boolean;
  onSelectPlan?: (planId: PlanDefinition["id"], buildingSize: BuildingSize) => void;
}

export function PlanCard({ plan, featured, onSelectPlan }: PlanCardProps) {
  const [buildingSize, setBuildingSize] = useState<BuildingSize>("medium");
  const monthly = getMonthlyPrice(plan.id, buildingSize);
  const onboarding = getOnboardingPrice(buildingSize);
  const firstPayment = calcFirstPayment(plan.id, buildingSize);

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 transition-[border-color,box-shadow]",
        featured
          ? "z-10 border-primary/40 bg-white shadow-xl shadow-primary/25 ring-1 ring-primary/25 lg:-mt-1 lg:mb-1 lg:scale-[1.02]"
          : "border-border/60 bg-white shadow-sm hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.04]",
      )}
    >
      {featured ? (
        <div
          className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          aria-hidden
        />
      ) : null}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-lg">{plan.name}</h3>
          <p className="text-muted-foreground text-sm">{plan.tagline}</p>
        </div>
        {featured ? <Badge className="shrink-0">Recomendado</Badge> : null}
      </div>

      <p className="mt-4 text-muted-foreground text-sm leading-relaxed">{plan.description}</p>

      <ul className="mt-4 flex flex-1 flex-col gap-2">
        {plan.highlights.map((item) => (
          <li key={item} className="text-foreground text-sm before:mr-2 before:text-primary before:content-['•']">
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-muted-foreground text-xs italic">{plan.expectedOutcome}</p>

      <div className="mt-6 space-y-3 border-t border-border/60 pt-5">
        <p className="font-medium text-foreground text-xs">Tamaño del edificio</p>
        <div className="flex flex-wrap gap-2">
          {BUILDING_SIZES.map((size) => {
            const def = BUILDING_SIZE_DEFINITIONS[size];
            return (
              <button
                key={size}
                type="button"
                onClick={() => setBuildingSize(size)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs transition-colors",
                  buildingSize === size
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40",
                )}
              >
                <span className="block font-medium">{def.label}</span>
                <span className="text-[10px]">{def.unitsRange}</span>
              </button>
            );
          })}
        </div>

        <div
          className={cn(
            "space-y-1 rounded-xl border p-4",
            featured ? "border-primary/20 bg-slate-50" : "border-border/50 bg-slate-50/80",
          )}
        >
          <p className="text-muted-foreground text-xs">
            Mensual: <span className="font-medium text-foreground">{formatEliPrice(monthly)}</span>
          </p>
          <p className="text-muted-foreground text-xs">
            Onboarding: <span className="font-medium text-foreground">{formatEliPrice(onboarding)}</span>
          </p>
          <p className="pt-1 font-semibold text-foreground text-sm">Primer pago: {formatEliPrice(firstPayment)}</p>
          <p className="text-[10px] text-muted-foreground">Incluye primer mes + implementación inicial</p>
        </div>

        <Button
          className="w-full"
          variant={featured ? "default" : "outline"}
          onClick={() => onSelectPlan?.(plan.id, buildingSize)}
        >
          Contratar {plan.name}
        </Button>
      </div>
    </article>
  );
}
