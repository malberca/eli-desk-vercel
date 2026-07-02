import Link from "next/link";

import { Button } from "@/components/ui/button";

import { LANDING_GRADIENT_ASSETS, LandingGradientGlow } from "./landing-gradient-glow";

export function FinalCta() {
  return (
    <section className="py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-violet-500/[0.04] to-sky-400/[0.06] px-6 py-10 text-center shadow-lg shadow-primary/10 sm:px-12">
        <LandingGradientGlow
          src={LANDING_GRADIENT_ASSETS.cta}
          className="inset-0"
          imageClassName="object-center scale-110"
          opacity={0.26}
          sizes="(max-width: 768px) 100vw, 1152px"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-primary/[0.04]"
          aria-hidden
        />
        <div className="relative">
          <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
            Profesionalizá la gestión de tus consorcios
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground text-sm sm:text-base">
            Dejá de depender de WhatsApp como sistema. Centralizá la operación con ELI Desk.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <a href="#planes">Contratar ELI</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Ingresar al panel</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
