"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { companyIntro, solutions, whatWeDo } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const network = whatWeDo.find((item) => item.id === "network")!;

export function StoryIntro() {
  const { t } = useLanguage();

  const bullets = [
    t("solutions.b1", solutions.bullets[0]),
    t("solutions.b2", solutions.bullets[1]),
    t("solutions.b3", solutions.bullets[2]),
    t("solutions.b4", solutions.bullets[3]),
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <span className="font-ui text-brand-red mb-4 block text-xs tracking-[0.3em] uppercase">
            {t("about.intro.eyebrow", "Who We Are")}
          </span>
          <p className="font-display text-ink text-3xl leading-[1.15] font-bold uppercase sm:text-4xl">
            {t("about.headline", companyIntro)}
          </p>
          <p className="text-steel-dark mt-6 max-w-lg text-base leading-relaxed">
            {t("whatWeDo.networkCopy", network.copy)}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="space-y-4">
            {bullets.map((bullet, i) => (
              <li
                key={i}
                className="border-steel-light text-ink flex items-start gap-4 border-t pt-4 text-base sm:text-lg"
              >
                <span className="font-display text-brand-red text-sm font-black" dir="ltr">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {bullet}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
