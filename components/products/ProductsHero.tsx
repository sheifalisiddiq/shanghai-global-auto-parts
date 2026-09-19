"use client";

import { Container } from "@/components/ui/Container";
import { carBrands } from "@/lib/data/brands";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function ProductsHero() {
  const { t } = useLanguage();
  const stats = [
    { value: carBrands.length, label: t("products.statBrands") },
    { value: products.length, label: t("products.statParts") },
    { value: categories.length, label: t("products.statCategories") },
  ];

  return (
    <section className="bg-ink relative overflow-hidden py-16 text-white sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <Container className="relative z-10">
        <div className="max-w-3xl">
          <p className="font-ui text-brand-red text-xs tracking-[0.2em] uppercase">
            {t("products.heroEyebrow")}
          </p>
          <h1 className="font-display mt-4 text-3xl leading-[1.05] font-black uppercase sm:text-5xl lg:text-6xl">
            {t("products.heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            {t("products.heroIntro")}
          </p>
        </div>

        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="font-ui text-[11px] tracking-wide text-white/50 uppercase">{s.label}</dt>
              <dd className="font-display mt-1 text-3xl font-black">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
