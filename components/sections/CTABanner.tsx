"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGSAP } from "@/lib/gsap/registerGSAP";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function CTABanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGSAP();
      if (!blockRef.current) return;

      gsap.fromTo(
        blockRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 35%",
            scrub: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div ref={blockRef} className="bg-brand-red absolute inset-0" />
      <Container className="relative">
        <Reveal>
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-display max-w-2xl text-4xl leading-[0.95] font-black text-white uppercase sm:text-5xl lg:text-6xl">
              Sourcing genuine auto parts, worldwide.
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button href="/products#enquire" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-red">
                Enquire Now
              </Button>
              <Button href="/contact" className="bg-ink hover:bg-white hover:text-ink">
                Contact Us
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
