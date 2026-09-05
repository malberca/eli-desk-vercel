import { Building2, Headset, LayoutDashboard, type LucideIcon, Rocket, Settings, Users } from "lucide-react";

export type PlatformItemAvailability = "available" | "unavailable";
export type PlatformItemPlacement = "mobile_primary" | "mobile_more" | "desktop";
export type PlatformDesktopSection = "primary" | "administration";

export type PlatformNavigationItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  availability: PlatformItemAvailability;
  href?: string;
  placements: readonly PlatformItemPlacement[];
  desktopSection: PlatformDesktopSection;
};

export const PLATFORM_MOBILE_MORE_LABEL = "Más";

export const platformNavigationItems: readonly PlatformNavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    availability: "available",
    href: "/platform",
    placements: ["mobile_primary", "desktop"],
    desktopSection: "primary",
  },
  {
    id: "organizations",
    label: "Organizations",
    icon: Building2,
    availability: "unavailable",
    placements: ["mobile_primary", "desktop"],
    desktopSection: "primary",
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    availability: "unavailable",
    placements: ["mobile_primary", "desktop"],
    desktopSection: "primary",
  },
  {
    id: "support",
    label: "Support",
    icon: Headset,
    availability: "unavailable",
    placements: ["mobile_primary", "desktop"],
    desktopSection: "primary",
  },
  {
    id: "onboarding",
    label: "Onboarding",
    icon: Rocket,
    availability: "unavailable",
    placements: ["mobile_more", "desktop"],
    desktopSection: "administration",
  },
  {
    id: "planes",
    label: "Planes",
    icon: Settings,
    availability: "unavailable",
    placements: ["mobile_more", "desktop"],
    desktopSection: "administration",
  },
  {
    id: "suscripciones",
    label: "Suscripciones",
    icon: Settings,
    availability: "unavailable",
    placements: ["mobile_more", "desktop"],
    desktopSection: "administration",
  },
  {
    id: "sistema",
    label: "Sistema",
    icon: Settings,
    availability: "unavailable",
    placements: ["mobile_more", "desktop"],
    desktopSection: "administration",
  },
];

export const platformMobilePrimaryItems = platformNavigationItems.filter((item) =>
  item.placements.includes("mobile_primary"),
);
export const platformMobileMoreItems = platformNavigationItems.filter((item) =>
  item.placements.includes("mobile_more"),
);
export const platformDesktopPrimaryItems = platformNavigationItems.filter(
  (item) => item.desktopSection === "primary" && item.placements.includes("desktop"),
);
export const platformDesktopAdministrationItems = platformNavigationItems.filter(
  (item) => item.desktopSection === "administration" && item.placements.includes("desktop"),
);
