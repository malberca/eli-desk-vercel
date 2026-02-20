import {
  Banknote,
  Calendar,
  ChartBar,
  Gauge,
  LayoutDashboard,
  Lock,
  type LucideIcon,
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

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "ELI Desk",
    items: [
      {
        title: "Monitor",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "Reclamos",
        url: "/dashboard/coming-soon",
        icon: ChartBar,
        comingSoon: true,
      },
      {
        title: "Urgencias",
        url: "/dashboard/coming-soon",
        icon: Gauge,
        comingSoon: true,
      },
    ],
  },
  {
    id: 2,
    label: "Operación",
    items: [
      {
        title: "Edificios",
        url: "/dashboard/coming-soon",
        icon: Calendar,
        comingSoon: true,
      },
      {
        title: "Proveedores",
        url: "/dashboard/coming-soon",
        icon: Users,
        comingSoon: true,
      },
      {
        title: "Reportes",
        url: "/dashboard/coming-soon",
        icon: ChartBar,
        comingSoon: true,
      },
      {
        title: "Finanzas",
        url: "/dashboard/coming-soon",
        icon: Banknote,
        comingSoon: true,
      },
      {
        title: "Configuración",
        url: "/dashboard/coming-soon",
        icon: Lock,
        comingSoon: true,
      },
    ],
  },
];
