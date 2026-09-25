"use client";

import { Container } from "@/components/ui/Container";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function ProductsHero() {
  const { t } = useLanguage();

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
          <h1 className="h1-page mt-4">
            {t("products.heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            {t("products.heroIntro")}
          </p>
        </div>
      </Container>
    </section>
  );
}
