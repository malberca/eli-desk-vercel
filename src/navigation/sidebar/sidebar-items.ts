import {
  BarChart3,
  Bell,
  Building2,
  Calculator,
  CalendarDays,
  CircleHelp,
  FileText,
  LayoutDashboard,
  type LucideIcon,
  Scale,
  Settings,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export type DeskModuleAvailability = "available" | "unavailable" | "coming_soon";
export type DeskModulePlacement = "mobile_primary" | "mobile_more" | "desktop";
export type DeskDesktopSection = "primary" | "future";

export interface DeskNavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  availability: DeskModuleAvailability;
  href?: string;
  placements: readonly DeskModulePlacement[];
  desktopSection: DeskDesktopSection;
}

export const DESK_MOBILE_MORE_LABEL = "Más";

export const deskNavigationItems: readonly DeskNavigationItem[] = [
  {
    id: "inicio",
    label: "Inicio",
    icon: LayoutDashboard,
    availability: "available",
    href: "/dashboard/default",
    placements: ["mobile_primary", "desktop"],
    desktopSection: "primary",
  },
  {
    id: "tickets",
    label: "Tickets",
    icon: Ticket,
    availability: "unavailable",
    placements: ["mobile_primary", "desktop"],
    desktopSection: "primary",
  },
  {
    id: "consorcios",
    label: "Consorcios",
    icon: Building2,
    availability: "unavailable",
    placements: ["mobile_primary", "desktop"],
    desktopSection: "primary",
  },
  {
    id: "residentes",
    label: "Residentes",
    icon: Users,
    availability: "unavailable",
    placements: ["mobile_primary", "desktop"],
    desktopSection: "primary",
  },
  {
    id: "documentos",
    label: "Documentos",
    icon: FileText,
    availability: "unavailable",
    placements: ["mobile_more", "desktop"],
    desktopSection: "primary",
  },
  {
    id: "notificaciones",
    label: "Notificaciones",
    icon: Bell,
    availability: "unavailable",
    placements: ["desktop"],
    desktopSection: "primary",
  },
  {
    id: "reservas",
    label: "Reservas",
    icon: CalendarDays,
    availability: "unavailable",
    placements: ["desktop"],
    desktopSection: "primary",
  },
  {
    id: "equipo",
    label: "Equipo",
    icon: Users,
    availability: "unavailable",
    placements: ["mobile_more", "desktop"],
    desktopSection: "primary",
  },
  {
    id: "seguridad",
    label: "Seguridad",
    icon: ShieldCheck,
    availability: "unavailable",
    placements: ["desktop"],
    desktopSection: "primary",
  },
  {
    id: "configuracion",
    label: "Configuración",
    icon: Settings,
    availability: "unavailable",
    placements: ["desktop"],
    desktopSection: "primary",
  },
  {
    id: "soporte",
    label: "Soporte",
    icon: CircleHelp,
    availability: "unavailable",
    placements: ["mobile_more", "desktop"],
    desktopSection: "primary",
  },
  {
    id: "reporting",
    label: "Reporting",
    icon: BarChart3,
    availability: "coming_soon",
    placements: ["desktop"],
    desktopSection: "future",
  },
  {
    id: "contable",
    label: "Contable",
    icon: Calculator,
    availability: "coming_soon",
    placements: ["desktop"],
    desktopSection: "future",
  },
  {
    id: "legales",
    label: "Legales",
    icon: Scale,
    availability: "coming_soon",
    placements: ["desktop"],
    desktopSection: "future",
  },
];

export const deskMobilePrimaryItems = deskNavigationItems.filter((item) => item.placements.includes("mobile_primary"));
export const deskMobileMoreItems = deskNavigationItems.filter((item) => item.placements.includes("mobile_more"));
export const deskDesktopNavigationItems = deskNavigationItems.filter((item) => item.placements.includes("desktop"));

// Kept for the backup navigation component that still imports the legacy types.
export const sidebarItems: NavGroup[] = [];
