"use client";

import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { ScrubText } from "@/components/ui/ScrubText";
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
    <section className="bg-white py-16 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <span className="font-ui text-brand-red mb-5 flex items-center gap-3 text-xs tracking-[0.3em] uppercase">
              <span aria-hidden className="bg-brand-red h-px w-10" />
              {t("about.intro.eyebrow", "Who We Are")}
            </span>
          </Reveal>
          <ScrubText
            as="h2"
            text={t("about.headline", companyIntro)}
            className="font-display text-ink text-3xl leading-[1.15] font-bold uppercase tracking-[-0.005em] sm:tracking-[-0.02em] sm:text-4xl"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600">
              {t("whatWeDo.networkCopy", network.copy)}
            </p>
          </Reveal>
        </div>

        <RevealGroup className="grid content-start gap-3" itemSelector=":scope > div" stagger={0.12} y={30}>
          {bullets.map((bullet, i) => (
            <div
              key={i}
              className="group relative flex items-center gap-5 overflow-hidden rounded-xl border border-slate-200 bg-paper px-5 py-5 transition-colors duration-500 hover:border-ink sm:px-6"
            >
              <span
                aria-hidden
                className="bg-ink absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 rtl:origin-right"
              />
              <span
                dir="ltr"
                className="font-display relative text-4xl leading-none font-black text-transparent transition-all duration-500 [-webkit-text-stroke:1.5px_var(--color-brand-red)] group-hover:text-brand-red"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-ink relative text-base font-semibold transition-colors duration-500 group-hover:text-white sm:text-lg">
                {bullet}
              </span>
            </div>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
