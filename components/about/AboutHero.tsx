"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Parallax } from "@/components/ui/Parallax";
import { RevealGroup } from "@/components/ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function AboutHero() {
  const { t } = useLanguage();

  return (
    <section className="relative flex min-h-[520px] items-center overflow-hidden bg-slate-950 py-16 text-white sm:py-24 lg:min-h-[600px] lg:py-28">
      <Parallax className="absolute inset-0" speed={10} start="top top">
        <Image
          src="/images/about/factory-line.jpg"
          alt={t(
            "about.hero.imageAlt",
            "OEM factory production line manufacturing automotive components",
          )}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </Parallax>
      <div className="pointer-events-none absolute inset-0 bg-slate-950/70" />

      <Container className="relative z-10 w-full">
        <RevealGroup className="max-w-3xl" stagger={0.15} y={36}>
          <span className="font-ui border-brand-red/30 bg-brand-red/10 text-brand-red mb-4 inline-flex items-center rounded-full border px-3.5 py-1 text-xs tracking-widest uppercase backdrop-blur-sm">
            {t("about.eyebrow", "About Shanghai Global")}
          </span>
          <h1 className="h1-hero drop-shadow-lg">
            {t("about.hero.title", "Built On Trust. Driven By Parts.")}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 drop-shadow-md sm:text-lg">
            {t(
              "about.subtitle",
              "Delivering original, OEM, and precision aftermarket automotive components across the UAE, GCC, and worldwide.",
            )}
          </p>
        </RevealGroup>
      </Container>
    </section>
  );
}
