"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs, PageHero } from "@/components/products/Breadcrumbs";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { ModelTiles } from "@/components/products/ModelTiles";
import { ProductCard } from "@/components/products/ProductCard";
import {
  brandName,
  getBrand,
  getModelBySlug,
  getPartUrl,
  getPartsForModel,
} from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function ModelView({ brandId, modelSlug }: { brandId: string; modelSlug: string }) {
  const { t, isRTL } = useLanguage();
  const [category, setCategory] = useState("all");

  const brand = getBrand(brandId);
  const model = getModelBySlug(brandId, modelSlug);
  if (!brand || !model) return null;

  const bName = brandName(brand, isRTL);
  const allParts = getPartsForModel(brandId, modelSlug);
  const categoryIds = [...new Set(allParts.map((p) => p.category))];
  const parts = category === "all" ? allParts : allParts.filter((p) => p.category === category);

  return (
    <>
      <PageHero>
        <Breadcrumbs
          tone="dark"
          items={[
            { label: t("products.crumbHome"), href: "/" },
            { label: t("products.crumbProducts"), href: "/products" },
            { label: bName, href: `/products/${brandId}` },
            { label: model },
          ]}
        />
        <p className="font-ui text-brand-red mt-8 text-xs tracking-[0.2em] uppercase">{bName}</p>
        <h1 className="font-display mt-2 text-3xl leading-[1.05] font-black uppercase sm:text-5xl">
          {model}
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
          {allParts.length} {t("products.confirmedParts")}
        </p>
      </PageHero>

      <section className="bg-white py-14 lg:py-20">
        <Container>
          {allParts.length === 0 ? (
            <div className="border-steel-light max-w-2xl border p-8">
              <p className="text-steel-dark text-sm leading-relaxed">{t("products.noFitment")}</p>
              <Button href="/products#enquire" className="mt-6 inline-flex">
                {t("products.enquireModel")}
              </Button>
            </div>
          ) : (
            <>
              <SectionHeading
                eyebrow={t("catalog.eyebrow")}
                title={`${t("products.partsForModel")} ${model}`}
              />
              {categoryIds.length > 1 && (
                <div className="mt-6">
                  <CategoryFilter activeId={category} onChange={setCategory} onlyIds={categoryIds} />
                </div>
              )}
              <RevealGroup
                key={category}
                className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                itemSelector=":scope > article"
              >
                {parts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    href={getPartUrl(product, brandId, modelSlug)}
                  />
                ))}
              </RevealGroup>
              <p className="text-steel-dark mt-8 max-w-2xl text-xs leading-relaxed">
                {t("products.fitmentNote")}
              </p>
            </>
          )}
        </Container>
      </section>

      <section className="bg-paper py-14 lg:py-20">
        <Container>
          <SectionHeading title={t("products.otherModels")} />
          <div className="mt-8">
            <ModelTiles brandId={brandId} excludeSlug={modelSlug} />
          </div>
        </Container>
      </section>
    </>
  );
}
