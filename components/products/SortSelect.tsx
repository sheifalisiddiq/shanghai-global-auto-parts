"use client";

import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export type SortValue = "featured" | "az" | "za";

export function SortSelect({
  value,
  onChange,
}: {
  value: SortValue;
  onChange: (value: SortValue) => void;
}) {
  const { t } = useLanguage();
  return (
    <label className="relative block">
      <span className="sr-only">{t("products.sortBy")}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortValue)}
        className="border-steel-light text-ink hover:border-ink font-ui w-full min-w-44 cursor-pointer appearance-none border bg-white py-3.5 pe-10 ps-4 text-xs tracking-wide uppercase outline-none transition-colors"
      >
        <option value="featured">
          {t("products.sortBy")}: {t("products.sortFeatured")}
        </option>
        <option value="az">
          {t("products.sortBy")}: {t("products.sortAz")}
        </option>
        <option value="za">
          {t("products.sortBy")}: {t("products.sortZa")}
        </option>
      </select>
      <ChevronDown
        className="text-steel-dark pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2"
        aria-hidden
      />
    </label>
  );
}
