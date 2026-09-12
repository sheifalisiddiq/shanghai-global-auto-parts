import { cn } from "@/lib/utils/cn";
import type { ElementType, ReactNode } from "react";

export function Container({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const Tag = as as "div";
  return (
    <Tag className={cn("mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </Tag>
  );
}
