import type { ReactNode } from "react";

import { APP_CONFIG } from "@/config/app-config";

import { LandingHeader } from "./landing-header";

interface LandingShellProps {
  children: ReactNode;
}

export function LandingShell({ children }: LandingShellProps) {
  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-[#0b1220] px-3 py-4 text-foreground sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/4 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,oklch(0.45_0.2_264_/_0.16)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-[radial-gradient(circle,oklch(0.55_0.12_285_/_0.1)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,oklch(0.6_0.08_220_/_0.07)_0%,transparent_70%)] blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl rounded-[1.75rem] border border-white/10 bg-background shadow-2xl shadow-black/50 ring-1 ring-white/5">
        <div className="relative overflow-hidden rounded-[1.75rem]">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent"
            aria-hidden
          />
          <div className="relative px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10">
            <LandingHeader />
            <main>{children}</main>
            <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-muted-foreground text-xs sm:flex-row">
              <span>{APP_CONFIG.copyright}</span>
              <span>Operación de consorcios · ELI Desk</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
