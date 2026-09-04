"use client";

import type { LucideIcon } from "lucide-react";
import { CircleUser, LogOut, Settings } from "lucide-react";

export type AccountAction = {
  id: "account" | "settings" | "logout";
  label: string;
  icon: LucideIcon;
  disabled: boolean;
  onSelect?: () => Promise<void>;
};

export function AccountActions({
  includeSettings = false,
  logoutAction,
  renderAction,
}: {
  includeSettings?: boolean;
  logoutAction: () => Promise<void>;
  renderAction: (action: AccountAction) => React.ReactNode;
}) {
  return (
    <>
      {renderAction({ id: "account", label: "Mi cuenta", icon: CircleUser, disabled: true })}
      {includeSettings && renderAction({ id: "settings", label: "Configuración", icon: Settings, disabled: true })}
      {renderAction({ id: "logout", label: "Cerrar sesión", icon: LogOut, disabled: false, onSelect: logoutAction })}
    </>
  );
}
