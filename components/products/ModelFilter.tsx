"use client";

import { ChevronDown } from "lucide-react";
import { carBrands } from "@/lib/data/brands";
import { brandName, getConfirmedModels } from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/** Value format: "<brandId>/<modelSlug>". Only models with confirmed parts are offered. */
export function ModelFilter({
  brandIds,
  value,
  onChange,
}: {
  brandIds: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const { t, isRTL } = useLanguage();
  const models = getConfirmedModels(brandIds);
  const groups = (brandIds.length ? brandIds : carBrands.map((b) => b.id))
    .map((id) => ({
      brand: carBrands.find((b) => b.id === id),
      models: models.filter((m) => m.brandId === id),
    }))
    .filter((g) => g.brand && g.models.length > 0);

  const hint =
    brandIds.length > 0 && groups.length === 0 ? t("products.noModelsForBrand") : t("products.modelHint");

  return (
    <label className="relative block" title={hint}>
      <span className="sr-only">{t("products.filterModel")}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={groups.length === 0}
        className="border-steel-light text-ink hover:border-ink font-ui w-full min-w-48 cursor-pointer appearance-none border bg-white py-3.5 pe-10 ps-4 text-xs tracking-wide uppercase outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">
          {t("products.filterModel")}: {t("products.allModels")}
        </option>
        {groups.map((g) => (
          <optgroup key={g.brand!.id} label={brandName(g.brand!, isRTL)}>
            {g.models.map((m) => (
              <option key={`${m.brandId}/${m.slug}`} value={`${m.brandId}/${m.slug}`}>
                {m.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <ChevronDown
        className="text-steel-dark pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2"
        aria-hidden
      />
    </label>
  );
}
