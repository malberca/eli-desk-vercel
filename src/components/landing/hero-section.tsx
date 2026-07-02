import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ProductMockup } from "./product-mockup";

export function HeroSection() {
  return (
    <section className="flex flex-col gap-10 py-4 text-center sm:gap-12 sm:py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4">
        <Badge variant="secondary" className="rounded-full px-4 py-1 font-normal text-xs">
          Asistente inteligente para administraciones de consorcios
        </Badge>
        <h1 className="font-semibold text-3xl text-foreground tracking-tight sm:text-4xl md:text-5xl md:leading-[1.1]">
          Administrá reclamos, pagos y comunicaciones desde un solo lugar.
        </h1>
        <p className="max-w-2xl text-muted-foreground text-base leading-relaxed sm:text-lg">
          ELI convierte mensajes dispersos en tickets trazables, información ordenada y gestión visible para cada
          consorcio.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button size="lg" asChild>
            <a href="#planes">Ver planes</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Ingresar al panel</Link>
          </Button>
        </div>
      </div>

      <ProductMockup />
    </section>
  );
}
