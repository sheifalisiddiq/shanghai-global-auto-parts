"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs, PageHero } from "@/components/products/Breadcrumbs";
import { ModelTiles } from "@/components/products/ModelTiles";
import { ProductCard } from "@/components/products/ProductCard";
import {
  brandDescription,
  brandName,
  brandTagline,
  getBrand,
  getPartUrlForBrand,
  getPartsForBrand,
} from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function BrandView({ brandId }: { brandId: string }) {
  const { t, isRTL } = useLanguage();
  const brand = getBrand(brandId);
  if (!brand) return null;

  const name = brandName(brand, isRTL);
  const parts = getPartsForBrand(brandId);

  return (
    <>
      <PageHero>
        <Breadcrumbs
          tone="dark"
          items={[
            { label: t("products.crumbHome"), href: "/" },
            { label: t("products.crumbProducts"), href: "/products" },
            { label: name },
          ]}
        />
        <div className="mt-8 flex flex-wrap items-center gap-6">
          {brand.logo && (
            <span className="flex size-20 items-center justify-center bg-white p-3">
              <Image
                src={brand.logo.src}
                alt=""
                width={64}
                height={64}
                className="max-h-12 w-auto object-contain"
              />
            </span>
          )}
          <div className="max-w-2xl">
            <p className="font-ui text-brand-red text-xs tracking-[0.2em] uppercase">
              {brandTagline(brand, isRTL)}
            </p>
            <h1 className="font-display mt-2 text-3xl leading-[1.05] font-black uppercase sm:text-5xl">
              {name}
            </h1>
          </div>
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
          {brandDescription(brand, isRTL)}
        </p>
      </PageHero>

      <section className="bg-paper py-14 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow={`${brand.models?.length ?? 0} ${t("products.modelsCount")}`}
            title={t("products.brandModels")}
          />
          <p className="text-steel-dark mt-4 max-w-2xl text-sm">{t("products.brandModelsIntro")}</p>
          <div className="mt-8">
            <ModelTiles brandId={brandId} />
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow={t("catalog.eyebrow")}
            title={`${t("products.partsForBrand")} ${name}`}
          />
          <RevealGroup
            className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            itemSelector=":scope > article"
          >
            {parts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                href={getPartUrlForBrand(product, brandId)}
              />
            ))}
          </RevealGroup>
          <Button href="/products#enquire" className="mt-10 inline-flex">
            {t("products.enquireModel")}
          </Button>
        </Container>
      </section>
    </>
  );
}
