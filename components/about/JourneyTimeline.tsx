"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Add a `year` to a step once the client confirms real dates.
const steps = [
  { id: "s1", title: "Sourcing from China", year: undefined as string | undefined },
  { id: "s2", title: "Own & partner OEM factories", year: undefined as string | undefined },
  { id: "s3", title: "Regional presence", year: undefined as string | undefined },
  { id: "s4", title: "Worldwide supply", year: undefined as string | undefined },
] as const;

export function JourneyTimeline() {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow={t("about.timeline.eyebrow", "Our Journey")}
          title={t("about.timeline.title", "How We Grew")}
        />
        <RevealGroup
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          itemSelector=":scope > div"
        >
          {steps.map((step, i) => (
            <div key={step.id} className="border-steel-light border-t-2 pt-6">
              <span className="font-display text-brand-red text-sm font-black" dir="ltr">
                {step.year ?? String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-ink mt-2 text-xl leading-tight font-bold uppercase">
                {t(`about.timeline.${step.id}.title` as never, step.title)}
              </h3>
              <p className="text-steel-dark mt-3 text-sm leading-relaxed">
                {t(`about.timeline.${step.id}.copy` as never)}
              </p>
            </div>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
