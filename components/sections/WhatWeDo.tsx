"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { whatWeDo } from "@/lib/data/company";

function WhatWeDoItem({ item }: { item: (typeof whatWeDo)[number] }) {
  return (
    <>
      <span className="font-display text-steel-light text-5xl font-black">{item.index}</span>
      <h3 className="font-ui text-ink text-lg tracking-wide uppercase lg:text-xl">{item.title}</h3>
      <div>
        <p className="text-steel-dark max-w-2xl text-sm leading-relaxed sm:text-base">{item.copy}</p>
        {item.cta && (
          <Button href={item.cta.href} variant="outline" className="mt-6 px-5 py-3 text-xs">
            {item.cta.label}
          </Button>
        )}
      </div>
    </>
  );
}

export function WhatWeDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGSAP();
      if (reducedMotion || !stackRef.current || !sectionRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const items = gsap.utils.toArray<HTMLElement>(stackRef.current!.children);
        if (!items.length) return;

        gsap.set(items, { opacity: 0, y: 24 });
        gsap.set(items[0], { opacity: 1, y: 0 });

        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${items.length * 100}%`,
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress * items.length;
            items.forEach((item, i) => {
              const local = p - i;
              const opacity = 1 - Math.min(Math.abs(local), 1);
              const y = Math.max(Math.min(local, 1), -1) * 24;
              gsap.set(item, { opacity, y });
            });
          },
        });

        return () => {
          st.kill();
          gsap.set(items, { clearProps: "opacity,y" });
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  if (reducedMotion) {
    return (
      <section className="bg-white py-24 lg:py-32">
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
    <section ref={sectionRef} className="bg-white py-24 lg:py-0">
      <Container className="lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <SectionHeading eyebrow="What We Do" title="Built Around Your Supply Chain" />

        <div ref={stackRef} className="border-steel-light relative mt-14 min-h-[420px] border-t lg:min-h-[320px]">
          {whatWeDo.map((item) => (
            <article
              key={item.id}
              className="grid gap-4 py-10 lg:absolute lg:inset-0 lg:grid-cols-[100px_1.2fr_2fr] lg:items-start lg:gap-10 lg:px-4"
            >
              <WhatWeDoItem item={item} />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
