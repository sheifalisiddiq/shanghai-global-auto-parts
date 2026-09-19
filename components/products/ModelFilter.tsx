"use client";

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

  return (
    <div>
      <label className="font-ui text-steel-dark flex flex-wrap items-center gap-3 text-xs tracking-wide uppercase">
        <span>{t("products.filterModel")}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={groups.length === 0}
          className="border-steel-light text-ink min-w-56 border bg-white px-3 py-2 text-xs tracking-wide uppercase outline-none disabled:opacity-50"
        >
          <option value="">{t("products.allModels")}</option>
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
      </label>
      <p className="text-steel-dark mt-2 text-xs normal-case">
        {brandIds.length > 0 && groups.length === 0
          ? t("products.noModelsForBrand")
          : t("products.modelHint")}
      </p>
    </div>
  );
}
