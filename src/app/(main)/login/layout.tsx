import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";

export default function LoginLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="dark bg-background text-foreground">
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="relative order-2 hidden h-full rounded-3xl bg-primary lg:flex">
          <div className="absolute top-10 space-y-4 px-10 text-primary-foreground">
            <img
              src="/logo_eli_w.svg"
              alt="ELI"
              className="h-24 w-auto"
            />
            <p className="text-sm opacity-90">Panel de control para administradores de edificios.</p>
          </div>

          <div className="absolute bottom-10 flex w-full justify-between px-10">
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium">KPIs y seguimiento</h2>
              <p className="text-sm opacity-90">
                Edificios activos, incidentes, órdenes de trabajo y cumplimiento legal en un solo lugar.
              </p>
            </div>
            <Separator orientation="vertical" className="mx-3 h-auto! opacity-50" />
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium">Gestión centralizada</h2>
              <p className="text-sm opacity-90">
                Accede a la información de todos tus edificios bajo gestión de forma segura.
              </p>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
