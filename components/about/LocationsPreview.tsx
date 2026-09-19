"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { contact } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LocationsPreview() {
  const { t } = useLanguage();

  return (
    <section className="bg-ink py-20 lg:py-24">
      <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <Reveal>
          <span className="font-ui text-brand-red mb-3 block text-xs tracking-[0.3em] uppercase">
            {t("about.whereWeOperate", "Where We Operate")}
          </span>
          <p className="font-display text-3xl font-black text-white uppercase sm:text-4xl">
            {t("about.locationsLine", contact.locationsLine)}
          </p>
        </Reveal>
        <Button
          href="/contact#maps"
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-ink shrink-0"
        >
          {t("about.seeAllLocations", "See All Locations")}
        </Button>
      </Container>
    </section>
  );
}
