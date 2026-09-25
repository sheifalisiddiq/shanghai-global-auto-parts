import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "ink",
  level = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "ink" | "white";
  /** Heading tag to render. Defaults to h2 — pass "h3" when nesting under a page's own h2. */
  level?: "h2" | "h3";
  className?: string;
}) {
  const Tag = level;
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <span
          className={cn(
            "font-ui mb-3 block text-xs tracking-[0.25em] uppercase",
            tone === "white" ? "text-white/60" : "text-brand-red",
          )}
        >
          {eyebrow}
        </span>
      )}
      <Tag
        className={cn(
          "font-display text-4xl leading-[0.95] font-black uppercase sm:text-5xl lg:text-6xl",
          tone === "white" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            "mt-3 text-sm leading-relaxed max-w-2xl",
            tone === "white" ? "text-slate-300" : "text-steel-dark",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
