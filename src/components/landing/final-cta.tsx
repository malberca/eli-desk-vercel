import Link from "next/link";

import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="py-12 sm:py-16">
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-muted/30 px-6 py-10 text-center sm:px-12">
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
    </section>
  );
}
