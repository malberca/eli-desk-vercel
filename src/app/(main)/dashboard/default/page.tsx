"use client";

import * as React from "react";

import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { DataTable } from "./_components/data-table";
import { EliHoloCard } from "./_components/eli-holo-card";
import { MobileDashboardHome } from "./_components/mobile-dashboard-home";
import { SectionCards } from "./_components/section-cards";

export default function Page() {
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <div className="h-24 animate-pulse rounded-[2rem] bg-muted/60" />;
  }

  if (window.innerWidth < 768) {
    return <MobileDashboardHome />;
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <div className="grid grid-cols-1 gap-3 md:gap-6 lg:grid-cols-[1fr_320px]">
        <ChartAreaInteractive />
        <EliHoloCard />
      </div>
      <DataTable />
    </div>
  );
}
