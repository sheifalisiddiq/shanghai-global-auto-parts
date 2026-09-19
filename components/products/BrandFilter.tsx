"use client";

import { Badge } from "@/components/ui/Badge";
import { carBrands } from "@/lib/data/brands";
import { brandName } from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function BrandFilter({
  activeIds,
  onToggle,
}: {
  activeIds: string[];
  onToggle: (id: string) => void;
}) {
  const { isRTL } = useLanguage();
  return (
    <div className="flex flex-wrap gap-2">
      {carBrands.map((brand) => (
        <Badge key={brand.id} active={activeIds.includes(brand.id)} onClick={() => onToggle(brand.id)}>
          {brandName(brand, isRTL)}
        </Badge>
      ))}
    </div>
  );
}
