"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function AboutHero() {
  const { t } = useLanguage();

  return (
    <section className="relative flex min-h-[520px] items-center overflow-hidden bg-slate-950 py-16 text-white sm:py-24 lg:min-h-[600px] lg:py-28">
      <Image
        src="/images/about/factory-line.jpg"
        alt={t(
          "about.hero.imageAlt",
          "OEM factory production line manufacturing automotive components",
        )}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-slate-950/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/25" />

      <Container className="relative z-10 w-full">
        <div className="max-w-3xl">
          <span className="font-ui border-brand-red/30 bg-brand-red/10 text-brand-red mb-4 inline-flex items-center rounded-full border px-3.5 py-1 text-xs tracking-widest uppercase backdrop-blur-sm">
            {t("about.eyebrow", "About Shanghai Global")}
          </span>
          <h1 className="font-display text-4xl leading-[0.95] font-black uppercase drop-shadow-lg sm:text-6xl lg:text-7xl">
            {t("about.hero.title", "Built On Trust. Driven By Parts.")}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 drop-shadow-md sm:text-lg">
            {t(
              "about.subtitle",
              "Delivering original, OEM, and precision aftermarket automotive components across the UAE, GCC, and worldwide.",
            )}
          </p>
        </div>
      </Container>
    </section>
  );
}
