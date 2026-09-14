"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, registerGSAP } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { ExplodedEngineViewer } from "@/components/hero/ExplodedEngineViewer";

export function CompanyIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const explodeProgress = useRef(0);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGSAP();

      // ScrollTrigger drives the exploded engine separation on scroll
      if (!reducedMotion && sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
          onUpdate: (self) => {
            explodeProgress.current = self.progress;
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white py-8 sm:py-12 lg:py-14 border-b border-slate-200/80"
    >
      <Container>
        <div className="mx-auto max-w-4xl lg:max-w-5xl relative w-full h-[480px] sm:h-[540px] lg:h-[600px]">
          <ExplodedEngineViewer explodeProgress={explodeProgress} />
        </div>
      </Container>
    </section>
  );
}

