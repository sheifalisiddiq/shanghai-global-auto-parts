"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "dark" | "outline" | "ghost" | "danger" | "subtle";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary: "bg-brand-red text-white hover:bg-ink",
  dark: "bg-ink text-white hover:bg-brand-red",
  outline: "border border-ink text-ink hover:bg-ink hover:text-white",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-ink",
  subtle: "border border-slate-200 bg-white text-slate-700 hover:border-ink hover:text-ink",
  danger: "border border-brand-red text-brand-red hover:bg-brand-red hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3 text-[11px]",
  md: "h-10 gap-2 px-4 text-[12px]",
};

interface Common {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

type Props = Common &
  (
    | ({ href: string } & { target?: string; onClick?: () => void; disabled?: boolean })
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
  );

export function Button({ variant = "subtle", size = "md", icon, loading, className, children, ...rest }: Props) {
  const cls = cn(
    "font-ui inline-flex shrink-0 items-center justify-center tracking-wide whitespace-nowrap uppercase transition-colors disabled:pointer-events-none disabled:opacity-45",
    sizes[size],
    variants[variant],
    className,
  );
  const inner = (
    <>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </>
  );
  if ("href" in rest && rest.href !== undefined) {
    const { href, target, onClick } = rest;
    return (
      <Link href={href} target={target} onClick={onClick} className={cls}>
        {inner}
      </Link>
    );
  }
  const btn = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" {...btn} disabled={btn.disabled || loading} className={cls}>
      {inner}
    </button>
  );
}
