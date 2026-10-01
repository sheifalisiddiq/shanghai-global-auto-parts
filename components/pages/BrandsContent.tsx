"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Search,
  X,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGSAP } from "@/lib/gsap/registerGSAP";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import { Container } from "@/components/ui/Container";
import { Parallax } from "@/components/ui/Parallax";
import { carBrands, type CarBrand } from "@/lib/data/brands";
import { brandName, brandTagline, brandDescription } from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function BrandDetail({
  brand,
  panelRef,
}: {
  brand: CarBrand;
  panelRef?: React.Ref<HTMLDivElement>;
  bare?: boolean;
}) {
  const { t, isRTL } = useLanguage();
  const name = brandName(brand, isRTL);
  const category = brandTagline(brand, isRTL);
  const description = brandDescription(brand, isRTL);
  const badge = (isRTL && brand.badgeAr) || brand.badge;
  const components = (isRTL && brand.keyComponentsAr) || brand.keyComponents || [];
  const models = brand.models ?? [];

  return (
    <div
      ref={panelRef}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* 1. Identity: who is this */}
      <div className="bg-ink p-6 text-white">
        <div className="flex items-start justify-between gap-3">
          {brand.logo && (
            <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white p-2">
              <Image
                src={brand.logo.src}
                alt={isRTL ? t("pg.brands.logoAlt").replace("{brand}", name) : brand.logo.alt}
                width={56}
                height={56}
                className="max-h-9 w-auto object-contain"
              />
            </span>
          )}
          {badge && (
            <span className="bg-brand-red rounded-full px-3 py-1 font-mono text-[10px] font-bold tracking-wider text-white uppercase">
              {badge}
            </span>
          )}
        </div>
        <h3 className="font-display mt-4 text-2xl leading-tight font-black uppercase">{name}</h3>
        {category && <p className="mt-1 text-sm text-white/60">{category}</p>}
      </div>

      {/* 2. At a glance: numbers draw the eye first */}
      <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200 rtl:divide-x-reverse">
        <div className="px-6 py-4">
          <span dir="ltr" className="font-display block text-3xl font-black text-slate-900">
            {models.length}
          </span>
          <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            {isRTL ? "موديل مدعوم" : "Models supported"}
          </span>
        </div>
        <div className="px-6 py-4">
          <span dir="ltr" className="font-display block text-3xl font-black text-slate-900">
            {components.length}
          </span>
          <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            {isRTL ? "فئة قطع رئيسية" : "Key part groups"}
          </span>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {description && <p className="text-[15px] leading-relaxed text-slate-700">{description}</p>}

        {models.length > 0 && (
          <div>
            <h4 className="mb-2.5 flex items-center gap-2 font-mono text-[11px] font-bold tracking-wider text-slate-900 uppercase">
              <span className="bg-brand-red h-3 w-1 rounded-full" />
              {t("pg.brands.popularModels").replace(/:$/, "")}
            </h4>
            <div className="flex flex-wrap gap-1.5" dir="ltr">
              {models.map((model) => (
                <span
                  key={model}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>
        )}

        {components.length > 0 && (
          <div>
            <h4 className="mb-2.5 flex items-center gap-2 font-mono text-[11px] font-bold tracking-wider text-slate-900 uppercase">
              <span className="bg-brand-red h-3 w-1 rounded-full" />
              {t("pg.brands.components").replace(/:$/, "")}
            </h4>
            <ul className="grid grid-cols-2 gap-2">
              {components.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[13px] font-medium text-slate-800"
                >
                  <CheckCircle2 className="text-brand-red size-3.5 shrink-0" />
                  <span className="leading-tight">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. Action */}
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <Link
            href={`/products?brand=${brand.id}`}
            className="bg-brand-red hover:bg-ink inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white transition-colors"
          >
            <span>{t("pg.brands.browse")}</span>
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
          <a
            href={`https://wa.me/97165335866?text=${encodeURIComponent(
              t("pg.brands.waBrand").replace("{brand}", name),
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
          >
            <MessageCircle className="size-4" />
            <span>{t("pg.brands.whatsapp")}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function BrandsContent() {
  const { t, isRTL } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return carBrands;
    return carBrands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        brandName(b, isRTL).toLowerCase().includes(q) ||
        b.models?.some((m) => m.toLowerCase().includes(q)),
    );
  }, [query, isRTL]);

  // Desktop always shows a brand: first match until the user picks one.
  const activeBrand =
    filtered.find((b) => b.id === selectedId) ?? carBrands.find((b) => b.id === selectedId && !query) ?? filtered[0];

  // The bottom sheet only exists below lg; lock page scroll while it is open.
  useLockBodyScroll(sheetOpen);

  const pick = (id: string) => {
    setSelectedId(id);
    if (window.innerWidth < 1024) setSheetOpen(true);
  };

  // Deep links like /brands#jetour preselect that brand.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hash is only readable after mount.
    if (id && carBrands.some((b) => b.id === id)) setSelectedId(id);
  }, []);

  useGSAP(
    () => {
      registerGSAP();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", gridRef.current);
      if (!tiles.length) return;
      gsap.fromTo(
        tiles,
        { opacity: 0, y: 24, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.04,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: gridRef.current, start: "top 90%", once: true },
        },
      );
    },
    { scope: gridRef, dependencies: [query] },
  );

  useGSAP(
    () => {
      if (!panelRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", clearProps: "transform,opacity" },
      );
    },
    { dependencies: [activeBrand?.id] },
  );

  return (
    <>
      {/* 1. Page Header Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-20 lg:py-24 text-white border-b border-white/10">
        <Parallax className="absolute inset-0" speed={10} start="top top">
          <Image
            src="/images/hero/hero-bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
        </Parallax>
        <div className="pointer-events-none absolute inset-0 bg-slate-950/55" />

        <Container className="relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 shadow-sm backdrop-blur-md mb-4">
              <span className="size-2 rounded-full bg-brand-red animate-pulse" />
              <span className="font-mono text-xs font-bold tracking-wider uppercase text-white">
                {t("pg.brands.badge")}
              </span>
            </div>

            <h1 className="h1-page tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">{t("pg.brands.title")}</h1>

            <p className="mt-4 text-sm sm:text-base text-slate-200 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {t("pg.brands.intro")}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-300">
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

      {/* 2. Brand picker: compact tiles + one detail panel */}
      <section className="bg-slate-50 py-12 lg:py-16">
        <Container>
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-red block mb-1">
                {t("pg.brands.directory")}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-slate-900 tracking-[-0.005em] sm:tracking-[-0.02em]">
                {t("pg.brands.select")}
              </h2>
            </div>

            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">{isRTL ? "ابحث عن علامة أو موديل" : "Search brand or model"}</span>
              <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isRTL ? "ابحث عن علامة أو موديل..." : "Search brand or model..."}
                className="w-full rounded-full border border-slate-200 bg-white py-3 ps-11 pe-4 text-sm text-slate-900 shadow-sm outline-none transition-shadow placeholder:text-slate-400 focus:border-slate-900 focus:shadow-md"
              />
            </label>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-10">
            {/* Tiles */}
            <div ref={gridRef}>
              {filtered.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                  {isRTL ? "لا توجد نتائج. جرّب اسماً آخر." : "No match. Try another name."}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  {filtered.map((brand) => {
                    const name = brandName(brand, isRTL);
                    const isActive = activeBrand?.id === brand.id;
                    return (
                      <button
                        key={brand.id}
                        type="button"
                        id={brand.id}
                        data-tile
                        aria-pressed={isActive}
                        onClick={() => pick(brand.id)}
                        className={`group relative flex cursor-pointer flex-col items-center gap-3 rounded-2xl border bg-white px-3 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                          isActive
                            ? "border-slate-900 shadow-lg ring-1 ring-slate-900"
                            : "border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute top-3 end-3 size-2 rounded-full bg-brand-red" aria-hidden />
                        )}
                        <span className="flex h-12 items-center justify-center">
                          {brand.logo ? (
                            <Image
                              src={brand.logo.src}
                              alt=""
                              width={64}
                              height={48}
                              className="max-h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <span className="font-display text-lg font-black text-slate-900 uppercase">
                              {name.slice(0, 3)}
                            </span>
                          )}
                        </span>
                        <span className="font-display text-sm font-bold text-slate-900">{name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              <p className="mt-6 text-xs text-slate-500">{t("pg.brands.disclaimer")}</p>
            </div>

            {/* Desktop detail panel */}
            <div className="hidden lg:sticky lg:top-28 lg:block">
              {activeBrand && <BrandDetail brand={activeBrand} panelRef={panelRef} />}
            </div>
          </div>
        </Container>
      </section>

      {/* Mobile bottom sheet */}
      {sheetOpen && activeBrand && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label={isRTL ? "إغلاق" : "Close"}
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-slate-950/60"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-slate-50 p-4 pt-14 pb-8 shadow-2xl">
            <button
              type="button"
              aria-label={isRTL ? "إغلاق" : "Close"}
              onClick={() => setSheetOpen(false)}
              className="absolute top-4 end-4 flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
            >
              <X className="size-4" />
            </button>
            <BrandDetail brand={activeBrand} />
          </div>
        </div>
      )}

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
