"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGSAP } from "@/lib/gsap/registerGSAP";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
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
  const sectionRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGSAP();
      if (!sectionRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Red progress line draws as the timeline scrolls through the viewport.
      gsap.fromTo(
        fillRef.current,
        { scale: 0 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current.querySelector("[data-steps]"),
            start: "top 70%",
            end: "bottom 60%",
            scrub: true,
          },
        },
      );

      // Each step lights up as it arrives.
      gsap.utils.toArray<HTMLElement>("[data-step]", sectionRef.current).forEach((step) => {
        const dot = step.querySelector("[data-dot]");
        const card = step.querySelector("[data-card]");
        gsap.set(card, { opacity: 0, y: 40 });
        gsap.timeline({
          scrollTrigger: { trigger: step, start: "top 80%", once: true },
        })
          .to(card, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
          .fromTo(
            dot,
            { scale: 0.4, backgroundColor: "#ffffff" },
            { scale: 1, backgroundColor: "#EF0606", duration: 0.5, ease: "back.out(2.5)" },
            0,
          );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-white py-20 lg:py-28">
      <Container>
        <Reveal variant="mask" y={50}>
          <SectionHeading
            eyebrow={t("about.timeline.eyebrow", "Our Journey")}
            title={t("about.timeline.title", "How We Grew")}
          />
        </Reveal>

        <div data-steps className="relative mt-14 grid gap-10 lg:grid-cols-4 lg:gap-6">
          {/* Track: vertical on mobile, horizontal on desktop */}
          <div
            aria-hidden
            className="absolute start-[7px] top-2 bottom-2 w-px bg-slate-200 lg:start-0 lg:end-0 lg:bottom-auto lg:h-px lg:w-auto"
          >
            <div
              ref={fillRef}
              className="bg-brand-red absolute inset-0 origin-top scale-0 lg:origin-left rtl:lg:origin-right"
            />
          </div>

          {steps.map((step, i) => (
            <div key={step.id} data-step className="relative ps-10 lg:ps-0 lg:pt-12">
              <span
                data-dot
                aria-hidden
                className="absolute start-0 top-1.5 size-4 rounded-full border-2 border-brand-red bg-white lg:top-0"
              />
              <div
                data-card
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-paper p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-ink hover:bg-ink hover:shadow-2xl"
              >
                <span
                  aria-hidden
                  dir="ltr"
                  className="font-display pointer-events-none absolute -top-3 end-3 text-7xl leading-none font-black text-transparent transition-all duration-500 [-webkit-text-stroke:1.5px_rgba(0,0,0,0.10)] group-hover:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.2)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-brand-red relative text-sm font-black" dir="ltr">
                  {step.year ?? String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-ink relative mt-2 text-xl leading-tight font-bold uppercase tracking-[-0.005em] transition-colors duration-500 group-hover:text-white sm:tracking-[-0.02em]">
                  {t(`about.timeline.${step.id}.title` as never, step.title)}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-slate-600 transition-colors duration-500 group-hover:text-white/75">
                  {t(`about.timeline.${step.id}.copy` as never)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
