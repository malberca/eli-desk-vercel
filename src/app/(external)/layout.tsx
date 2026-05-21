import type { ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ELI Desk — Operación de consorcios con orden y trazabilidad",
  description:
    "Asistente inteligente y dashboard operativo para centralizar reclamos, pagos y comunicaciones por edificio. Planes por consorcio.",
};

export default function ExternalLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
