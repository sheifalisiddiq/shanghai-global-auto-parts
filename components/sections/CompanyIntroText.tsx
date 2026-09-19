"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { companyIntro } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function CompanyIntroText() {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-20 lg:py-28">
      <Container>
        <Reveal>
          <span className="font-ui text-brand-red mb-4 block text-xs tracking-[0.3em] uppercase">
            {t("home.intro.eyebrow", "Who We Are")}
          </span>
          <h2 className="font-display text-ink max-w-4xl text-3xl leading-[1.15] font-bold uppercase sm:text-4xl lg:text-5xl">
            {t("about.headline", companyIntro)}
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-6 max-w-2xl">
          <p className="text-steel-dark text-base leading-relaxed sm:text-lg">
            {t(
              "home.intro.copy",
              "Shanghai Global Auto Parts runs its own factories and partner OEM facilities across China, delivering original, OEM and precision aftermarket components to businesses across the UAE, GCC and worldwide.",
            )}
          </p>
          <Button href="/about" variant="outline" className="mt-8">
            {t("home.intro.cta", "Learn More About Us")}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
