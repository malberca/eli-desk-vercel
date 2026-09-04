"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { DeskNavigationItem } from "@/navigation/sidebar/sidebar-items";

function AvailabilityLabel({ item }: { item: DeskNavigationItem }) {
  return (
    <span className="ml-auto text-xs">{item.availability === "coming_soon" ? "Próximamente" : "No disponible"}</span>
  );
}

function DeskNavItem({ item, pathname }: { item: DeskNavigationItem; pathname: string }) {
  const Icon = item.icon;
  const href = item.href;
  const isAvailable = item.availability === "available" && Boolean(href);
  const isActive = isAvailable && pathname === item.href;

  return (
    <SidebarMenuItem>
      {isAvailable && href ? (
        <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
          <Link prefetch={false} href={href}>
            <Icon />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton disabled aria-disabled="true" tooltip={item.label}>
          <Icon />
          <span>{item.label}</span>
          <AvailabilityLabel item={item} />
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}

export function NavMain({ items }: { readonly items: readonly DeskNavigationItem[] }) {
  const pathname = usePathname();
  const primaryItems = items.filter((item) => item.desktopSection === "primary");
  const futureItems = items.filter((item) => item.desktopSection === "future");

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>ELI Desk</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {primaryItems.map((item) => (
              <DeskNavItem key={item.id} item={item} pathname={pathname} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Próximamente</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {futureItems.map((item) => (
              <DeskNavItem key={item.id} item={item} pathname={pathname} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
