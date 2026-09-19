"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { locations } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function OfficeWarehouse() {
  const { t } = useLanguage();

  const photos = [
    {
      src: "/images/about/factory-line.jpg",
      alt: t("about.office.photo1Alt", "OEM factory production line"),
    },
    {
      src: "/images/warehouse/qc-technician.jpg",
      alt: t(
        "about.quality.imageAlt",
        "Quality control technician inspecting automotive parts",
      ),
    },
  ];

  return (
    <section className="bg-white py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow={t("about.whereWeOperate", "Where We Operate")}
          title={t("about.office.title", "Our Offices & Warehouses")}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {photos.map((photo) => (
            <div
              key={photo.src}
              className="bg-steel-light relative aspect-4/3 overflow-hidden"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <Reveal className="mt-12">
          <ul className="grid gap-6 md:grid-cols-3">
            {locations.map((loc) => (
              <li key={loc.id} className="border-steel-light border-t pt-4">
                <h3 className="font-display text-ink text-lg font-black uppercase">
                  {loc.label}
                </h3>
                <p className="text-steel-dark mt-2 text-sm leading-relaxed">
                  {loc.address}
                </p>
                <p className="text-ink mt-2 text-sm" dir="ltr">
                  {loc.phone}
                </p>
              </li>
            ))}
          </ul>
          <Button href="/contact#maps" variant="outline" className="mt-10">
            {t("about.seeAllLocations", "See All Locations")}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
