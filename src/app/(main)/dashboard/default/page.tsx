import { ChartAreaInteractive } from "./_components/chart-area-interactive"
import { DataTable } from "./_components/data-table"
import { SectionCards } from "./_components/section-cards"
import { EliHoloCard } from "./_components/eli-holo-card"

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_320px] md:gap-6">
        <ChartAreaInteractive />
        <EliHoloCard />
      </div>
      <DataTable />
    </div>
  )
}
