"use client";

import * as React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BriefcaseBusiness, CalendarDays, ClipboardList, LayoutGrid } from "lucide-react";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { AccountSwitcher } from "./sidebar/account-switcher";
import { LayoutControls } from "./sidebar/layout-controls";
import { SearchDialog } from "./sidebar/search-dialog";
import { ThemeSwitcher } from "./sidebar/theme-switcher";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

type DashboardShellClientProps = {
  defaultOpen: boolean;
  variant: "inset" | "sidebar" | "floating";
  collapsible: "offcanvas" | "icon" | "none";
  currentUser: CurrentUser;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
};

const mobileNavItems = [
  { label: "Inicio", href: "/dashboard/default", icon: LayoutGrid },
  { label: "Reclamos", href: "/dashboard/coming-soon", icon: ClipboardList },
  { label: "Operación", href: "/dashboard/coming-soon", icon: BriefcaseBusiness },
  { label: "Agenda", href: "/dashboard/coming-soon", icon: CalendarDays },
] as const;

function MobileBottomNav({
  currentUser,
  logoutAction,
}: {
  currentUser: CurrentUser;
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-[1.75rem] border border-border/60 bg-background/92 p-2 shadow-[0_18px_60px_-20px_rgba(15,23,42,0.4)] backdrop-blur-2xl">
        {mobileNavItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium text-muted-foreground transition-all",
                isActive && "bg-primary text-primary-foreground shadow-[0_10px_30px_-14px_rgba(37,99,235,0.95)]",
              )}
            >
              <Icon className="size-5" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}

        <div className="flex flex-1 justify-center">
          <AccountSwitcher user={currentUser} logoutAction={logoutAction} />
        </div>
      </div>
    </div>
  );
}

export function DashboardShellClient({
  defaultOpen,
  variant,
  collapsible,
  currentUser,
  logoutAction,
  children,
}: DashboardShellClientProps) {
  const [mounted, setMounted] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-dvh flex-col">
        <div className={cn("h-full p-4 md:p-6")}>{children}</div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-dvh bg-[linear-gradient(180deg,#fffdf8_0%,#f7f8fc_58%,#f3f6fb_100%)]">
        <main className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pb-28 pt-5">{children}</main>
        <MobileBottomNav currentUser={currentUser} logoutAction={logoutAction} />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar currentUser={currentUser} variant={variant} collapsible={collapsible} logoutAction={logoutAction} />
      <SidebarInset
        className={cn(
          "[html[data-content-layout=centered]_&]:mx-auto! [html[data-content-layout=centered]_&]:max-w-screen-2xl!",
          "max-[113rem]:peer-data-[variant=inset]:mr-2! min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:mr-auto!",
        )}
      >
        <header
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
            "[html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-50 [html[data-navbar-style=sticky]_&]:overflow-hidden [html[data-navbar-style=sticky]_&]:rounded-t-[inherit] [html[data-navbar-style=sticky]_&]:bg-background/50 [html[data-navbar-style=sticky]_&]:backdrop-blur-md",
          )}
        >
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
              <SearchDialog />
            </div>
            <div className="flex items-center gap-2">
              <LayoutControls />
              <ThemeSwitcher />
              <AccountSwitcher user={currentUser} logoutAction={logoutAction} />
            </div>
          </div>
        </header>
        <div className="h-full p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
