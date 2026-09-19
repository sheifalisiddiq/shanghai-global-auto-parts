"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { carBrands } from "@/lib/data/brands";
import { brandName } from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function BrandChip({ brand, label }: { brand: (typeof carBrands)[number]; label: string }) {
  if (!brand.logo) {
    return (
      <Link
        href={`/products/${brand.id}`}
        title={label}
        className="font-ui text-steel-dark border-steel-light hover:border-brand-red hover:text-brand-red flex h-16 shrink-0 items-center rounded-full border px-6 text-xs tracking-wide uppercase transition-colors"
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={`/products/${brand.id}`}
      title={label}
      className="flex h-16 shrink-0 items-center px-8 grayscale transition-all duration-300 hover:scale-105 hover:grayscale-0"
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

export function BrandTiles() {
  const { t, isRTL, language } = useLanguage();
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
    <section className="bg-paper border-steel-light border-b py-12">
      <Container className="mb-8">
        <SectionHeading
          eyebrow={t("catalog.eyebrow")}
          title={t("products.brandsTitle")}
          className="max-w-3xl"
        />
        <p className="text-steel-dark mt-4 max-w-2xl text-sm sm:text-base">
          {t("products.brandsIntro")}
        </p>
      </Container>

      {/* dir="ltr" keeps the loop seamless in RTL (no empty gap on one side) */}
      <div className="overflow-hidden" dir="ltr">
        <div
          ref={trackRef}
          className={reducedMotion ? "flex flex-wrap justify-center gap-2" : "flex w-max gap-2"}
        >
          {(reducedMotion ? carBrands : [...carBrands, ...carBrands]).map((brand, i) => (
            <BrandChip key={`${brand.id}-${i}`} brand={brand} label={brandName(brand, isRTL)} />
          ))}
        </div>
      </div>
    </section>
  );
}
