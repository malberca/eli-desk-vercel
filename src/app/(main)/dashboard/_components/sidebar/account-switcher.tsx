"use client";

import { AccountActions } from "@/app/(main)/dashboard/_components/account-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

export function AccountSwitcher({
  user,
  logoutAction,
}: {
  readonly user: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
  };
  readonly logoutAction: () => Promise<void>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 cursor-pointer rounded-lg">
          <AvatarImage src={user.avatar || undefined} alt={user.name} />
          <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <Avatar className="size-9 rounded-lg">
            <AvatarImage src={user.avatar || undefined} alt={user.name} />
            <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-muted-foreground text-xs">{user.email}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <AccountActions
            logoutAction={logoutAction}
            renderAction={(action) => {
              const Icon = action.icon;

              return (
                <DropdownMenuItem
                  key={action.id}
                  disabled={action.disabled}
                  className={action.disabled ? "opacity-50" : "cursor-pointer"}
                  onSelect={() => void action.onSelect?.()}
                >
                  <Icon />
                  {action.label}
                  {action.disabled && <span className="ml-auto text-muted-foreground text-xs">No disponible</span>}
                </DropdownMenuItem>
              );
            }}
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
