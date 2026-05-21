import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    q: "¿Qué es ELI?",
    a: "ELI es un asistente inteligente con dashboard para administraciones de consorcios. Centraliza reclamos, pagos, comunicaciones y seguimiento operativo.",
  },
  {
    q: "¿ELI reemplaza al administrador?",
    a: "No. ELI reemplaza el desorden operativo. El administrador sigue tomando decisiones, pero con información ordenada y trazable.",
  },
  {
    q: "¿Funciona con WhatsApp?",
    a: "Sí, puede funcionar con WhatsApp Business (requiere aprobación de Meta). También puede operar con Telegram en etapas iniciales.",
  },
  {
    q: "¿Qué se paga?",
    a: "Suscripción mensual por consorcio/edificio más un costo inicial de implementación (onboarding).",
  },
  {
    q: "¿Por qué se cobra por edificio?",
    a: "Porque el valor y la carga operativa están asociados a cada consorcio, no a cada vecino.",
  },
  {
    q: "¿Puedo usarlo en varios consorcios?",
    a: "Sí. ELI está pensado como sistema multi-tenant y escalable.",
  },
  {
    q: "¿Qué incluye el onboarding?",
    a: "Configuración inicial, carga de datos base, setup del bot, integración de canales y puesta en marcha.",
  },
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">Preguntas frecuentes</h2>
      </div>
      <Accordion type="single" collapsible className="mx-auto mt-8 max-w-2xl">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem key={item.q} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-sm">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
