"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap/registerGSAP";
import { preloaderState } from "@/lib/preloader/state";
import { PRELOADER_DONE_EVENT } from "@/components/preloader/Preloader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroCanvasLoader } from "@/components/three/HeroCanvasLoader";
import { heroHeadline } from "@/lib/data/company";

const headlineLines = ["YOUR SOURCE FOR", "CHINESE AUTOMOTIVE PARTS"];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<HTMLSpanElement[]>([]);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGSAP();

      const tl = gsap.timeline({ paused: true });
      tl.fromTo(
        lineRefs.current,
        { yPercent: 120 },
        { yPercent: 0, duration: 0.9, stagger: 0.12, ease: "power4.out" },
      )
        .fromTo(subRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.5")
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4",
        )
        .fromTo(
          canvasWrapRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" },
          "-=0.7",
        );

      const play = () => tl.play();

      if (preloaderState.done) {
        play();
      } else {
        window.addEventListener(PRELOADER_DONE_EVENT, play, { once: true });
      }

      if (sectionRef.current && canvasWrapRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          animation: gsap.timeline().to(canvasWrapRef.current, { scale: 1.08, y: 40 }),
        });
      }

      return () => {
        window.removeEventListener(PRELOADER_DONE_EVENT, play);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white">
      <Container className="grid min-h-[88vh] items-center gap-10 py-16 lg:grid-cols-[3fr_2fr] lg:gap-4">
        <div>
          <span className="font-ui text-brand-red mb-6 block text-xs tracking-[0.3em] uppercase">
            Shanghai Global Auto Parts LLC
          </span>

          <h1
            aria-label={heroHeadline}
            className="font-display text-ink text-[13vw] leading-[0.92] font-black uppercase sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
          >
            {headlineLines.map((line, i) => (
              <span key={line} className="block overflow-hidden" aria-hidden="true">
                <span
                  ref={(el) => {
                    if (el) lineRefs.current[i] = el;
                  }}
                  className="block"
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p ref={subRef} className="text-steel-dark mt-8 max-w-md text-base leading-relaxed">
            Genuine, OEM &amp; reliable components for Chinese vehicle brands — sourced, quality-checked
            and shipped worldwide.
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-wrap gap-4">
            <Button href="/products">View Products</Button>
            <Button href="/products#enquire" variant="outline">
              Enquire Now
            </Button>
          </div>
        </div>

        <div ref={canvasWrapRef} className="relative h-[320px] sm:h-[420px] lg:h-[560px]">
          <HeroCanvasLoader />
        </div>
      </Container>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.3em] text-steel-dark uppercase sm:flex">
        <span className="bg-steel-dark h-10 w-px animate-pulse" />
        Scroll
      </div>
    </section>
  );
}
