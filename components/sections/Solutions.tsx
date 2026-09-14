"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGSAP } from "@/lib/gsap/registerGSAP";
import { Container } from "@/components/ui/Container";
import { RevealGroup } from "@/components/ui/Reveal";
import { solutions } from "@/lib/data/company";

export function Solutions() {
  const imgWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    registerGSAP();
    if (!imgWrapRef.current) return;

    gsap.fromTo(
      imgWrapRef.current.querySelector("img"),
      { scale: 1.18 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: imgWrapRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  }, []);

  return (
    <section className="bg-paper py-16 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div
          ref={imgWrapRef}
          className="bg-steel-light relative order-2 aspect-4/3 overflow-hidden lg:order-1"
        >
          <Image
            src="/images/warehouse/qc-technician.jpg"
            alt="Technician quality-checking an automotive part before dispatch"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="order-1 lg:order-2">
          <span className="font-mono text-xs font-bold tracking-wider text-brand-red uppercase mb-2.5 block">
            Global Sourcing &bull; Quality Assured
          </span>
          <h2 className="font-display text-ink text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight">
            Comprehensive Sourcing Solutions
          </h2>

          <RevealGroup className="mt-8 space-y-4" itemSelector=":scope > div">
            {solutions.bullets.map((bullet) => (
              <div key={bullet} className="border-steel-light flex items-start gap-3 border-t pt-4">
                <span className="bg-brand-red mt-2 size-1.5 shrink-0 rounded-full" />
                <span className="text-ink text-sm sm:text-base font-medium">{bullet}</span>
              </div>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
