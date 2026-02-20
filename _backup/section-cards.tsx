import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Umbrales para estados visuales
const INCIDENTES_WARNING_THRESHOLD = 10;
const CUMPLIMIENTO_CRITICO_THRESHOLD = 90;

export function SectionCards() {
  const edificiosActivos = 18;
  const incidentesAbiertos = 7;
  const ordenesEnCurso = 14;
  const cumplimientoLegal = 92;

  const incidentesWarning = incidentesAbiertos >= INCIDENTES_WARNING_THRESHOLD;
  const cumplimientoCritico = cumplimientoLegal < CUMPLIMIENTO_CRITICO_THRESHOLD;

  return (
    <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      {/* Card 1 — Edificios bajo gestión */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Edificios activos</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {edificiosActivos}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +1
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            +1 este mes <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Carga de trabajo.</div>
        </CardFooter>
      </Card>

      {/* Card 2 — Incidentes abiertos */}
      <Card
        className={`@container/card ${incidentesWarning ? "border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10" : ""}`}
      >
        <CardHeader>
          <CardDescription>Incidentes abiertos</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {incidentesAbiertos}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                incidentesWarning
                  ? "border-amber-500/60 text-amber-600 dark:text-amber-400"
                  : ""
              }
            >
              <TrendingDown />
              -22%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            -22% este período <TrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Pendientes de resolución</div>
        </CardFooter>
      </Card>

      {/* Card 3 — Órdenes de trabajo activas */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tickets Abiertos</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {ordenesEnCurso}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +3
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            +3 esta semana <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Mantenimiento y proveedores</div>
        </CardFooter>
      </Card>

      {/* Card 4 — Cumplimiento legal */}
      <Card
        className={`@container/card ${cumplimientoCritico ? "border-destructive/50 bg-destructive/5 dark:bg-destructive/10" : ""}`}
      >
        <CardHeader>
          <CardDescription>Cumplimiento / legal</CardDescription>
          <CardTitle
            className={`font-semibold @[250px]/card:text-3xl text-2xl tabular-nums ${cumplimientoCritico ? "text-destructive" : ""}`}
          >
            {cumplimientoLegal}%
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={cumplimientoCritico ? "border-destructive/60 text-destructive" : ""}
            >
              <TrendingUp />
              +4%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            +4% vs mes anterior <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Edificios al día</div>
        </CardFooter>
      </Card>
    </div>
  );
}
