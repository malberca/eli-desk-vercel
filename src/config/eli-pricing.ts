import { formatCurrency } from "@/lib/utils";

export const PLAN_IDS = ["base", "pro", "scale"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export const BUILDING_SIZES = ["small", "medium", "large"] as const;
export type BuildingSize = (typeof BUILDING_SIZES)[number];

export const ELI_CURRENCY = "USD" as const;

export interface PlanPricingRow {
  monthly: number;
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  expectedOutcome: string;
  pricing: Record<BuildingSize, PlanPricingRow>;
}

export interface BuildingSizeDefinition {
  id: BuildingSize;
  label: string;
  unitsRange: string;
  onboarding: number;
}

export const BUILDING_SIZE_DEFINITIONS: Record<BuildingSize, BuildingSizeDefinition> = {
  small: {
    id: "small",
    label: "Edificio chico",
    unitsRange: "0–10 unidades",
    onboarding: 50,
  },
  medium: {
    id: "medium",
    label: "Edificio medio",
    unitsRange: "11–20 unidades",
    onboarding: 100,
  },
  large: {
    id: "large",
    label: "Edificio grande",
    unitsRange: "21+ unidades",
    onboarding: 150,
  },
};

export const ELI_PLANS: Record<PlanId, PlanDefinition> = {
  base: {
    id: "base",
    name: "Base",
    tagline: "Orden operativo",
    description: "Centralizá reclamos, respuestas y registro sin depender del caos de WhatsApp.",
    highlights: [
      "Bot 24/7 Telegram / WhatsApp",
      "Respuestas automáticas a FAQ",
      "Registro de reclamos como tickets",
      "Dashboard básico e historial centralizado",
    ],
    expectedOutcome: "Dejar de perder información.",
    pricing: {
      small: { monthly: 15 },
      medium: { monthly: 25 },
      large: { monthly: 40 },
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "Gestión inteligente",
    description: "Todo lo de Base, con automatización y clasificación para reducir carga operativa.",
    highlights: [
      "OCR de comprobantes",
      "Registro automático de pagos",
      "Automatizaciones con n8n",
      "Clasificación inteligente y reportes básicos",
    ],
    expectedOutcome: "Reducir carga operativa y automatizar.",
    pricing: {
      small: { monthly: 30 },
      medium: { monthly: 50 },
      large: { monthly: 80 },
    },
  },
  scale: {
    id: "scale",
    name: "Scale",
    tagline: "Administración profesional",
    description: "Operación multi-consorcio con métricas, prioridad y soporte para escalar sin perder control.",
    highlights: [
      "Multi-consorcio avanzado",
      "Métricas y analytics",
      "Reportes avanzados y prioridad de procesamiento",
      "Soporte prioritario y customizaciones",
    ],
    expectedOutcome: "Escalar la operación sin perder control.",
    pricing: {
      small: { monthly: 50 },
      medium: { monthly: 80 },
      large: { monthly: 120 },
    },
  },
};

export function isPlanId(value: string): value is PlanId {
  return (PLAN_IDS as readonly string[]).includes(value);
}

export function isBuildingSize(value: string): value is BuildingSize {
  return (BUILDING_SIZES as readonly string[]).includes(value);
}

export function getMonthlyPrice(planId: PlanId, buildingSize: BuildingSize): number {
  return ELI_PLANS[planId].pricing[buildingSize].monthly;
}

export function getOnboardingPrice(buildingSize: BuildingSize): number {
  return BUILDING_SIZE_DEFINITIONS[buildingSize].onboarding;
}

export function calcFirstPayment(planId: PlanId, buildingSize: BuildingSize): number {
  return getMonthlyPrice(planId, buildingSize) + getOnboardingPrice(buildingSize);
}

export interface PricingQuote {
  planId: PlanId;
  buildingSize: BuildingSize;
  monthlyPrice: number;
  onboardingPrice: number;
  firstPayment: number;
  currency: typeof ELI_CURRENCY;
}

export function getPricingQuote(planId: PlanId, buildingSize: BuildingSize): PricingQuote {
  const monthlyPrice = getMonthlyPrice(planId, buildingSize);
  const onboardingPrice = getOnboardingPrice(buildingSize);
  return {
    planId,
    buildingSize,
    monthlyPrice,
    onboardingPrice,
    firstPayment: monthlyPrice + onboardingPrice,
    currency: ELI_CURRENCY,
  };
}

export function formatEliPrice(amount: number): string {
  return formatCurrency(amount, { currency: ELI_CURRENCY, noDecimals: true });
}

export const ELI_PLAN_LIST: PlanDefinition[] = PLAN_IDS.map((id) => ELI_PLANS[id]);
