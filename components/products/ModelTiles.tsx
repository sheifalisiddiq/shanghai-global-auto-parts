"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getModelsForBrand } from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils/cn";

export function ModelTiles({
  brandId,
  excludeSlug,
}: {
  brandId: string;
  excludeSlug?: string;
}) {
  const { t } = useLanguage();
  const models = getModelsForBrand(brandId).filter((m) => m.slug !== excludeSlug);

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {models.map((m) => (
        <li key={m.slug}>
          <Link
            href={`/products/${brandId}/${m.slug}`}
            className="group border-steel-light hover:border-ink flex items-center justify-between gap-3 border bg-white p-4 transition-colors"
          >
            <span>
              <span className="font-ui text-ink block text-sm tracking-wide uppercase">{m.name}</span>
              <span
                className={cn(
                  "mt-1 block text-xs",
                  m.partCount > 0 ? "text-brand-red" : "text-steel-dark",
                )}
              >
                {m.partCount > 0 ? `${m.partCount} ${t("products.confirmedParts")}` : "—"}
              </span>
            </span>
            <ArrowUpRight
              className="text-steel-dark group-hover:text-brand-red size-4 shrink-0 transition-colors rtl:-scale-x-100"
              aria-hidden
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
