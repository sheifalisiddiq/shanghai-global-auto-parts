import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

export function Badge({
  children,
  active,
  onClick,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={cn(
        "font-ui inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] tracking-wide uppercase transition-colors duration-200",
        active
          ? "border-ink bg-ink text-white"
          : "border-steel-light text-steel-dark hover:border-ink hover:text-ink",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
