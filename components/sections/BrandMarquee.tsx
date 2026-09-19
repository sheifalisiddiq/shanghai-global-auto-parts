"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { carBrands } from "@/lib/data/brands";
import { brandLogoDisclaimer } from "@/lib/data/company";
import { Container } from "@/components/ui/Container";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function BrandChip({ brand }: { brand: (typeof carBrands)[number] }) {
  if (!brand.logo) {
    return (
      <Link
        href={`/products?brand=${brand.id}`}
        title={`Explore spare parts for ${brand.name}`}
        className="font-ui text-steel-dark border-steel-light flex h-16 shrink-0 items-center rounded-full border px-6 text-xs tracking-wide uppercase hover:border-brand-red hover:text-brand-red transition-colors"
      >
        {brand.name}
      </Link>
    );
  }

  return (
    <Link
      href={`/products?brand=${brand.id}`}
      title={`Explore spare parts for ${brand.name}`}
      className="flex h-16 shrink-0 items-center px-8 grayscale transition-all duration-300 hover:grayscale-0 hover:scale-105"
    >
      <Image
        src={brand.logo.src}
        alt={brand.logo.alt}
        width={120}
        height={48}
        className="h-8 w-auto object-contain opacity-70 hover:opacity-100"
      />
    </Link>
  );
}

export function BrandMarquee() {
  const { t, language } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion || !trackRef.current) return;

    gsap.set(trackRef.current, { xPercent: 0 });

    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      duration: 32,
      ease: "none",
      repeat: -1,
    });

    const node = trackRef.current;
    const pause = () => tween.pause();
    const resume = () => tween.play();
    node.addEventListener("mouseenter", pause);
    node.addEventListener("mouseleave", resume);

    return () => {
      node.removeEventListener("mouseenter", pause);
      node.removeEventListener("mouseleave", resume);
      tween.kill();
    };
  }, [reducedMotion, language]);

  return (
    <section id="vehicle-makes" className="border-steel-light border-y bg-white py-12">
      <Container className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 shadow-2xs mb-2">
          <span className="size-1.5 rounded-full bg-brand-red animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs font-bold tracking-wider text-slate-700 uppercase">
            {t("brands.eyebrow", "Compatible Vehicle Makes")}
          </span>
        </div>
        <h2 className="font-display text-ink text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight">
          {t("brands.title", "Supported Chinese Automobile Brands")}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1">
          {t("brands.subtitle", "Select any brand to filter compatible parts, or explore our full make directory.")}
        </p>
      </Container>

      {/* Marquee Track Container (dir="ltr" ensures seamless continuous flow with no right-side voids in RTL) */}
      <div className="overflow-hidden" dir="ltr">
        <div
          ref={trackRef}
          className={reducedMotion ? "flex flex-wrap justify-center gap-2" : "flex w-max gap-2"}
        >
          {(reducedMotion ? carBrands : [...carBrands, ...carBrands]).map((brand, i) => (
            <BrandChip key={`${brand.id}-${i}`} brand={brand} />
          ))}
        </div>
      </div>

      <Container>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <p className="text-steel-dark text-center sm:text-left rtl:sm:text-right text-[11px] tracking-wide">
            {t("brands.disclaimer", brandLogoDisclaimer)}
          </p>
          <Link
            href="/makes"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold text-slate-800 transition-colors hover:bg-brand-red hover:text-white hover:border-brand-red shrink-0"
          >
            <span>{t("brands.viewAll", "View All Supported Makes & Models")}</span>
            <ArrowRight className="size-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
