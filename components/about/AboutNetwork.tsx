"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { whatWeDo } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const network = whatWeDo.find((item) => item.id === "network")!;

export function AboutNetwork() {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-20 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <span className="font-ui text-brand-red mb-3 block text-xs tracking-[0.3em] uppercase">
            {t("about.networkEyebrow", "Our Network")}
          </span>
          <h2 className="font-display text-ink text-3xl leading-[1.05] font-black uppercase sm:text-4xl">
            {t("whatWeDo.networkTitle", network.title)}
          </h2>
          <p className="text-steel-dark mt-6 max-w-lg text-base leading-relaxed">
            {t("whatWeDo.networkCopy", network.copy)}
          </p>
        </Reveal>

        <div className="bg-steel-light relative order-1 aspect-4/3 overflow-hidden lg:order-2">
          <Image
            src="/images/about/factory-line.jpg"
            alt="OEM factory production line manufacturing automotive components"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
