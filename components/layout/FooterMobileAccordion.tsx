"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { locations } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils/cn";

const footerCategoryIds = ["brakes", "filters", "engine", "suspension"];

const popularBrands = [
  { id: "jetour", name: "Jetour" },
  { id: "changan", name: "Changan" },
  { id: "geely", name: "Geely" },
  { id: "chery", name: "Chery" },
  { id: "haval", name: "Haval & GWM" },
  { id: "byd", name: "BYD & MG" },
];

type SectionKey = "parts" | "makes" | "locations";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

export function FooterMobileAccordion() {
  const [expanded, setExpanded] = useState<SectionKey | null>(null);
  const { t } = useLanguage();

  const toggle = (key: SectionKey) => {
    setExpanded((prev) => (prev === key ? null : key));
  };

  const sections: { key: SectionKey; label: string }[] = [
    { key: "parts", label: t("footer.catalog", "Spare Parts Catalog") },
    { key: "makes", label: t("footer.makes", "Supported Makes") },
    { key: "locations", label: t("footer.hubs", "GCC Hubs & Locations") },
  ];

  return (
    <div className="divide-y divide-white/10 border-t border-white/10">
      {sections.map(({ key, label }) => {
        const isOpen = expanded === key;
        const panelId = `footer-accordion-${key}`;

        return (
          <div key={key}>
            <button
              type="button"
              onClick={() => toggle(key)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className={cn(
                "flex w-full items-center justify-between py-3.5 text-xs font-ui tracking-[0.15em] uppercase text-slate-300 transition-colors cursor-pointer",
                focusRing,
              )}
            >
              <span>{label}</span>
              <ChevronDown
                className={cn(
                  "size-4 text-slate-500 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {isOpen && (
              <div id={panelId} className="pb-4 text-xs">
                {key === "parts" && (
                  <ul className="space-y-2">
                    {categories
                      .filter((cat) => footerCategoryIds.includes(cat.id))
                      .map((cat) => (
                        <li key={cat.id}>
                          <Link
                            href={`/products#${cat.id}`}
                            className={cn(
                              "block rounded px-1 py-1 text-slate-400 hover:text-white transition-colors",
                              focusRing,
                            )}
                          >
                            {t(`cat.${cat.id}` as any, cat.label)}
                          </Link>
                        </li>
                      ))}
                    <li>
                      <Link
                        href="/products"
                        className={cn(
                          "block rounded px-1 py-1 font-semibold text-brand-red hover:underline",
                          focusRing,
                        )}
                      >
                        {t("footer.viewAllCategories", "View All Categories →")}
                      </Link>
                    </li>
                  </ul>
                )}

                {key === "makes" && (
                  <ul className="space-y-2">
                    {popularBrands.map((brand) => (
                      <li key={brand.id}>
                        <Link
                          href={`/products?brand=${brand.id}`}
                          className={cn(
                            "block rounded px-1 py-1 text-slate-400 hover:text-white transition-colors",
                            focusRing,
                          )}
                        >
                          {brand.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/makes"
                        className={cn(
                          "block rounded px-1 py-1 font-semibold text-brand-red hover:underline",
                          focusRing,
                        )}
                      >
                        {t("footer.viewAllMakes", "View All 14+ Makes →")}
                      </Link>
                    </li>
                  </ul>
                )}

                {key === "locations" && (
                  <ul className="space-y-2.5">
                    {locations.map((loc) => (
                      <li key={loc.id} className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-white">{loc.label}</span>
                        <a
                          href={`tel:${loc.phone.replace(/\s+/g, "")}`}
                          className={cn(
                            "flex items-center gap-1.5 rounded text-slate-400 hover:text-brand-red transition-colors",
                            focusRing,
                          )}
                        >
                          <Phone className="size-3 text-brand-red shrink-0" />
                          <span>{loc.phone}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
