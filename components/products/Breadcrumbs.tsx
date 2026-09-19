"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={cn(
          "font-ui flex flex-wrap items-center gap-2 text-[11px] tracking-wide uppercase",
          tone === "dark" ? "text-white/60" : "text-steel-dark",
        )}
      >
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className={tone === "dark" ? "hover:text-white" : "hover:text-ink"}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={last ? (tone === "dark" ? "text-white" : "text-ink") : undefined}
                >
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="size-3 rtl:rotate-180" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Dark hero wrapper shared by the brand and model pages. */
export function PageHero({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-ink relative overflow-hidden py-12 text-white sm:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <Container className="relative z-10">{children}</Container>
    </section>
  );
}
