const PROBLEMS = [
  {
    title: "Desorden total de información",
    description: "Mensajes en múltiples chats, comprobantes perdidos y nadie sabe dónde está cada dato.",
  },
  {
    title: "Operación manual no escalable",
    description: "Todo depende del administrador. Si no está, el sistema no existe.",
  },
  {
    title: "Falta de trazabilidad",
    description: "Sin historial confiable de reclamos ni registro ordenado de pagos.",
  },
  {
    title: "Saturación por WhatsApp",
    description: "Reclamos mezclados con consultas a cualquier hora. WhatsApp no es un sistema.",
  },
  {
    title: "Falta de profesionalización",
    description: "Excel más chats, sin métricas ni procesos estandarizados.",
  },
] as const;

export function ProblemSection() {
  return (
    <section id="problema" className="relative scroll-mt-24 py-12 sm:py-16">
      <div
        className="pointer-events-none absolute inset-x-0 top-6 bottom-6 -mx-2 rounded-3xl bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.08_264_/_0.05)_0%,transparent_58%)] sm:-mx-4"
        aria-hidden
      />
      <div className="relative mx-auto max-w-2xl text-center">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          La administración de consorcios no debería depender del caos
        </h2>
        <p className="mt-3 text-muted-foreground text-sm leading-relaxed sm:text-base">
          ELI ataca los dolores operativos que frenan escalar tu gestión con orden y trazabilidad.
        </p>
      </div>
      <ul className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROBLEMS.map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-border/60 bg-gradient-to-br from-white to-slate-50/70 p-5 shadow-sm shadow-slate-200/40 transition-[border-color,box-shadow] hover:border-primary/25 hover:shadow-md hover:shadow-primary/[0.04]"
          >
            <h3 className="font-medium text-foreground text-sm">{item.title}</h3>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
