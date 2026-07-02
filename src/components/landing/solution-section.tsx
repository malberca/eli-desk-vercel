import { LANDING_GRADIENT_ASSETS, LandingGradientGlow } from "./landing-gradient-glow";

export function SolutionSection() {
  return (
    <section className="py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/[0.05] via-violet-500/[0.03] to-sky-50/50 px-6 py-10 shadow-sm sm:px-10">
        <LandingGradientGlow
          src={LANDING_GRADIENT_ASSETS.solution}
          className="inset-0"
          imageClassName="object-right object-top scale-125"
          opacity={0.2}
          sizes="(max-width: 768px) 100vw, 1152px"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/88 via-white/72 to-white/55"
          aria-hidden
        />
        <div className="relative">
          <p className="font-medium text-primary text-xs uppercase tracking-wider">La solución</p>
          <h2 className="mt-2 font-semibold text-2xl tracking-tight sm:text-3xl">
            Una capa operativa para administrar consorcios con orden
          </h2>
          <p className="mt-4 max-w-3xl text-muted-foreground text-sm leading-relaxed sm:text-base">
            ELI no es un bot que ayuda: es el sistema que registra, estructura y hace visible cada reclamo, pago y
            comunicación. El administrador deja de ser el cuello de botella y pasa a dirigir con datos reales.
          </p>
        </div>
      </div>
    </section>
  );
}
