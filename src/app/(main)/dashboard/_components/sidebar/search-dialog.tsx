"use client";
import * as React from "react";

import { useRouter } from "next/navigation";

import {
  ChartBar,
  Forklift,
  Gauge,
  LayoutDashboard,
  Search,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type SearchItem = {
  group: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  disabled?: boolean;
};

const searchItems: SearchItem[] = [
  { group: "ELI Desk", icon: LayoutDashboard, label: "Monitor", href: "/dashboard/default" },

  { group: "ELI Desk", icon: ChartBar, label: "Reclamos", href: "/dashboard/reclamos", disabled: true },
  { group: "ELI Desk", icon: Gauge, label: "Urgencias", href: "/dashboard/urgencias", disabled: true },

  { group: "Operación", icon: Forklift, label: "Edificios", href: "/dashboard/edificios", disabled: true },
  { group: "Operación", icon: ShoppingBag, label: "Proveedores", href: "/dashboard/proveedores", disabled: true },
  { group: "Operación", icon: ChartBar, label: "Reportes", href: "/dashboard/reportes", disabled: true },
  { group: "Operación", icon: ShoppingBag, label: "Finanzas", href: "/dashboard/finanzas", disabled: true },
];

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const groups = React.useMemo(() => {
    return Array.from(new Set(searchItems.map((item) => item.group)));
  }, []);

  return (
    <>
      <Button
        variant="link"
        className="!px-0 font-normal text-muted-foreground hover:no-underline"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        Buscar
        <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium text-[10px]">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar módulos de ELI Desk…" />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>

          {groups.map((group, i) => (
            <React.Fragment key={group}>
              {i !== 0 && <CommandSeparator />}

              <CommandGroup heading={group}>
                {searchItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <CommandItem
                      key={item.label}
                      className={`!py-1.5 ${item.disabled ? "opacity-50 pointer-events-none" : ""}`}
                      onSelect={() => {
                        if (item.disabled) return;
                        if (item.href) router.push(item.href);
                        setOpen(false);
                      }}
                    >
                      {item.icon && <item.icon />}
                      <span className="flex-1">{item.label}</span>
                      {item.disabled && (
                        <span className="ml-2 rounded-md bg-gray-200 px-2 py-1 text-xs dark:text-gray-800">
                          Próximamente
                        </span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
