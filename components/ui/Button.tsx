"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useMagnetic } from "@/lib/hooks/useMagnetic";

type Variant = "primary" | "outline" | "ghost";

const base =
  "font-ui inline-flex items-center gap-2 uppercase tracking-wide text-sm px-6 py-3.5 transition-colors duration-200 group";

const variants: Record<Variant, string> = {
  primary: "bg-brand-red text-white hover:bg-ink",
  outline: "border border-ink text-ink hover:bg-ink hover:text-white",
  ghost: "text-ink hover:text-brand-red",
};

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  icon?: boolean;
}

export function Button({
  href,
  variant = "primary",
  className,
  children,
  icon = true,
  ...rest
}: CommonProps &
  ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">)) {
  const magneticRef = useMagnetic<HTMLAnchorElement>();
  return (
    <Link
      ref={magneticRef}
      href={href}
      className={cn(base, variants[variant], "will-change-transform", className)}
      {...rest}
    >
      <span>{children}</span>
      {icon && (
        <ArrowUpRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      )}
    </Link>
  );
}

export function ButtonAction({
  variant = "primary",
  className,
  children,
  icon = true,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const magneticRef = useMagnetic<HTMLButtonElement>();
  return (
    <button
      ref={magneticRef}
      className={cn(base, variants[variant], "will-change-transform", className)}
      {...rest}
    >
      <span>{children}</span>
      {icon && (
        <ArrowUpRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      )}
    </button>
  );
}
