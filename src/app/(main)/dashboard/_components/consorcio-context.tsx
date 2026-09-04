import { Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function ConsorcioContext() {
  return (
    <section
      aria-label="Contexto de Consorcio"
      title="Contexto de Consorcio"
      className="flex items-center gap-3 overflow-hidden rounded-xl border bg-sidebar-accent/40 px-3 py-2 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
    >
      <Building2 aria-hidden="true" className="size-4 text-muted-foreground" />
      <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
        <p className="font-medium text-xs">Contexto de Consorcio</p>
        <p className="text-muted-foreground text-xs">Selección disponible próximamente</p>
      </div>
      <Badge variant="secondary" className="shrink-0 text-[10px] group-data-[collapsible=icon]:hidden">
        Próximamente
      </Badge>
    </section>
  );
}
