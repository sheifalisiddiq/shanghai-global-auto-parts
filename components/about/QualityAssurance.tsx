"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function QualityAssurance() {
  const { t } = useLanguage();

  const items = [
    t("about.quality.i1", "Every part quality-checked before dispatch"),
    t("about.quality.i2", "Product warranty on our offerings"),
    t("about.quality.i3", "Export documentation: Certificates of Origin and HS codes"),
    t("about.quality.i4", "Technical support from experienced professionals"),
  ];

  return (
    <section className="bg-paper py-20 lg:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="bg-steel-light relative aspect-4/3 overflow-hidden">
          <Image
            src="/images/warehouse/qc-technician.jpg"
            alt={t(
              "about.quality.imageAlt",
              "Quality control technician inspecting automotive parts",
            )}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <Reveal>
          <span className="font-ui text-brand-red mb-3 block text-xs tracking-[0.3em] uppercase">
            {t("about.quality.eyebrow", "Quality Assurance")}
          </span>
          <h2 className="font-display text-ink text-3xl leading-[1.05] font-black uppercase sm:text-4xl">
            {t("about.quality.title", "Checked Before It Ships")}
          </h2>
          <ul className="mt-8 space-y-4">
            {items.map((item) => (
              <li
                key={item}
                className="border-steel-light text-ink flex items-start gap-3 border-t pt-4 text-base"
              >
                <span className="bg-brand-red mt-2 size-1.5 shrink-0 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
