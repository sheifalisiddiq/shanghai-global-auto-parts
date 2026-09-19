"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { servedCountries } from "@/lib/data/countries";
import { stats } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const animatable = stats.filter((s) => s.suffix === "+" || s.suffix === "%");

export function FeaturedCountries() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const counterRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGSAP();

      if (reducedMotion) {
        animatable.forEach((stat) => {
          const el = counterRefs.current[stat.id];
          if (el) el.textContent = `${stat.value.toLocaleString()}${stat.suffix}`;
        });
        return;
      }

      animatable.forEach((stat) => {
        const el = counterRefs.current[stat.id];
        if (el) el.textContent = `0${stat.suffix}`;
      });

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          animatable.forEach((stat) => {
            const el = counterRefs.current[stat.id];
            if (!el) return;
            const counter = { value: 0 };
            gsap.to(counter, {
              value: stat.value,
              duration: 1.4,
              ease: "power4.out",
              onUpdate: () => {
                el.textContent = `${Math.round(counter.value).toLocaleString()}${stat.suffix}`;
              },
            });
          });
        },
      });

      return () => {
        st.kill();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section ref={sectionRef} className="bg-ink py-20 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal>
          <SectionHeading
            tone="white"
            eyebrow={t("home.countries.eyebrow", "Global Reach")}
            title={t("home.countries.title", "Countries We Serve")}
            description={t(
              "home.countries.copy",
              "Regular shipments across the GCC and beyond. More markets on request.",
            )}
          />
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12">
            {stats.map((stat) => {
              const isAnimated = animatable.includes(stat);
              return (
                <div key={stat.id} className="border-brand-red border-s-2 ps-4 sm:ps-6">
                  <span
                    ref={
                      isAnimated
                        ? (el) => {
                            counterRefs.current[stat.id] = el;
                          }
                        : undefined
                    }
                    className="font-display block text-4xl font-black text-white sm:text-5xl"
                    dir="ltr"
                  >
                    {isAnimated
                      ? `0${stat.suffix}`
                      : (stat.displayValue ?? `${stat.value}${stat.suffix}`)}
                  </span>
                  <span className="font-ui mt-2 block text-[11px] tracking-[0.2em] text-white/50 uppercase sm:text-xs">
                    {t(`stats.${stat.id}` as never, stat.label)}
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>

        <RevealGroup
          className="grid content-start gap-3 sm:grid-cols-2"
          itemSelector=":scope > div"
        >
          {servedCountries.map((country) => (
            <div
              key={country.id}
              className="flex items-center gap-4 border border-white/15 px-5 py-4"
            >
              <span
                className="font-display text-brand-red text-lg font-black"
                dir="ltr"
              >
                {country.code}
              </span>
              <span className="text-base text-white">
                {t(`home.countries.${country.id}` as never, country.name)}
              </span>
            </div>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
