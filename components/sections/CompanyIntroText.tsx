"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGSAP } from "@/lib/gsap/registerGSAP";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { ScrubText } from "@/components/ui/ScrubText";
import { Button } from "@/components/ui/Button";
import { companyIntro } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function CompanyIntroText() {
  const { t, isRTL } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGSAP();
      if (!sectionRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Frame wipes open as it enters.
      gsap.fromTo(
        frameRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.2,
          ease: "power3.inOut",
          clearProps: "clipPath",
          scrollTrigger: { trigger: frameRef.current, start: "top 85%", once: true },
        },
      );

      // Red accent block drifts against the photo for depth.
      gsap.fromTo(
        accentRef.current,
        { yPercent: 18 },
        {
          yPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-20 lg:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <span className="font-ui text-brand-red mb-5 flex items-center gap-3 text-xs tracking-[0.3em] uppercase">
                <span aria-hidden className="bg-brand-red h-px w-10" />
                {t("home.intro.eyebrow", "Who We Are")}
              </span>
            </Reveal>
            <ScrubText
              as="h2"
              text={t("about.headline", companyIntro)}
              className="font-display text-ink max-w-4xl text-3xl leading-[1.15] font-bold uppercase tracking-[-0.005em] sm:tracking-[-0.02em] sm:text-4xl lg:text-5xl sm:leading-[1.05]"
            />
            <Reveal delay={0.1} className="mt-8 max-w-xl">
              <p className="text-steel-dark text-base leading-relaxed sm:text-lg">
                {t(
                  "home.intro.copy",
                  "Shanghai Global Auto Parts runs its own factories and partner OEM facilities across China, delivering original, OEM and precision aftermarket components to businesses across the UAE, GCC and worldwide.",
                )}
              </p>
              <Button href="/about" variant="outline" className="mt-8">
                {t("home.intro.cta", "Learn More About Us")}
              </Button>
            </Reveal>
          </div>

          <div className="relative">
            <div
              ref={accentRef}
              aria-hidden
              className={`bg-brand-red absolute -bottom-8 hidden size-40 sm:block lg:size-52 ${isRTL ? "-right-8" : "-left-8"}`}
            />
            <div ref={frameRef} className="relative">
              <Parallax className="aspect-[4/5] w-full shadow-2xl" speed={9}>
                <Image
                  src="/images/about/factory-line.jpg"
                  alt="Shanghai Global factory production line"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              </Parallax>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
