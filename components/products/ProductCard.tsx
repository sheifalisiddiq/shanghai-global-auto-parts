"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { carBrands } from "@/lib/data/brands";
import { brandName, categoryKey } from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

import { ArrowUpRight } from "lucide-react";

export function ProductCard({ product, href }: { product: Product; href?: string | null }) {
  const { t, isRTL } = useLanguage();
  const category = categories.find((c) => c.id === product.category);
  const brands = product.compatibleBrandIds
    .map((id) => {
      const brand = carBrands.find((b) => b.id === id);
      return brand ? brandName(brand, isRTL) : null;
    })
    .filter(Boolean);

  const name = isRTL && product.nameAr ? product.nameAr : product.name;
  const shortSpec = isRTL && product.shortSpecAr ? product.shortSpecAr : product.shortSpec;
  const categoryLabel = category ? t(categoryKey(category.id), category.label) : "";

  return (
    <article
      dir={isRTL ? "rtl" : "ltr"}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)]"
    >
      {href && (
        <Link href={href} aria-label={name} className="absolute inset-0 z-20">
          <span className="sr-only">{name}</span>
        </Link>
      )}

      {/* Image Showcase Frame */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100/40 to-slate-50/60 border-b border-slate-100">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-106"
        />

        {/* Modern Frosted Glass Pill Badge */}
        {category && (
          <span
            className={`absolute top-3 ${
              isRTL ? "right-3" : "left-3"
            } z-10 inline-flex items-center rounded-full bg-slate-950/75 px-3 py-1 text-[10px] font-semibold tracking-wider text-white uppercase backdrop-blur-md shadow-sm ring-1 ring-white/15`}
          >
            {categoryLabel}
          </span>
        )}

        {/* Interactive Slide-up Spec Drawer */}
        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full rounded-t-xl bg-slate-950/90 p-3.5 backdrop-blur-md transition-transform duration-300 ease-out group-hover:translate-y-0">
          <p className="text-xs leading-relaxed text-white/90">{shortSpec}</p>
          {brands.length > 0 && (
            <p className="font-ui mt-1.5 text-[10px] tracking-wider text-white/60 uppercase">
              {t("catalog.fits", "Fits:")} {brands.join(isRTL ? "، " : ", ")}
            </p>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex flex-1 flex-col justify-between p-4 ${isRTL ? "text-right" : "text-left"}`}>
        <div>
          <h3 className="font-display text-sm font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-brand-red sm:text-base">
            {name}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-1">{shortSpec}</p>
        </div>

        {/* Footer Meta & Micro-Action */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-[11px] font-medium text-slate-400">
            {brands.length > 0 ? brands.slice(0, 2).join(", ") : "OEM Quality"}
          </span>
          <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-200 group-hover:bg-brand-red group-hover:text-white">
            <ArrowUpRight className="size-3.5 rtl:rotate-[-90deg]" />
          </span>
        </div>
      </div>
    </article>
  );
}
