"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** The PDF's collapsible "Advanced" panel: everyday editors see a clean form. */
export function Collapsible({
  title,
  hint,
  defaultOpen = false,
  children,
  className,
  badge,
}: {
  title: ReactNode;
  hint?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
  badge?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={cn("border border-slate-200 bg-white", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left"
      >
        <span className="font-ui text-[12px] tracking-wide text-ink uppercase">{title}</span>
        {badge}
        {hint && <span className="hidden text-xs text-slate-500 sm:inline">{hint}</span>}
        <ChevronDown className={cn("ml-auto h-4 w-4 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div id={id} className="border-t border-slate-200 p-5">
          {children}
        </div>
      )}
    </div>
  );
}
