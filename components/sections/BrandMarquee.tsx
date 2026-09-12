"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { carBrands } from "@/lib/data/brands";
import { brandLogoDisclaimer } from "@/lib/data/company";
import { Container } from "@/components/ui/Container";

function BrandChip({ brand }: { brand: (typeof carBrands)[number] }) {
  if (!brand.logo) {
    return (
      <span className="font-ui text-steel-dark border-steel-light flex h-16 shrink-0 items-center rounded-full border px-6 text-xs tracking-wide uppercase">
        {brand.name}
      </span>
    );
  }

  return (
    <span className="flex h-16 shrink-0 items-center px-8 grayscale transition-all duration-300 hover:grayscale-0">
      <Image
        src={brand.logo.src}
        alt={brand.logo.alt}
        width={120}
        height={48}
        className="h-8 w-auto object-contain opacity-70 hover:opacity-100"
      />
    </span>
  );
}

export function BrandMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion || !trackRef.current) return;

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
  }, [reducedMotion]);

  return (
    <section className="border-steel-light border-y bg-white py-10">
      <div className="overflow-hidden">
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
        <p className="text-steel-dark mt-6 text-center text-[11px] tracking-wide">
          {brandLogoDisclaimer}
        </p>
      </Container>
    </section>
  );
}
