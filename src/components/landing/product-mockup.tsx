import Image from "next/image";

import { cn } from "@/lib/utils";

import { LANDING_GRADIENT_ASSETS, LandingGradientGlow } from "./landing-gradient-glow";

function MockCard({
  className,
  title,
  subtitle,
  accent,
}: {
  className?: string;
  title: string;
  subtitle: string;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-white/95 p-3 shadow-md shadow-primary/[0.04] backdrop-blur-sm",
        className,
      )}
    >
      {accent ? <p className="mb-1 font-medium text-[10px] text-primary uppercase tracking-wider">{accent}</p> : null}
      <p className="font-medium text-foreground text-xs leading-snug">{title}</p>
      <p className="mt-0.5 text-muted-foreground text-[11px]">{subtitle}</p>
    </div>
  );
}

export function ProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[90%] w-[95%] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <LandingGradientGlow
          src={LANDING_GRADIENT_ASSETS.hero}
          className="inset-0"
          imageClassName="object-center blur-3xl scale-110"
          opacity={0.34}
          sizes="(max-width: 768px) 100vw, 672px"
        />
      </div>
      <div className="relative grid min-h-[280px] place-items-center rounded-[1.75rem] border border-border/50 bg-gradient-to-br from-primary/[0.03] via-muted/25 to-sky-50/40 p-6 shadow-xl shadow-primary/[0.06] sm:min-h-[340px] sm:p-10">
        <MockCard
          className="absolute top-6 left-4 max-w-[200px] sm:left-8"
          accent="Chat"
          title="Vecino: tengo una pérdida en el baño"
          subtitle="Canal WhatsApp · hace 2 min"
        />
        <MockCard
          className="absolute top-16 right-4 max-w-[190px] sm:right-10"
          accent="Ticket"
          title="Ticket #1042 · Reclamo"
          subtitle="Pendiente · Edificio Rivadavia"
        />
        <MockCard
          className="absolute bottom-20 left-6 max-w-[180px]"
          accent="Pago"
          title="Comprobante recibido"
          subtitle="OCR en proceso · Expensas marzo"
        />
        <MockCard
          className="absolute right-6 bottom-28 max-w-[200px]"
          accent="Dashboard"
          title="12 casos abiertos · 8 resueltos"
          subtitle="Monitor en tiempo real"
        />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="rounded-2xl bg-white/90 p-2 shadow-lg shadow-primary/10 ring-1 ring-primary/15">
            <Image
              src="/eli-bot.webp"
              alt="ELI"
              width={120}
              height={120}
              className="h-24 w-24 object-contain sm:h-28 sm:w-28"
              priority
            />
          </div>
          <p className="text-center text-muted-foreground text-xs">Capa operativa para tu administración</p>
        </div>
      </div>
    </div>
  );
}
