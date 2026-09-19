"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function MissionVisionValues() {
  const { t } = useLanguage();

  const values = [
    t("about.values.v1", "Quality first"),
    t("about.values.v2", "Reliability"),
    t("about.values.v3", "Transparency"),
    t("about.values.v4", "Customer service"),
  ];

  return (
    <section className="bg-paper py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow={t("about.mvv.eyebrow", "Our Foundation")}
          title={t("about.mvv.title", "Mission, Vision & Values")}
        />
        <RevealGroup
          className="mt-12 grid gap-6 lg:grid-cols-3"
          itemSelector=":scope > div"
        >
          <div className="border-steel-light border-t-2 bg-white p-8">
            <h3 className="font-display text-ink text-2xl font-black uppercase">
              {t("about.mission.title", "Mission")}
            </h3>
            <p className="text-steel-dark mt-4 text-base leading-relaxed">
              {t(
                "about.mission.copy",
                "Supply original, OEM and reliable auto parts that meet strict quality standards, with simple ordering and dependable support.",
              )}
            </p>
          </div>
          <div className="border-steel-light border-t-2 bg-white p-8">
            <h3 className="font-display text-ink text-2xl font-black uppercase">
              {t("about.vision.title", "Vision")}
            </h3>
            <p className="text-steel-dark mt-4 text-base leading-relaxed">
              {t(
                "about.vision.copy",
                "Be the most trusted source of Chinese automotive parts for workshops and distributors worldwide.",
              )}
            </p>
          </div>
          <div className="border-brand-red bg-ink border-t-2 p-8">
            <h3 className="font-display text-2xl font-black text-white uppercase">
              {t("about.values.title", "Values")}
            </h3>
            <ul className="mt-4 space-y-3">
              {values.map((value) => (
                <li
                  key={value}
                  className="flex items-center gap-3 text-base text-white/80"
                >
                  <span className="bg-brand-red size-1.5 shrink-0 rounded-full" />
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </RevealGroup>
      </Container>
    </section>
  );
}
