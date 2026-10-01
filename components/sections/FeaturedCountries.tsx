"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { servedCountries } from "@/lib/data/countries";
import { stats } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const animatable = stats.filter((s) => s.suffix === "+" || s.suffix === "%");

export function FeaturedCountries() {
  const { t, isRTL } = useLanguage();
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
              duration: 3,
              ease: "expo.out", // races up, then crawls the last few digits
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
    <section ref={sectionRef} className="relative overflow-hidden bg-ink py-12 lg:py-16">
      <Globe />

      <Container className="relative">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
          <Reveal variant="mask" y={40}>
            <span className="font-ui mb-2 block text-xs tracking-[0.25em] text-white/60 uppercase">
              {t("home.countries.eyebrow", "Global Reach")}
            </span>
            <h2 className="font-display text-3xl leading-[0.95] font-black tracking-[-0.005em] text-white uppercase sm:text-4xl sm:tracking-[-0.02em]">
              {t("home.countries.title", "Countries We Serve")}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-300">
              {t(
                "home.countries.copy",
                "Regular shipments across the GCC and beyond. More markets on request.",
              )}
            </p>
          </Reveal>

          <RevealGroup
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            itemSelector=":scope > div"
            variant="scale"
            stagger={0.1}
          >
            {stats.map((stat) => {
              const isAnimated = animatable.includes(stat);
              return (
                <div
                  key={stat.id}
                  className="group border-brand-red/70 hover:border-brand-red border-s-2 ps-4 transition-colors"
                >
                  <span
                    ref={
                      isAnimated
                        ? (el) => {
                            counterRefs.current[stat.id] = el;
                          }
                        : undefined
                    }
                    className="font-display block text-3xl font-black tracking-[-0.01em] text-white sm:text-4xl"
                    dir={isAnimated || !isRTL ? "ltr" : "rtl"}
                  >
                    {isAnimated
                      ? `0${stat.suffix}`
                      : stat.id === "response"
                        ? t("misc.stats.responseValue", stat.displayValue)
                        : (stat.displayValue ?? `${stat.value}${stat.suffix}`)}
                  </span>
                  <span className="font-ui mt-1 block text-[10px] tracking-[0.18em] text-white/55 uppercase sm:text-[11px]">
                    {t(`stats.${stat.id}` as never, stat.label)}
                  </span>
                </div>
              );
            })}
          </RevealGroup>
        </div>

        <RevealGroup
          className="mt-8 flex flex-wrap gap-2.5 border-t border-white/10 pt-6"
          itemSelector=":scope > div"
          stagger={0.07}
          y={16}
        >
          {servedCountries.map((country) => (
            <div
              key={country.id}
              className="group flex cursor-default items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] py-1.5 ps-1.5 pe-4 transition-all duration-300 hover:border-brand-red hover:bg-brand-red/15"
            >
              <span
                dir="ltr"
                className="font-display relative flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-black text-white transition-colors duration-300 group-hover:bg-brand-red"
              >
                {country.code}
              </span>
              <span className="text-sm font-semibold text-white">
                {t(`home.countries.${country.id}` as never, country.name)}
              </span>
            </div>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

/** Decorative wireframe globe, drifts slowly behind the heading. */
function Globe() {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(
    () => {
      registerGSAP();
      if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(ref.current, { rotation: 360, duration: 120, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
    },
    { scope: ref },
  );
  const dots = [
    [200, 140],
    [250, 190],
    [160, 220],
    [270, 260],
    [190, 300],
    [230, 120],
  ];
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 400 400"
      className="pointer-events-none absolute -top-20 -right-32 size-[300px] fill-none stroke-white/10 sm:-right-16 lg:-top-24 lg:-right-10 lg:size-[400px]"
      strokeWidth="1"
    >
      <circle cx="200" cy="200" r="190" />
      {[40, 80, 120, 160].map((ry) => (
        <ellipse key={ry} cx="200" cy="200" rx="190" ry={ry} />
      ))}
      {[40, 80, 120, 160].map((rx) => (
        <ellipse key={rx} cx="200" cy="200" rx={rx} ry="190" />
      ))}
      {dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" className="fill-brand-red stroke-none" />
      ))}
    </svg>
  );
}
