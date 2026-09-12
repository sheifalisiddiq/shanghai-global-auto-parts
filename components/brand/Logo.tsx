import { cn } from "@/lib/utils/cn";

const MARK_PATH =
  "M78 22 C 78 10, 55 6, 40 14 C 20 24, 20 40, 38 46 C 56 52, 80 54, 80 70 C 80 88, 55 92, 30 82";

export function LogoMark({
  className,
  color = "#EF0606",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d={MARK_PATH}
        stroke={color}
        strokeWidth={14}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Logo({
  variant = "full",
  tone = "ink",
  className,
}: {
  variant?: "full" | "mark";
  tone?: "ink" | "white";
  className?: string;
}) {
  const textColor = tone === "white" ? "text-white" : "text-ink";
  const subColor = tone === "white" ? "text-white/70" : "text-steel-dark";

  if (variant === "mark") {
    return <LogoMark className={cn("h-9 w-9", className)} />;
  }

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={cn("font-ui text-lg tracking-tight uppercase", textColor)}>
          Shanghai Global
        </span>
        <span className={cn("font-body mt-0.5 text-[10px] tracking-wide uppercase", subColor)}>
          Auto spare parts co LLC
        </span>
      </span>
    </span>
  );
}
