import type { ReactNode } from "react";

import Image from "next/image";

import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        {/* Right panel - ELI Branding */}
        <div className="relative order-2 hidden h-full overflow-hidden rounded-3xl bg-primary lg:flex">
          {/* Top: Small logo + Tagline */}
          <div className="absolute top-10 z-10 space-y-3 px-10">
            <Image
              src="/logo_eli_w.svg"
              alt="ELI"
              width={112}
              height={32}
              className="h-auto w-28 opacity-90"
            />
            <p className="max-w-xs text-sm font-light leading-relaxed text-primary-foreground/80">
              Tu asistente inteligente para la administración de consorcios. 
              Gestión de reclamos, urgencias, pagos y consultas en un solo lugar.
            </p>
          </div>

          {/* Center: Feature highlights */}
          <div className="absolute top-1/2 -translate-y-1/2 z-10 px-10 space-y-5">
            <div className="space-y-0.5">
              <h3 className="text-primary-foreground font-medium text-xs tracking-widest uppercase">Atención 24/7</h3>
              <p className="text-primary-foreground/70 text-xs">ELI atiende a los vecinos por WhatsApp en cualquier momento, sin esperas.</p>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-primary-foreground font-medium text-xs tracking-widest uppercase">Tickets automáticos</h3>
              <p className="text-primary-foreground/70 text-xs">Cada reclamo, pago o urgencia se convierte en un ticket trazable al instante.</p>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-primary-foreground font-medium text-xs tracking-widest uppercase">Dashboard en tiempo real</h3>
              <p className="text-primary-foreground/70 text-xs">Visualizá el estado de todos tus edificios, métricas y tickets desde un solo panel.</p>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-primary-foreground font-medium text-xs tracking-widest uppercase">Multiconsorcios</h3>
              <p className="text-primary-foreground/70 text-xs">Gestioná todos tus edificios desde una única plataforma, sin perder el detalle de cada uno.</p>
            </div>
          </div>

          {/* Bottom: Two columns */}
          <div className="absolute bottom-10 z-10 flex w-full justify-between px-10">
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium text-xs">¿Cómo funciona?</h2>
              <p className="text-primary-foreground/60 text-[11px] leading-relaxed">
                Los vecinos contactan a ELI por WhatsApp. ELI identifica el consorcio, 
                clasifica el pedido y genera un ticket que aparece en tu dashboard al instante.
              </p>
            </div>
            <Separator orientation="vertical" className="mx-4 h-auto! bg-primary-foreground/20" />
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium text-xs">Tecnología MA—NO</h2>
              <p className="text-primary-foreground/60 text-[11px] leading-relaxed">
                ELI es un producto de MA—NO Consultora Digital. 
                Automatización inteligente con IA para la gestión de edificios.
              </p>
            </div>
          </div>
        </div>

        {/* Left panel - Login form */}
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
