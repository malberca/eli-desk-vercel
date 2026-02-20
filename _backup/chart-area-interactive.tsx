"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

export const description = "Incidentes abiertos vs cerrados — gráfico central";

// Datos de ejemplo: incidentes abiertos (rojo) y cerrados (azul) por día — 90 días
const chartData = [
  { date: "2024-11-13", abiertos: 12, cerrados: 8 },
  { date: "2024-11-14", abiertos: 11, cerrados: 9 },
  { date: "2024-11-15", abiertos: 10, cerrados: 10 },
  { date: "2024-11-16", abiertos: 9, cerrados: 11 },
  { date: "2024-11-17", abiertos: 10, cerrados: 9 },
  { date: "2024-11-18", abiertos: 11, cerrados: 10 },
  { date: "2024-11-19", abiertos: 9, cerrados: 12 },
  { date: "2024-11-20", abiertos: 8, cerrados: 11 },
  { date: "2024-11-21", abiertos: 7, cerrados: 10 },
  { date: "2024-11-22", abiertos: 8, cerrados: 9 },
  { date: "2024-11-23", abiertos: 9, cerrados: 8 },
  { date: "2024-11-24", abiertos: 10, cerrados: 9 },
  { date: "2024-11-25", abiertos: 9, cerrados: 10 },
  { date: "2024-11-26", abiertos: 8, cerrados: 11 },
  { date: "2024-11-27", abiertos: 7, cerrados: 10 },
  { date: "2024-11-28", abiertos: 6, cerrados: 9 },
  { date: "2024-11-29", abiertos: 7, cerrados: 8 },
  { date: "2024-11-30", abiertos: 8, cerrados: 7 },
  { date: "2024-12-01", abiertos: 9, cerrados: 8 },
  { date: "2024-12-02", abiertos: 10, cerrados: 9 },
  { date: "2024-12-03", abiertos: 9, cerrados: 10 },
  { date: "2024-12-04", abiertos: 8, cerrados: 9 },
  { date: "2024-12-05", abiertos: 7, cerrados: 8 },
  { date: "2024-12-06", abiertos: 8, cerrados: 7 },
  { date: "2024-12-07", abiertos: 9, cerrados: 8 },
  { date: "2024-12-08", abiertos: 10, cerrados: 9 },
  { date: "2024-12-09", abiertos: 11, cerrados: 10 },
  { date: "2024-12-10", abiertos: 10, cerrados: 11 },
  { date: "2024-12-11", abiertos: 9, cerrados: 10 },
  { date: "2024-12-12", abiertos: 8, cerrados: 9 },
  { date: "2024-12-13", abiertos: 7, cerrados: 8 },
  { date: "2024-12-14", abiertos: 6, cerrados: 7 },
  { date: "2024-12-15", abiertos: 7, cerrados: 6 },
  { date: "2024-12-16", abiertos: 8, cerrados: 7 },
  { date: "2024-12-17", abiertos: 7, cerrados: 8 },
  { date: "2024-12-18", abiertos: 6, cerrados: 7 },
  { date: "2024-12-19", abiertos: 5, cerrados: 6 },
  { date: "2024-12-20", abiertos: 6, cerrados: 5 },
  { date: "2024-12-21", abiertos: 7, cerrados: 6 },
  { date: "2024-12-22", abiertos: 8, cerrados: 7 },
  { date: "2024-12-23", abiertos: 9, cerrados: 8 },
  { date: "2024-12-24", abiertos: 8, cerrados: 9 },
  { date: "2024-12-25", abiertos: 7, cerrados: 8 },
  { date: "2024-12-26", abiertos: 8, cerrados: 7 },
  { date: "2024-12-27", abiertos: 9, cerrados: 8 },
  { date: "2024-12-28", abiertos: 10, cerrados: 9 },
  { date: "2024-12-29", abiertos: 9, cerrados: 10 },
  { date: "2024-12-30", abiertos: 8, cerrados: 9 },
  { date: "2024-12-31", abiertos: 7, cerrados: 8 },
  { date: "2025-01-01", abiertos: 8, cerrados: 7 },
  { date: "2025-01-02", abiertos: 9, cerrados: 8 },
  { date: "2025-01-03", abiertos: 10, cerrados: 9 },
  { date: "2025-01-04", abiertos: 11, cerrados: 10 },
  { date: "2025-01-05", abiertos: 10, cerrados: 11 },
  { date: "2025-01-06", abiertos: 9, cerrados: 10 },
  { date: "2025-01-07", abiertos: 8, cerrados: 9 },
  { date: "2025-01-08", abiertos: 7, cerrados: 8 },
  { date: "2025-01-09", abiertos: 8, cerrados: 7 },
  { date: "2025-01-10", abiertos: 9, cerrados: 8 },
  { date: "2025-01-11", abiertos: 8, cerrados: 9 },
  { date: "2025-01-12", abiertos: 7, cerrados: 8 },
  { date: "2025-01-13", abiertos: 6, cerrados: 7 },
  { date: "2025-01-14", abiertos: 7, cerrados: 6 },
  { date: "2025-01-15", abiertos: 8, cerrados: 7 },
  { date: "2025-01-16", abiertos: 7, cerrados: 8 },
  { date: "2025-01-17", abiertos: 6, cerrados: 7 },
  { date: "2025-01-18", abiertos: 5, cerrados: 6 },
  { date: "2025-01-19", abiertos: 6, cerrados: 5 },
  { date: "2025-01-20", abiertos: 7, cerrados: 6 },
  { date: "2025-01-21", abiertos: 8, cerrados: 7 },
  { date: "2025-01-22", abiertos: 9, cerrados: 8 },
  { date: "2025-01-23", abiertos: 8, cerrados: 9 },
  { date: "2025-01-24", abiertos: 7, cerrados: 8 },
  { date: "2025-01-25", abiertos: 6, cerrados: 7 },
  { date: "2025-01-26", abiertos: 7, cerrados: 6 },
  { date: "2025-01-27", abiertos: 8, cerrados: 7 },
  { date: "2025-01-28", abiertos: 9, cerrados: 8 },
  { date: "2025-01-29", abiertos: 8, cerrados: 9 },
  { date: "2025-01-30", abiertos: 7, cerrados: 8 },
  { date: "2025-01-31", abiertos: 6, cerrados: 7 },
  { date: "2025-02-01", abiertos: 7, cerrados: 6 },
  { date: "2025-02-02", abiertos: 8, cerrados: 7 },
  { date: "2025-02-03", abiertos: 9, cerrados: 8 },
  { date: "2025-02-04", abiertos: 8, cerrados: 9 },
  { date: "2025-02-05", abiertos: 7, cerrados: 8 },
  { date: "2025-02-06", abiertos: 8, cerrados: 7 },
  { date: "2025-02-07", abiertos: 9, cerrados: 8 },
  { date: "2025-02-08", abiertos: 10, cerrados: 9 },
  { date: "2025-02-09", abiertos: 9, cerrados: 10 },
  { date: "2025-02-10", abiertos: 8, cerrados: 9 },
  { date: "2025-02-11", abiertos: 7, cerrados: 8 },
];

const chartConfig = {
  date: {
    label: "Fecha",
  },
  abiertos: {
    label: "Incidentes abiertos",
    color: "var(--destructive)",
  },
  cerrados: {
    label: "Incidentes cerrados",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Usar la última fecha del dataset como "hoy" para que siempre haya datos visibles
  const referenceDate = new Date(chartData[chartData.length - 1]!.date);
  const daysToSubtract = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - daysToSubtract);
  const filteredData = chartData.filter((item) => new Date(item.date) >= startDate);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Incidentes: abiertos vs cerrados</CardTitle>
        <CardDescription>
          Evolución de incidentes abiertos (rojo) y cerrados (azul) en el período seleccionado.
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden *:data-[slot=toggle-group-item]:px-4!"
          >
            <ToggleGroupItem value="90d">90 días</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 días</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 días</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex @[767px]/card:hidden w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Período"
            >
              <SelectValue placeholder="90 días" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                90 días
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 días
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 días
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-62 w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAbiertos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-abiertos)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-abiertos)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillCerrados" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-cerrados)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-cerrados)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-CL", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("es-CL", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="cerrados"
              type="natural"
              fill="url(#fillCerrados)"
              stroke="var(--color-cerrados)"
            />
            <Area
              dataKey="abiertos"
              type="natural"
              fill="url(#fillAbiertos)"
              stroke="var(--color-abiertos)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1.5 border-t pt-4 text-sm">
        <p className="font-medium text-foreground">Lectura:</p>
        <ul className="text-muted-foreground list-inside list-disc space-y-0.5">
          <li>Si la roja supera a la azul → atraso</li>
          <li>Si ambas bajan → estabilidad</li>
          <li>Si ambas suben → caos operativo</li>
        </ul>
      </CardFooter>
    </Card>
  );
}
