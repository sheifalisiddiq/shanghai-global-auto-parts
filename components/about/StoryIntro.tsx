"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { companyIntro } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function StoryIntro() {
  const { t } = useLanguage();

  return (
    <section className="bg-white pt-16 pb-20 lg:pt-24 lg:pb-28">
      <Container>
        <Reveal>
          <span className="font-ui text-brand-red mb-4 block text-xs tracking-[0.3em] uppercase">
            {t("about.eyebrow", "About Shanghai Global")}
          </span>
          <p className="font-display text-ink max-w-4xl text-3xl leading-[1.15] font-bold uppercase sm:text-4xl lg:text-5xl">
            {t("about.headline", companyIntro)}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-6 max-w-2xl">
          <p className="text-steel-dark text-base leading-relaxed sm:text-lg">
            {t(
              "about.subtitle",
              "Delivering original, OEM, and precision aftermarket automotive components across the UAE, GCC, and worldwide.",
            )}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
