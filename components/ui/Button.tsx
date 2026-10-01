"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useMagnetic } from "@/lib/hooks/useMagnetic";

type Variant = "primary" | "outline" | "ghost";

const base =
  "font-ui relative inline-flex items-center gap-2 overflow-hidden uppercase tracking-wide text-sm px-6 py-3.5 transition-[color,background-color,box-shadow] duration-300 group";

// Light streak that sweeps across the button on hover (no transform on the root, so it coexists with the magnetic effect).
const shine =
  "hover:shadow-[0_10px_24px_-8px_rgba(0,0,0,0.35)] after:pointer-events-none after:absolute after:inset-y-0 after:-left-1/2 after:w-1/3 after:-skew-x-[20deg] after:bg-white/30 after:opacity-0 after:transition-transform after:duration-700 after:ease-out hover:after:translate-x-[450%] hover:after:opacity-100";

const variants: Record<Variant, string> = {
  primary: `bg-brand-red text-white hover:bg-ink ${shine}`,
  outline: `border border-ink text-ink hover:bg-ink hover:text-white ${shine}`,
  ghost:
    "text-ink hover:text-brand-red [&>span]:bg-[linear-gradient(currentColor,currentColor)] [&>span]:bg-[length:0%_1px] [&>span]:bg-[position:0_100%] [&>span]:bg-no-repeat [&>span]:pb-0.5 [&>span]:transition-[background-size] [&>span]:duration-300 hover:[&>span]:bg-[length:100%_1px]",
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
