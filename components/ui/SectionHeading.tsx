import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  tone = "ink",
  className,
}: {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  tone?: "ink" | "white";
  className?: string;
}) {
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
      <h2
        className={cn(
          "font-display text-4xl leading-[0.95] font-black uppercase sm:text-5xl lg:text-6xl",
          tone === "white" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
    </div>
  );
}
