"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface TabItem {
  id: string;
  label: ReactNode;
  badge?: ReactNode;
}

export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div role="tablist" className={cn("flex gap-1 overflow-x-auto border-b border-slate-200", className)}>
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cn(
              "font-ui relative flex shrink-0 items-center gap-2 px-4 py-3 text-[12px] tracking-wide uppercase transition-colors",
              active ? "text-ink" : "text-slate-500 hover:text-ink",
            )}
          >
            {t.label}
            {t.badge}
            {active && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-red" />}
          </button>
        );
      })}
    </div>
  );
}
