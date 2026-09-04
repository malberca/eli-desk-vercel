"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Search } from "lucide-react";

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
import { type DeskNavigationItem, deskNavigationItems } from "@/navigation/sidebar/sidebar-items";

const searchGroups = [
  { id: "primary", label: "ELI Desk" },
  { id: "future", label: "Próximamente" },
] as const;

function AvailabilityLabel({ item }: { item: DeskNavigationItem }) {
  if (item.availability === "available") return null;

  return (
    <span className="ml-2 rounded-md bg-muted px-2 py-1 text-xs">
      {item.availability === "coming_soon" ? "Próximamente" : "No disponible"}
    </span>
  );
}

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "j" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
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
          {searchGroups.map((group, index) => {
            const items = deskNavigationItems.filter((item) => item.desktopSection === group.id);

            return (
              <React.Fragment key={group.id}>
                {index !== 0 && <CommandSeparator />}
                <CommandGroup heading={group.label}>
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isAvailable = item.availability === "available" && Boolean(item.href);

                    return (
                      <CommandItem
                        key={item.id}
                        disabled={!isAvailable}
                        className={!isAvailable ? "opacity-60" : undefined}
                        onSelect={() => {
                          if (!isAvailable || !item.href) return;
                          router.push(item.href);
                          setOpen(false);
                        }}
                      >
                        <Icon />
                        <span className="flex-1">{item.label}</span>
                        <AvailabilityLabel item={item} />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </React.Fragment>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
