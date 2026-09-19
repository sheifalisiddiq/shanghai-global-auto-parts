"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CategoryGrid } from "@/components/products/CategoryGrid";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { BrandFilter } from "@/components/products/BrandFilter";
import { ModelFilter } from "@/components/products/ModelFilter";
import { ProductSearch } from "@/components/products/ProductSearch";
import { SortSelect, type SortValue } from "@/components/products/SortSelect";
import { Pagination } from "@/components/products/Pagination";
import { ProductCard } from "@/components/products/ProductCard";
import { RevealGroup } from "@/components/ui/Reveal";
import { carBrands } from "@/lib/data/brands";
import { categories } from "@/lib/data/categories";
import {
  brandName,
  getFitment,
  getPartUrl,
  getPartUrlForBrand,
  getPrimaryPartUrl,
  getSku,
} from "@/lib/data/catalog";
import { products, type Product } from "@/lib/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const PAGE_SIZE = 12;
const SORTS: SortValue[] = ["featured", "az", "za"];

export function ProductsExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { t, isRTL } = useLanguage();

  // URL is the single source of truth for every filter except the live search text.
  const category = searchParams.get("category") || "all";
  const brandIds = (searchParams.get("brand") || searchParams.get("make") || "")
    .toLowerCase()
    .split(",")
    .filter((id) => carBrands.some((b) => b.id === id));
  const model = searchParams.get("model") || "";
  const sortParam = searchParams.get("sort") as SortValue | null;
  const sort: SortValue = sortParam && SORTS.includes(sortParam) ? sortParam : "featured";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const qParam = searchParams.get("q") || "";

  const setParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      next.delete("make"); // legacy alias, folded into "brand"
      for (const [key, value] of Object.entries(updates)) {
        const isDefault =
          value === null ||
          value === "" ||
          (key === "category" && value === "all") ||
          (key === "sort" && value === "featured") ||
          (key === "page" && value === "1");
        if (isDefault) next.delete(key);
        else next.set(key, value as string);
      }
      if (!("page" in updates)) next.delete("page");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Live search text, pushed to the URL after a short pause.
  const [q, setQ] = useState(qParam);
  const lastPushedQ = useRef(qParam);
  useEffect(() => {
    if (qParam !== lastPushedQ.current) {
      lastPushedQ.current = qParam;
      setQ(qParam);
    }
  }, [qParam]);
  useEffect(() => {
    if (q === lastPushedQ.current) return;
    const timer = setTimeout(() => {
      lastPushedQ.current = q;
      setParams({ q: q.trim() ? q : null });
    }, 250);
    return () => clearTimeout(timer);
  }, [q, setParams]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const [modelBrand, modelSlug] = model.split("/");

    const list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (brandIds.length && !p.compatibleBrandIds.some((b) => brandIds.includes(b))) return false;
      // Strict fitment: a part only matches a model it is confirmed to fit.
      if (
        model &&
        !getFitment(p).some((f) => f.brandId === modelBrand && f.modelSlug === modelSlug)
      ) {
        return false;
      }
      if (needle) {
        const brandNames = p.compatibleBrandIds.flatMap((id) => {
          const b = carBrands.find((x) => x.id === id);
          return b ? [b.name, brandName(b, true)] : [];
        });
        const catLabel = categories.find((c) => c.id === p.category)?.label ?? "";
        const haystack = [p.name, p.nameAr, p.shortSpec, p.shortSpecAr, getSku(p), catLabel, ...brandNames]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    const locale = isRTL ? "ar" : "en";
    const label = (p: Product) => (isRTL && p.nameAr ? p.nameAr : p.name);
    if (sort === "az") return [...list].sort((a, b) => label(a).localeCompare(label(b), locale));
    if (sort === "za") return [...list].sort((a, b) => label(b).localeCompare(label(a), locale));
    return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [brandIds, category, isRTL, model, q, sort]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const filtersActive = category !== "all" || brandIds.length > 0 || !!model || q.trim() !== "";

  const resultsRef = useRef<HTMLDivElement>(null);

  function toggleBrand(id: string) {
    const next = brandIds.includes(id) ? brandIds.filter((b) => b !== id) : [...brandIds, id];
    const modelStillValid = !model || next.length === 0 || next.includes(model.split("/")[0]);
    setParams({
      brand: next.join(",") || null,
      model: modelStillValid ? model : null,
    });
  }

  function clearFilters() {
    setQ("");
    lastPushedQ.current = "";
    router.replace(pathname, { scroll: false });
  }

  function goToPage(next: number) {
    setParams({ page: String(next) });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cardHref(p: Product): string | null {
    if (model) {
      const [b, m] = model.split("/");
      return getPartUrl(p, b, m);
    }
    if (brandIds.length === 1) {
      return getPartUrlForBrand(p, brandIds[0]) ?? getPrimaryPartUrl(p);
    }
    return getPrimaryPartUrl(p);
  }

  return (
    <div>
      <CategoryGrid activeId={category} onSelect={(id) => setParams({ category: id })} />

      <div ref={resultsRef} className="mt-10 scroll-mt-24 space-y-6">
        <ProductSearch value={q} onChange={setQ} />
        <CategoryFilter activeId={category} onChange={(id) => setParams({ category: id })} />
        <BrandFilter activeIds={brandIds} onToggle={toggleBrand} />
        <ModelFilter
          brandIds={brandIds}
          value={model}
          onChange={(value) => setParams({ model: value || null })}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-steel-dark font-ui text-xs tracking-wide uppercase">
          {results.length} {results.length === 1 ? t("products.part") : t("products.parts")}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-ui text-brand-red text-xs tracking-wide uppercase underline-offset-4 hover:underline"
            >
              {t("products.clearFilters")}
            </button>
          )}
          <SortSelect value={sort} onChange={(value) => setParams({ sort: value })} />
        </div>
      </div>

      {results.length === 0 ? (
        <p className="text-steel-dark mt-12 text-sm">{t("products.noResults")}</p>
      ) : (
        <>
          <RevealGroup
            key={`${category}-${brandIds.join()}-${model}-${q}-${sort}-${currentPage}`}
            className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            itemSelector=":scope > article"
          >
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} href={cardHref(product)} />
            ))}
          </RevealGroup>
          <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
        </>
      )}
    </div>
  );
}
