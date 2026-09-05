/** Product lifecycle is independent from organization/plan availability and user authorization. */
export type FeatureLifecycle = "active" | "coming_soon";

export type FeatureId =
  | "tickets"
  | "consorcios"
  | "residentes"
  | "documentos"
  | "notificaciones"
  | "reservas"
  | "equipo"
  | "seguridad"
  | "tenant_settings"
  | "tenant_support"
  | "reporting"
  | "contable"
  | "legales"
  | "organizations"
  | "users"
  | "platform_support"
  | "onboarding"
  | "planes"
  | "suscripciones"
  | "platform_system";

export type FeatureCatalogEntry = {
  id: FeatureId;
  label: string;
  lifecycle: FeatureLifecycle;
};

/**
 * Product capabilities only. Navigation, availability, and authorization remain surface/context concerns.
 */
export const featureCatalog: readonly FeatureCatalogEntry[] = [
  { id: "tickets", label: "Tickets", lifecycle: "active" },
  { id: "consorcios", label: "Consorcios", lifecycle: "active" },
  { id: "residentes", label: "Residentes", lifecycle: "active" },
  { id: "documentos", label: "Documentos", lifecycle: "active" },
  { id: "notificaciones", label: "Notificaciones", lifecycle: "active" },
  { id: "reservas", label: "Reservas", lifecycle: "active" },
  { id: "equipo", label: "Equipo", lifecycle: "active" },
  { id: "seguridad", label: "Seguridad", lifecycle: "active" },
  { id: "tenant_settings", label: "Configuración", lifecycle: "active" },
  { id: "tenant_support", label: "Soporte", lifecycle: "active" },
  { id: "reporting", label: "Reporting", lifecycle: "coming_soon" },
  { id: "contable", label: "Contable", lifecycle: "coming_soon" },
  { id: "legales", label: "Legales", lifecycle: "coming_soon" },
  { id: "organizations", label: "Organizations", lifecycle: "active" },
  { id: "users", label: "Users", lifecycle: "active" },
  { id: "platform_support", label: "Support", lifecycle: "active" },
  { id: "onboarding", label: "Onboarding", lifecycle: "active" },
  { id: "planes", label: "Planes", lifecycle: "active" },
  { id: "suscripciones", label: "Suscripciones", lifecycle: "active" },
  { id: "platform_system", label: "Sistema", lifecycle: "active" },
];
