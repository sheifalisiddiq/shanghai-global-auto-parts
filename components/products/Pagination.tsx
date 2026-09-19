"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils/cn";

const arrowClass =
  "border-steel-light text-ink hover:border-ink flex items-center gap-1 border px-3 py-2 text-xs tracking-wide uppercase disabled:pointer-events-none disabled:opacity-40";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const { t } = useLanguage();
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="font-ui mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        className={arrowClass}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
        {t("products.prev")}
      </button>

      {pages.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
          aria-label={`${t("products.page")} ${n}`}
          className={cn(
            "size-9 border text-xs transition-colors",
            n === page
              ? "border-ink bg-ink text-white"
              : "border-steel-light text-ink hover:border-ink",
          )}
        >
          {n}
        </button>
      ))}

      <button
        type="button"
        className={arrowClass}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        {t("products.next")}
        <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
      </button>
    </nav>
  );
}
