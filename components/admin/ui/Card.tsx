import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("border border-slate-200 bg-white", className)}>{children}</section>;
}

export function CardHeader({ title, description, actions }: { title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
      <div className="min-w-0">
        <h3 className="font-ui text-[12px] tracking-wide text-ink uppercase">{title}</h3>
        {description && <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      {icon && <span className="mb-3 text-slate-300">{icon}</span>}
      <p className="font-display text-lg font-extrabold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">{label}</p>
        {icon && <span className="text-brand-red">{icon}</span>}
      </div>
      <p className="font-display mt-3 text-3xl font-extrabold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

/** Simple horizontal bars (CSS only; dashboards are a UI convenience, not a PDF requirement). */
export function Bars({ items }: { items: { label: string; value: number; tone?: "red" | "dark" | "green" | "amber" }[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const tone = { red: "bg-brand-red", dark: "bg-ink", green: "bg-emerald-500", amber: "bg-amber-400" };
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.label}>
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-ink">{i.label}</span>
            <span className="text-slate-500">{i.value}</span>
          </div>
          <div className="mt-1 h-2 bg-slate-100">
            <div className={cn("h-2", tone[i.tone ?? "red"])} style={{ width: `${(i.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
