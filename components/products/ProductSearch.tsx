"use client";

import { Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function ProductSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useLanguage();
  return (
    <label className="border-steel-light focus-within:border-ink relative flex items-center border bg-white transition-colors">
      <span className="sr-only">{t("products.searchLabel")}</span>
      <Search className="text-steel-dark pointer-events-none absolute start-4 size-4" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("products.searchPlaceholder")}
        className="text-ink w-full bg-transparent py-3.5 pe-4 ps-11 text-sm outline-none placeholder:text-slate-400"
      />
    </label>
  );
}
