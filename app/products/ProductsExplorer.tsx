"use client";

import { useMemo, useState } from "react";
import { CategoryGrid } from "@/components/products/CategoryGrid";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { BrandFilter } from "@/components/products/BrandFilter";
import { ProductCard } from "@/components/products/ProductCard";
import { RevealGroup } from "@/components/ui/Reveal";
import { products } from "@/lib/data/products";

export function ProductsExplorer() {
  const [category, setCategory] = useState("all");
  const [brandIds, setBrandIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesBrand = brandIds.length === 0 || p.compatibleBrandIds.some((b) => brandIds.includes(b));
      return matchesCategory && matchesBrand;
    });
  }, [category, brandIds]);

  function toggleBrand(id: string) {
    setBrandIds((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  }

  return (
    <div>
      <CategoryGrid activeId={category} onSelect={setCategory} />

      <div className="mt-10 space-y-6">
        <CategoryFilter activeId={category} onChange={setCategory} />
        <BrandFilter activeIds={brandIds} onToggle={toggleBrand} />
      </div>

      <p className="text-steel-dark font-ui mt-8 text-xs tracking-wide uppercase">
        {filtered.length} part{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <p className="text-steel-dark mt-12 text-sm">
          No parts match those filters yet — send us an enquiry and we&apos;ll source it for you.
        </p>
      ) : (
        <RevealGroup
          className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          itemSelector=":scope > article"
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
