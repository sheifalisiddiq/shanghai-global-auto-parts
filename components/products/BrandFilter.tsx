"use client";

import { Badge } from "@/components/ui/Badge";
import { carBrands } from "@/lib/data/brands";

export function BrandFilter({
  activeIds,
  onToggle,
}: {
  activeIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {carBrands.map((brand) => (
        <Badge key={brand.id} active={activeIds.includes(brand.id)} onClick={() => onToggle(brand.id)}>
          {brand.name}
        </Badge>
      ))}
    </div>
  );
}
