"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, registerGSAP } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { companyIntro } from "@/lib/data/company";

export function CompanyIntro() {
  const pRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGSAP();
      if (reducedMotion || !pRef.current) return;

      const split = SplitText.create(pRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        linesClass: "line",
      });

      gsap.from(split.lines, {
        yPercent: 110,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: pRef.current, start: "top 85%" },
      });

      return () => split.revert();
    },
    { scope: pRef, dependencies: [reducedMotion] },
  );

  return (
    <section className="bg-paper py-16 lg:py-24">
      <Container>
        <p
          ref={pRef}
          className="font-display text-ink max-w-5xl text-3xl leading-[1.15] font-bold uppercase sm:text-4xl lg:text-5xl"
        >
          {companyIntro}
        </p>
      </Container>
    </section>
  );
}
