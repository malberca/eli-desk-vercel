const STEPS = [
  {
    step: "01",
    title: "Bot como input",
    description: "Telegram o WhatsApp atiende 24/7, recibe consultas y comprobantes, y genera tickets.",
  },
  {
    step: "02",
    title: "Registro automático",
    description: "Cada interacción se interpreta, estructura y guarda sin intervención manual constante.",
  },
  {
    step: "03",
    title: "Dashboard operativo",
    description: "El administrador ve todo en tiempo real, da seguimiento y deja de perseguir información.",
  },
  {
    step: "04",
    title: "Inteligencia aplicada",
    description: "OCR, clasificación y respuestas contextualizadas para reducir carga repetitiva.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">Cómo funciona ELI</h2>
        <p className="mt-3 text-muted-foreground text-sm leading-relaxed sm:text-base">
          Una capa operativa: canal de entrada, registro estructurado y panel de control para cada edificio.
        </p>
      </div>
      <ol className="mt-10 grid gap-6 sm:grid-cols-2">
        {STEPS.map((item) => (
          <li key={item.step} className="flex gap-4 rounded-2xl border border-border/70 p-5">
            <span className="font-semibold text-primary text-sm tabular-nums">{item.step}</span>
            <div>
              <h3 className="font-medium text-foreground">{item.title}</h3>
              <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
