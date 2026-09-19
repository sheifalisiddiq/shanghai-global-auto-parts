"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { whatWeDo } from "@/lib/data/company";

import { useLanguage } from "@/lib/i18n/LanguageContext";

function WhatWeDoItem({ item }: { item: (typeof whatWeDo)[number] }) {
  const { t } = useLanguage();
  const title = t(`whatWeDo.${item.id}Title` as any, item.title);
  const copy = t(`whatWeDo.${item.id}Copy` as any, item.copy);
  const ctaLabel = item.cta ? t("whatWeDo.enquireNow", item.cta.label) : null;

  return (
    <>
      <span className="font-display text-steel-light text-5xl font-black">{item.index}</span>
      <h3 className="font-ui text-ink text-lg tracking-wide uppercase lg:text-xl">{title}</h3>
      <div>
        <p className="text-steel-dark max-w-2xl text-sm leading-relaxed sm:text-base">{copy}</p>
        {item.cta && (
          <Button href={item.cta.href} variant="outline" className="mt-6 px-5 py-3 text-xs">
            {ctaLabel}
          </Button>
        )}
      </div>
    </>
  );
}

export function WhatWeDo() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<HTMLSpanElement[]>([]);
  const itemRefs = useRef<HTMLElement[]>([]);
  const lineRefs = useRef<HTMLSpanElement[]>([]);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGSAP();
      if (reducedMotion || !sectionRef.current) return;

      if (eyebrowRef.current && titleRef.current) {
        gsap.set(eyebrowRef.current, { xPercent: -130 });
        gsap.set(titleRef.current, { xPercent: -60 });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 90%",
          end: "top 40%",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(eyebrowRef.current, { xPercent: -130 * (1 - self.progress) });
            gsap.set(titleRef.current, { xPercent: -60 * (1 - self.progress) });
          },
        });
      }

      const items = itemRefs.current;
      const dots = dotRefs.current;
      if (!items.length || !dots.length) return;

      gsap.set(dots[0], {
        scale: 1.6,
        backgroundColor: "#EF0606",
        boxShadow: "0 0 14px 4px rgba(239,6,6,0.55)",
      });

      // Scrollspy: as each point scrolls to the middle of the viewport, it
      // becomes the active one on the rail. Points stay in normal document
      // flow (not swapped/hidden), so earlier ones remain visible above.
      items.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (!self.isActive) return;

            dots.forEach((dot, di) => {
              const isActive = di === i;
              gsap.to(dot, {
                scale: isActive ? 1.6 : 1,
                backgroundColor: isActive ? "#EF0606" : "#D9D9D9",
                boxShadow: isActive ? "0 0 14px 4px rgba(239,6,6,0.55)" : "none",
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto",
              });
            });

            if (railFillRef.current) {
              gsap.to(railFillRef.current, {
                height: `${(i / (items.length - 1)) * 100}%`,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          },
        });

        if (lineRefs.current[i]) {
          gsap.fromTo(
            lineRefs.current[i],
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: item, start: "top 85%" },
            },
          );
        }
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  if (reducedMotion) {
    return (
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <SectionHeading eyebrow="What We Do" title="Built Around Your Supply Chain" />

          <RevealGroup className="border-steel-light mt-14 border-t" itemSelector=":scope > article">
            {whatWeDo.map((item) => (
              <article
                key={item.id}
                className="border-steel-light group grid gap-4 border-b py-10 lg:grid-cols-[100px_1.2fr_2fr] lg:items-start lg:gap-10 lg:px-4"
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
    <section ref={sectionRef} className="bg-white py-16 lg:py-24">
      <Container>
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
              className="font-display text-ink text-4xl leading-[0.95] font-black uppercase sm:text-5xl lg:text-6xl"
            >
              {t("whatWeDo.title", "Built Around Your Supply Chain")}
            </h2>
          </div>
        </div>

        <div className="border-steel-light mt-14 border-t lg:hidden" />

        <div className="mt-14 lg:grid lg:grid-cols-[56px_1fr] lg:gap-10 lg:items-start">
          <div className="relative hidden lg:sticky lg:top-32 lg:block lg:h-[360px] lg:w-px lg:justify-self-center lg:bg-steel-light">
            <div
              ref={railFillRef}
              className="bg-brand-red absolute inset-x-0 top-0 h-0 w-px"
              aria-hidden
            />
            {whatWeDo.map((item, i) => (
              <span
                key={item.id}
                ref={(el) => {
                  if (el) dotRefs.current[i] = el;
                }}
                className="bg-steel-light absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ top: `${(i / (whatWeDo.length - 1)) * 100}%` }}
                aria-hidden
              />
            ))}
          </div>

          <div>
            {whatWeDo.map((item, i) => (
              <Reveal key={item.id} y={30}>
                <article
                  ref={(el) => {
                    if (el) itemRefs.current[i] = el;
                  }}
                  className="group relative grid gap-4 py-10 lg:grid-cols-[100px_1.2fr_2fr] lg:items-start lg:gap-10 lg:px-4"
                >
                  <WhatWeDoItem item={item} />
                  <span
                    ref={(el) => {
                      if (el) lineRefs.current[i] = el;
                    }}
                    className="bg-steel-light pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0"
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
