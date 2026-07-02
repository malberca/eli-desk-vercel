const MODULES = [
  {
    title: "Reclamos y tickets",
    description: "Registro, numeración y seguimiento hasta el cierre con aviso al vecino.",
  },
  {
    title: "Pagos y comprobantes",
    description: "Recepción, OCR y registro ordenado de expensas y comprobantes.",
  },
  {
    title: "Comunicación centralizada",
    description: "FAQ, reglamento, horarios y canales sin depender de chats dispersos.",
  },
  {
    title: "Monitor en tiempo real",
    description: "KPIs, casos abiertos y visibilidad por edificio en ELI Desk.",
  },
] as const;

export function ModulesSection() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">Módulos del sistema</h2>
        <p className="mt-3 text-muted-foreground text-sm sm:text-base">
          Todo lo que necesitás para profesionalizar la operación diaria del consorcio.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {MODULES.map((mod) => (
          <article
            key={mod.title}
            className="rounded-2xl border border-border/60 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-sm shadow-slate-200/40"
          >
            <h3 className="font-medium text-foreground">{mod.title}</h3>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{mod.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
