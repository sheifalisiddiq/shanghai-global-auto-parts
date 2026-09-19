"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { stats } from "@/lib/data/company";

const animatable = stats.filter((s) => s.suffix === "+" || s.suffix === "%");
const staticStat = stats.find((s) => !(s.suffix === "+" || s.suffix === "%"));

export function StatsBand() {
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

  const { t } = useLanguage();

  return (
    <section ref={sectionRef} className="bg-ink relative py-14 lg:py-20">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-8">
        {animatable.map((stat) => (
          <div key={stat.id} className="border-l-2 rtl:border-l-0 rtl:border-r-2 border-brand-red pl-4 sm:pl-6 rtl:pl-0 rtl:pr-4 sm:rtl:pr-6">
            <span
              ref={(el) => {
                counterRefs.current[stat.id] = el;
              }}
              className="font-display block text-4xl font-black text-white sm:text-6xl lg:text-7xl"
            >
              0{stat.suffix}
            </span>
            <span className="font-ui text-white/50 mt-2 block text-[11px] tracking-[0.2em] uppercase sm:text-xs">
              {t(`stats.${stat.id}` as any, stat.label)}
            </span>
          </div>
        ))}

        {staticStat && (
          <div className="border-l-2 rtl:border-l-0 rtl:border-r-2 border-brand-red pl-4 sm:pl-6 rtl:pl-0 rtl:pr-4 sm:rtl:pr-6">
            <span className="font-display block text-4xl font-black text-white sm:text-6xl lg:text-7xl" dir="ltr">
              {staticStat.displayValue || `${staticStat.value}${staticStat.suffix}`}
            </span>
            <span className="font-ui text-white/50 mt-2 block text-[11px] tracking-[0.2em] uppercase sm:text-xs">
              {t(`stats.${staticStat.id}` as any, staticStat.label)}
            </span>
          </div>
        )}
      </Container>
    </section>
  );
}
