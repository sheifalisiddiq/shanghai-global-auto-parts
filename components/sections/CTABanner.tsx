"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGSAP } from "@/lib/gsap/registerGSAP";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export function CTABanner() {
  const { t } = useLanguage();
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
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-16 lg:py-24">
      <div ref={blockRef} className="bg-brand-red absolute inset-0" />
      <Container className="relative">
        <Reveal>
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-display max-w-2xl text-4xl leading-[1.05] font-black text-white uppercase sm:text-5xl lg:text-6xl">
              {t("ctaBanner.title", "Sourcing original auto parts, worldwide.")}
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button href="/products#enquire" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-red">
                {t("ctaBanner.enquire", "Enquire Now")}
              </Button>
              <Button href="/contact" className="bg-ink hover:bg-white hover:text-ink">
                {t("ctaBanner.contact", "Contact Us")}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
