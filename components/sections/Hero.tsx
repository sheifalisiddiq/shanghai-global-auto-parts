"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGSAP } from "@/lib/gsap/registerGSAP";
import { preloaderState } from "@/lib/preloader/state";
import { PRELOADER_DONE_EVENT } from "@/components/preloader/Preloader";
import { Container } from "@/components/ui/Container";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Hero() {
  const { t } = useLanguage();
  const headlineLines = [t("hero.headline1", "YOUR SOURCE FOR"), t("hero.headline2", "CHINESE AUTO SPARE PARTS")];
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<HTMLSpanElement[]>([]);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGSAP();

      const tl = gsap.timeline({ paused: true });
      tl.fromTo(
        lineRefs.current,
        { yPercent: 120 },
        { yPercent: 0, duration: 0.8, stagger: 0.1, ease: "power4.out" },
      )
        .fromTo(subRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.4")
        .fromTo(
          ctaRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3",
        );

      const play = () => tl.play();

      if (preloaderState.done) {
        play();
      } else {
        window.addEventListener(PRELOADER_DONE_EVENT, play, { once: true });
      }

      return () => {
        window.removeEventListener(PRELOADER_DONE_EVENT, play);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-950 min-h-[520px] sm:min-h-[580px] lg:min-h-[660px] flex items-center"
    >
      {/* 1. Full-Bleed Background Image (Clear, Unobstructed, Centered) */}
      <div className="absolute inset-0 z-0 select-none">
        <Image
          src="/images/hero/hero-bg.jpg"
          alt="Shanghai Global Chinese Auto Spare Parts Workshop Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_65%] sm:object-center"
        />

        {/* Subtle, Minimal Vignette - Background Image Remains Sharp & Clear.
            Lightened per client feedback (image was reported "too dark") — a brighter/cleaner
            replacement source photo is still needed from the client; this is a code-only mitigation. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/25" />
      </div>

      {/* 2. Hero Content Foreground (Uncluttered, Spacious) */}
      <Container className="relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          {/* Top Pill / Badge */}
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/65 px-3.5 py-1.5 shadow-lg backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-red" />
            </span>
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase drop-shadow-sm">
              {t("hero.eyebrow", "Direct Importer • UAE • Qatar • Worldwide")}
            </span>
          </div>

          {/* Main Headline with High-Contrast Dark Outline / Shadow */}
          <h1
            aria-label={headlineLines.join(" ")}
            className="font-display text-white text-3xl font-black uppercase sm:text-5xl lg:text-6xl xl:text-[4.2rem] leading-[1.05] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,1)] drop-shadow-[0_2px_6px_rgba(0,0,0,1)]"
          >
            {headlineLines.map((line, i) => (
              <span key={`${line}-${i}`} className="block overflow-hidden" aria-hidden="true">
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

          {/* Subheading with High-Contrast Dark Shadow */}
          <p
            ref={subRef}
            className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-white font-medium drop-shadow-[0_3px_10px_rgba(0,0,0,1)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
          >
            {t(
              "hero.subtitle",
              "Original, OEM & reliable aftermarket components for Jetour, Changan, Geely, Chery, BYD, Haval and all major Chinese vehicle brands. Stocked in Sharjah & Abu Dhabi with express GCC delivery.",
            )}
          </p>

          {/* Direct Conversion Actions */}
          <div ref={ctaRef} className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="https://wa.me/97165335866?text=Hi%20Shanghai%20Global,%20I%20need%20a%20spare%20part%20quote%20for%20my%20vehicle."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-xl shadow-emerald-950/40 transition-transform hover:bg-emerald-500 hover:scale-[1.02]"
            >
              <MessageCircle className="size-4 fill-white text-emerald-600" />
              <span>{t("hero.fastQuote", "WhatsApp Fast Quote")}</span>
            </a>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/60 px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/50"
            >
              <span>{t("hero.exploreCatalog", "Explore Full Catalog")}</span>
              <ArrowUpRight className="size-4 text-brand-red rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
