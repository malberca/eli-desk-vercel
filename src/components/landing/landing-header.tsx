import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Problema", href: "#problema" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Planes", href: "#planes" },
  { label: "FAQ", href: "#faq" },
] as const;

export function LandingHeader() {
  return (
    <header className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Image src="/eli-gr.svg" alt="ELI Desk" width={88} height={32} className="h-8 w-auto" priority />
        <span className="font-semibold text-foreground text-sm tracking-tight">ELI Desk</span>
      </div>

      <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">Ingresar al panel</Link>
        </Button>
        <Button size="sm" asChild>
          <a href="#planes">Contratar ELI</a>
        </Button>
      </div>
    </header>
  );
}
