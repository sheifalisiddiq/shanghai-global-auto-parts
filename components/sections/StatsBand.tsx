"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, registerGSAP } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Container } from "@/components/ui/Container";
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
        start: "top top",
        end: "+=120%",
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          animatable.forEach((stat) => {
            const el = counterRefs.current[stat.id];
            if (!el) return;
            const value = Math.round(stat.value * self.progress);
            el.textContent = `${value.toLocaleString()}${stat.suffix}`;
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
    <section ref={sectionRef} className="bg-ink relative py-20 lg:py-0">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-12 lg:h-screen lg:grid-cols-4 lg:content-center lg:gap-8">
        {animatable.map((stat) => (
          <div key={stat.id} className="border-l-2 border-brand-red pl-4 sm:pl-6">
            <span
              ref={(el) => {
                counterRefs.current[stat.id] = el;
              }}
              className="font-display block text-4xl font-black text-white sm:text-6xl lg:text-7xl"
            >
              0{stat.suffix}
            </span>
            <span className="font-ui text-white/50 mt-2 block text-[11px] tracking-[0.2em] uppercase sm:text-xs">
              {stat.label}
            </span>
          </div>
        ))}

        {staticStat && (
          <div className="border-l-2 border-brand-red pl-4 sm:pl-6">
            <span className="font-display block text-4xl font-black text-white sm:text-6xl lg:text-7xl">
              {staticStat.value}
              {staticStat.suffix}
            </span>
            <span className="font-ui text-white/50 mt-2 block text-[11px] tracking-[0.2em] uppercase sm:text-xs">
              {staticStat.label}
            </span>
          </div>
        )}
      </Container>
    </section>
  );
}
