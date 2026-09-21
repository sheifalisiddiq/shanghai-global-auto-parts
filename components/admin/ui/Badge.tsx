import { cn } from "@/lib/utils/cn";
import type { Status } from "@/lib/admin/data/types";

type Tone = "neutral" | "green" | "amber" | "red" | "blue" | "dark";

const tones: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-600",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-brand-red/10 text-brand-red-dark",
  blue: "bg-sky-50 text-sky-700",
  dark: "bg-ink text-white",
};

export function Badge({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10.5px] font-bold tracking-wider whitespace-nowrap uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const STATUS_TONE: Record<Status, Tone> = {
  draft: "neutral",
  published: "green",
  scheduled: "blue",
  archived: "amber",
  trash: "red",
};

export function StatusBadge({ status }: { status: Status }) {
  return <Badge tone={STATUS_TONE[status]}>{status}</Badge>;
}

/** Every seeded demo row that has no real source is labelled with this badge. */
export function SampleBadge({ className }: { className?: string }) {
  return (
    <Badge tone="amber" className={cn("border border-amber-200", className)}>
      Sample
    </Badge>
  );
}

export function YesNo({ value }: { value: boolean }) {
  return <Badge tone={value ? "green" : "neutral"}>{value ? "Yes" : "No"}</Badge>;
}
