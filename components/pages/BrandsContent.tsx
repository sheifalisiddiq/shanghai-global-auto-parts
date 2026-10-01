"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { carBrands } from "@/lib/data/brands";
import { brandName, brandTagline, brandDescription } from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function BrandsContent() {
  const { t, isRTL } = useLanguage();

  return (
    <>
      {/* 1. Page Header Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-20 text-white border-b border-white/10">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 shadow-sm backdrop-blur-md mb-4">
              <span className="size-2 rounded-full bg-brand-red animate-pulse" />
              <span className="font-mono text-xs font-bold tracking-wider uppercase text-white">
                {t("pg.brands.badge")}
              </span>
            </div>

            <h1 className="h1-page tracking-tight">{t("pg.brands.title")}</h1>

            <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed">
              {t("pg.brands.intro")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand-red" />
                <span>{t("pg.brands.chip1")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span>{t("pg.brands.chip2")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-brand-red" />
                <span>{t("pg.brands.chip3")}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Grid of Supported Vehicle Brands */}
      <section className="bg-slate-50 py-16 lg:py-20">
        <Container>
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-red block mb-1">
                {t("pg.brands.directory")}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-slate-900 tracking-[-0.005em] sm:tracking-[-0.02em]">
                {t("pg.brands.select")}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">{t("pg.brands.selectSub")}</p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-red hover:underline self-start sm:self-auto"
            >
              <span>{t("pg.brands.exploreAll")}</span>
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carBrands.map((brand) => {
              const name = brandName(brand, isRTL);
              const category = brandTagline(brand, isRTL);
              const description = brandDescription(brand, isRTL);
              const badge = (isRTL && brand.badgeAr) || brand.badge;
              const components = (isRTL && brand.keyComponentsAr) || brand.keyComponents;
              return (
                <div
                  key={brand.id}
                  id={brand.id}
                  className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-brand-red/40 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-3.5">
                      {brand.logo ? (
                        <div className="relative flex size-14 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-2 group-hover:border-brand-red/30 transition-colors">
                          <Image
                            src={brand.logo.src}
                            alt={
                              isRTL
                                ? t("pg.brands.logoAlt").replace("{brand}", name)
                                : brand.logo.alt
                            }
                            width={48}
                            height={48}
                            className="max-h-8 w-auto object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xs uppercase">
                          {name.slice(0, 3)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-red transition-colors">
                          {name}
                        </h3>
                        {category && (
                          <div className="text-[11px] font-medium text-slate-500">{category}</div>
                        )}
                      </div>
                    </div>

                    {badge && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[10px] font-bold text-slate-700">
                        {badge}
                      </span>
                    )}
                  </div>

                  {description && (
                    <p className="mt-4 text-xs text-slate-600 leading-relaxed">{description}</p>
                  )}

                  {brand.models && brand.models.length > 0 && (
                    <div className="mt-4">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        {t("pg.brands.popularModels")}
                      </span>
                      <div className="flex flex-wrap gap-1.5" dir="ltr">
                        {brand.models.map((model) => (
                          <span
                            key={model}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                          >
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {components && (
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        {t("pg.brands.components")}
                      </span>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {components.join(" • ")}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/products?brand=${brand.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-red"
                    >
                      <span>{t("pg.brands.browse")}</span>
                      <ArrowRight className="size-3.5 rtl:rotate-180" />
                    </Link>

                    <a
                      href={`https://wa.me/97165335866?text=${encodeURIComponent(
                        t("pg.brands.waBrand").replace("{brand}", name),
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                    >
                      <MessageCircle className="size-3.5 text-emerald-600" />
                      <span>{t("pg.brands.whatsapp")}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center text-xs text-slate-500">
            {t("pg.brands.disclaimer")}
          </div>
        </Container>
      </section>

      {/* 3. Fast VIN Sourcing Banner */}
      <section className="bg-slate-950 py-12 text-white border-t border-white/10">
        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center lg:text-start">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                {t("pg.brands.sourcingTag")}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-[-0.005em] sm:tracking-[-0.02em] text-white">
                {t("pg.brands.sourcingTitle")}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                {t("pg.brands.sourcingText")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/97165335866?text=${encodeURIComponent(t("pg.brands.waVin"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition-transform hover:bg-emerald-500 hover:scale-[1.02]"
              >
                <MessageCircle className="size-4 fill-white text-emerald-600" />
                <span>{t("pg.brands.vinBtn")}</span>
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/10"
              >
                <span>{t("pg.brands.branches")}</span>
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
