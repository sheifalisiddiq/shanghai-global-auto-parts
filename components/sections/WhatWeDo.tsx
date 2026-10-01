"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { Button } from "@/components/ui/Button";
import { whatWeDo } from "@/lib/data/company";

import { useLanguage } from "@/lib/i18n/LanguageContext";

const DIM = 0.3;

function WhatWeDoItem({
  item,
  hideNumberOnDesktop,
}: {
  item: (typeof whatWeDo)[number];
  hideNumberOnDesktop?: boolean;
}) {
  const { t } = useLanguage();
  const title = t(`whatWeDo.${item.id}Title` as any, item.title);
  const copy = t(`whatWeDo.${item.id}Copy` as any, item.copy);
  const ctaLabel = item.cta ? t("whatWeDo.enquireNow", item.cta.label) : null;

  return (
    <>
      <div>
        <span
          className={`font-display text-brand-red mb-3 block text-sm font-black tracking-[0.2em] ${
            hideNumberOnDesktop ? "lg:hidden" : ""
          }`}
        >
          {item.index}
        </span>
        <h3 className="font-ui text-lg tracking-wide text-white uppercase lg:text-2xl">{title}</h3>
      </div>
      <div>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">{copy}</p>
        {item.cta && (
          <Button
            href={item.cta.href}
            variant="outline"
            className="mt-6 border-white px-5 py-3 text-xs text-white hover:bg-white hover:text-ink"
          >
            {ctaLabel}
          </Button>
        )}
      </div>
    </>
  );
}

function Backdrop() {
  return (
    <>
      <Parallax className="absolute inset-0" speed={12}>
        <Image
          src="/images/warehouse/qc-technician.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </Parallax>
      <div aria-hidden className="absolute inset-0 bg-slate-950/90" />
    </>
  );
}

export function WhatWeDo() {
  const { t, isRTL } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const numRefs = useRef<HTMLSpanElement[]>([]);
  const itemRefs = useRef<HTMLElement[]>([]);
  const lineRefs = useRef<HTMLSpanElement[]>([]);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGSAP();
      if (reducedMotion || !sectionRef.current) return;
      const dir = isRTL ? -1 : 1;

      // Heading slides in from the inline-start edge, scrubbed to scroll.
      if (eyebrowRef.current && titleRef.current) {
        const scrub = { trigger: sectionRef.current, start: "top 85%", end: "top 35%", scrub: true };
        gsap.fromTo(eyebrowRef.current, { xPercent: -130 * dir }, { xPercent: 0, ease: "none", scrollTrigger: scrub });
        gsap.fromTo(titleRef.current, { xPercent: -60 * dir }, { xPercent: 0, ease: "none", scrollTrigger: scrub });
      }

      const items = itemRefs.current;
      items.forEach((item, i) => {
        if (!lineRefs.current[i]) return;
        gsap.fromTo(
          lineRefs.current[i],
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 85%", once: true },
          },
        );
      });

      // Desktop only: the big number on the sticky panel follows the step that's centred,
      // inactive steps dim back.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const nums = numRefs.current;
        if (!items.length || !nums.length) return;

        nums.forEach((n, i) => gsap.set(n, { yPercent: i === 0 ? 0 : 100, opacity: i === 0 ? 1 : 0 }));
        items.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : DIM, x: 0 }));
        if (barRef.current) gsap.set(barRef.current, { scaleX: 1 / items.length });

        items.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => {
              if (!self.isActive) return;
              nums.forEach((n, ni) => {
                gsap.to(n, {
                  yPercent: ni === i ? 0 : ni < i ? -100 : 100,
                  opacity: ni === i ? 1 : 0,
                  duration: 0.6,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              });
              items.forEach((el, ii) => {
                gsap.to(el, {
                  opacity: ii === i ? 1 : DIM,
                  x: ii === i ? 12 * dir : 0,
                  duration: 0.5,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              });
              if (barRef.current) {
                gsap.to(barRef.current, {
                  scaleX: (i + 1) / items.length,
                  duration: 0.6,
                  ease: "power3.out",
                });
              }
              if (counterRef.current) counterRef.current.textContent = String(i + 1).padStart(2, "0");
            },
          });
        });
        return () => {
          items.forEach((el) => gsap.set(el, { clearProps: "opacity,transform" }));
        };
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion, isRTL] },
  );

  if (reducedMotion) {
    return (
      <section className="relative overflow-clip bg-slate-950 py-16 lg:py-24">
        <Backdrop />
        <Container className="relative">
          <SectionHeading
            tone="white"
            eyebrow={t("whatWeDo.eyebrow", "What We Do")}
            title={t("whatWeDo.title", "Built Around Your Supply Chain")}
          />

          <RevealGroup className="mt-14 border-t border-white/15" itemSelector=":scope > article">
            {whatWeDo.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 border-b border-white/15 py-10 lg:grid-cols-[1.1fr_1.6fr] lg:items-start lg:gap-10"
              >
                <WhatWeDoItem item={item} />
              </article>
            ))}
          </RevealGroup>
        </Container>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative overflow-clip bg-slate-950 py-20 lg:py-28">
      <Backdrop />
      <Container className="relative">
        <div>
          <div className="overflow-hidden">
            <span
              ref={eyebrowRef}
              className="font-ui text-brand-red mb-3 block text-xs tracking-[0.25em] uppercase"
            >
              {t("whatWeDo.eyebrow", "What We Do")}
            </span>
          </div>
          <div className="overflow-hidden">
            <h2
              ref={titleRef}
              className="font-display text-4xl leading-[0.95] font-black tracking-[-0.005em] text-white uppercase sm:text-5xl sm:leading-[0.9] sm:tracking-[-0.02em] lg:text-6xl"
            >
              {t("whatWeDo.title", "Built Around Your Supply Chain")}
            </h2>
          </div>
        </div>

        <div className="mt-14 border-t border-white/15 lg:hidden" />

        <div className="mt-6 lg:mt-20 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* Sticky number panel (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <div
                aria-hidden
                dir="ltr"
                className="font-display relative h-[1em] w-full overflow-hidden text-[11rem] leading-none font-black text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.85)]"
              >
                {whatWeDo.map((item, i) => (
                  <span
                    key={item.id}
                    ref={(el) => {
                      if (el) numRefs.current[i] = el;
                    }}
                    className="absolute inset-0 block"
                  >
                    {item.index}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-4" dir="ltr">
                <span
                  ref={counterRef}
                  aria-hidden
                  className="font-ui text-sm tracking-widest text-white tabular-nums"
                >
                  01
                </span>
                <div className="relative h-px flex-1 bg-white/20">
                  <div
                    ref={barRef}
                    className="bg-brand-red absolute inset-0 origin-left"
                    style={{ transform: "scaleX(0.2)" }}
                  />
                </div>
                <span aria-hidden className="font-ui text-sm tracking-widest text-white/40 tabular-nums">
                  {String(whatWeDo.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          <div>
            {whatWeDo.map((item, i) => (
              <Reveal key={item.id} y={40}>
                <article
                  ref={(el) => {
                    if (el) itemRefs.current[i] = el;
                  }}
                  className="group relative grid gap-4 py-12 lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-10 lg:py-16"
                >
                  <WhatWeDoItem item={item} hideNumberOnDesktop />
                  <span
                    ref={(el) => {
                      if (el) lineRefs.current[i] = el;
                    }}
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-white/20 rtl:origin-right"
                    aria-hidden
                  />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
