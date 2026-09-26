import type * as React from "react";

import { ChevronDown, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Shared look for the dashboard list tables (onboarding, consorcios).
export const LIST_HEAD_CLASS = "h-11 px-4";
export const LIST_CELL_CLASS = "px-4 py-3";
export const LIST_ACTION_CLASS = "h-11 rounded-[10px] px-4 text-[13px]";
export const PILL_CLASS = "inline-flex h-7 items-center whitespace-nowrap rounded-full px-3 font-medium text-[13px]";
const SELECT_CLASS =
  "h-11 appearance-none rounded-[10px] border bg-background pr-10 pl-4 font-medium text-[13px] shadow-xs";

const AVATAR_CLASSES = [
  "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  "bg-green-500/10 text-green-700 dark:text-green-400",
  "bg-amber-500/10 text-amber-700 dark:text-amber-400",
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function ListSearch(props: React.ComponentProps<typeof Input>) {
  return (
    <div className="relative md:w-[480px]">
      <Search className="-translate-y-1/2 absolute top-1/2 left-4 size-[18px] text-muted-foreground" />
      <Input className="h-11 rounded-[10px] pl-11" {...props} />
    </div>
  );
}

export function FilterSelect({ label, ...props }: React.ComponentProps<"select"> & { label: string }) {
  return (
    <div className="relative">
      <select aria-label={label} className={SELECT_CLASS} {...props} />
      <ChevronDown className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3.5 size-4" />
    </div>
  );
}

export function ListCount({ count, singular, plural }: { count: number; singular: string; plural: string }) {
  return (
    <span className="font-medium text-muted-foreground text-xs md:ml-auto">
      {count} {count === 1 ? singular : plural}
    </span>
  );
}

export function ListEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed bg-card p-8 text-center text-muted-foreground text-sm">
      {children}
    </div>
  );
}

export function ListTableCard({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-xl border bg-card shadow-xs">{children}</div>;
}

// index keeps the avatar color stable per row position in the full list.
export function InitialsAvatar({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex items-center gap-3.5">
      <span
        className={cn(
          "inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] font-semibold text-sm",
          AVATAR_CLASSES[index % AVATAR_CLASSES.length],
        )}
      >
        {initials(name)}
      </span>
      <span className="font-semibold">{name}</span>
    </div>
  );
}
