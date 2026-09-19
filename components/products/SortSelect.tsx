"use client";

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
    <label className="font-ui text-steel-dark flex items-center gap-2 text-xs tracking-wide uppercase">
      <span>{t("products.sortBy")}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortValue)}
        className="border-steel-light text-ink border bg-white px-3 py-2 text-xs tracking-wide uppercase outline-none"
      >
        <option value="featured">{t("products.sortFeatured")}</option>
        <option value="az">{t("products.sortAz")}</option>
        <option value="za">{t("products.sortZa")}</option>
      </select>
    </label>
  );
}
