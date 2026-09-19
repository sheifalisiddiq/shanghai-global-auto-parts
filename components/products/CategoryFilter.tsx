"use client";

import { Tabs } from "@/components/ui/Tabs";
import { categories } from "@/lib/data/categories";
import { categoryKey } from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function CategoryFilter({
  activeId,
  onChange,
  onlyIds,
}: {
  activeId: string;
  onChange: (id: string) => void;
  /** Restrict tabs to these category ids (e.g. categories present on a model page). */
  onlyIds?: string[];
}) {
  const { t } = useLanguage();
  const items = [
    { id: "all", label: t("products.allCategories") },
    ...categories
      .filter((c) => !onlyIds || onlyIds.includes(c.id))
      .map((c) => ({ id: c.id, label: t(categoryKey(c.id), c.label) })),
  ];
  return <Tabs items={items} activeId={activeId} onChange={onChange} />;
}
