"use client";

import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { locations } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function MapPanel() {
  const { t } = useLanguage();

  return (
    <section id="maps" className="bg-paper py-16 lg:py-24 border-t border-slate-200">
      <Container>
        <div className="mb-10 flex flex-col gap-2">
          <SectionHeading eyebrow={t("footer.hubs")} title={t("contact.locationsTitle")} />
          <p className="text-steel-dark text-sm max-w-2xl mt-1">
            {t("contact.locationsDesc")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {locations.map((loc) => {
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              loc.address,
            )}`;
            const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
              loc.address,
            )}&output=embed`;

            return (
              <div
                key={loc.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:border-brand-red/30"
              >
                {/* Location Top Header */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-brand-red shrink-0" />
                    <span className="font-ui text-xs font-bold uppercase tracking-wider text-ink">
                      {loc.label}
                    </span>
                  </div>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-brand-red hover:text-white hover:border-brand-red transition-colors"
                  >
                    <span>{t("contact.openInMaps")}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>

                {/* Embedded Map Frame */}
                <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                  <iframe
                    title={`Map — ${loc.label}`}
                    src={embedUrl}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Location Details Footer */}
                <div className="flex flex-1 flex-col justify-between p-5 bg-white">
                  <p className="text-xs leading-relaxed text-steel-dark line-clamp-2">
                    {loc.address}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-ink" dir="ltr">{loc.phone}</span>
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:text-ink transition-colors"
                    >
                      <Navigation className="size-3" />
                      <span>{t("contact.directions")}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
