"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/products/Breadcrumbs";
import { EnquireSection } from "@/components/products/EnquireSection";
import { ProductCard } from "@/components/products/ProductCard";
import { categories } from "@/lib/data/categories";
import {
  brandName,
  categoryDescKey,
  categoryKey,
  getBrand,
  getFitment,
  getModelBySlug,
  getPartUrl,
  getProductBySlug,
  getRelatedParts,
  getSku,
  splitSpec,
} from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function PartDetail({
  brandId,
  modelSlug,
  partSlug,
}: {
  brandId: string;
  modelSlug: string;
  partSlug: string;
}) {
  const { t, isRTL } = useLanguage();
  const product = getProductBySlug(partSlug);
  const brand = getBrand(brandId);
  const model = getModelBySlug(brandId, modelSlug);
  if (!product || !brand || !model) return null;

  const bName = brandName(brand, isRTL);
  const name = isRTL && product.nameAr ? product.nameAr : product.name;
  const shortSpec = isRTL && product.shortSpecAr ? product.shortSpecAr : product.shortSpec;
  const category = categories.find((c) => c.id === product.category);
  const sku = getSku(product);
  const fitment = getFitment(product);
  const related = getRelatedParts(product, brandId, modelSlug);

  const whatsappText = encodeURIComponent(
    `Hi Shanghai Global, I'd like a quote for ${product.name} (${sku}) for ${brand.name} ${model}.`,
  );

  return (
    <>
      <section className="bg-white pt-8 pb-14 lg:pb-20">
        <Container>
          <Breadcrumbs
            items={[
              { label: t("products.crumbHome"), href: "/" },
              { label: t("products.crumbProducts"), href: "/products" },
              { label: bName, href: `/products/${brandId}` },
              { label: model, href: `/products/${brandId}/${modelSlug}` },
              { label: name },
            ]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="bg-paper relative aspect-square overflow-hidden">
              <Image
                src={product.image.src}
                alt={product.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div>
              {category && (
                <p className="font-ui text-brand-red text-xs tracking-[0.2em] uppercase">
                  {t(categoryKey(category.id), category.label)}
                </p>
              )}
              <h1 className="h1-page text-ink mt-3">
                {name}
              </h1>
              <p className="font-ui text-steel-dark mt-3 text-xs tracking-wide uppercase">
                {t("products.sku")}: <span className="text-ink">{sku}</span>
              </p>

              <p className="text-steel-dark mt-6 text-sm leading-relaxed sm:text-base">
                {t(categoryDescKey(product.category))} {t("products.qualityNote")}
              </p>

              <h2 className="font-ui text-ink mt-8 text-xs tracking-wide uppercase">
                {t("products.specs")}
              </h2>
              <ul className="mt-3 space-y-2">
                {splitSpec(shortSpec).map((line) => (
                  <li key={line} className="text-steel-dark flex items-start gap-2 text-sm">
                    <CheckCircle2 className="text-brand-red mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <h2 className="font-ui text-ink mt-8 text-xs tracking-wide uppercase">
                {t("products.confirmedFitment")}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {fitment.map((f) => {
                  const fBrand = getBrand(f.brandId);
                  const current = f.brandId === brandId && f.modelSlug === modelSlug;
                  return (
                    <li key={`${f.brandId}/${f.modelSlug}`}>
                      <Link
                        href={getPartUrl(product, f.brandId, f.modelSlug)}
                        aria-current={current ? "page" : undefined}
                        className={`font-ui inline-flex items-center border px-3 py-1.5 text-[11px] tracking-wide uppercase transition-colors ${
                          current
                            ? "border-ink bg-ink text-white"
                            : "border-steel-light text-steel-dark hover:border-ink hover:text-ink"
                        }`}
                      >
                        {fBrand ? brandName(fBrand, isRTL) : f.brandId} {f.model}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className="text-steel-dark mt-3 text-xs leading-relaxed">
                {t("products.fitmentNote")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#enquire">{t("products.enquireBtn")}</Button>
                <a
                  href={`https://wa.me/97165335866?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui border-ink text-ink hover:bg-ink inline-flex items-center gap-2 border px-6 py-3.5 text-sm tracking-wide uppercase transition-colors hover:text-white"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  {t("products.whatsappBtn")}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-paper py-14 lg:py-20">
          <Container>
            <SectionHeading title={t("products.related")} />
            <RevealGroup
              className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
              itemSelector=":scope > article"
            >
              {related.map((p) => {
                const match =
                  getFitment(p).find((f) => f.brandId === brandId && f.modelSlug === modelSlug) ??
                  getFitment(p).find((f) => f.brandId === brandId) ??
                  getFitment(p)[0];
                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    href={match ? getPartUrl(p, match.brandId, match.modelSlug) : null}
                  />
                );
              })}
            </RevealGroup>
          </Container>
        </section>
      )}

      <EnquireSection />
    </>
  );
}
