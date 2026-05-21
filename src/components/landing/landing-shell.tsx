import type { ReactNode } from "react";

import { APP_CONFIG } from "@/config/app-config";

import { LandingHeader } from "./landing-header";

interface LandingShellProps {
  children: ReactNode;
}

export function LandingShell({ children }: LandingShellProps) {
  return (
    <div className="min-h-dvh bg-[#0b1220] px-3 py-4 text-foreground sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl rounded-[1.75rem] border border-white/10 bg-background shadow-2xl shadow-black/40">
        <div className="px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10">
          <LandingHeader />
          <main>{children}</main>
          <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-muted-foreground text-xs sm:flex-row">
            <span>{APP_CONFIG.copyright}</span>
            <span>Operación de consorcios · ELI Desk</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
