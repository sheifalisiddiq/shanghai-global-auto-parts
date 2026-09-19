"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { solutions } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function CapabilityList() {
  const { t } = useLanguage();

  const bullets = [
    t("solutions.b1", solutions.bullets[0]),
    t("solutions.b2", solutions.bullets[1]),
    t("solutions.b3", solutions.bullets[2]),
    t("solutions.b4", solutions.bullets[3]),
  ];

  return (
    <section className="bg-paper py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow={t("about.whyChooseUs", "Why Choose Us")}
          title={t("about.whatSetsUsApart", "What Sets Us Apart")}
        />
        <RevealGroup
          className="mt-12 grid gap-6 sm:grid-cols-2"
          itemSelector=":scope > div"
        >
          {bullets.map((bullet, i) => (
            <div key={i} className="border-steel-light border-t pt-6">
              <span className="font-display text-brand-red text-sm font-black" dir="ltr">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-ink mt-2 text-base sm:text-lg">{bullet}</p>
            </div>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
