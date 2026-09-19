"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { carBrands } from "@/lib/data/brands";
import { brandName, categoryKey } from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

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
      className="group border-steel-light relative flex h-full flex-col overflow-hidden border bg-white"
    >
      {href && (
        <Link href={href} aria-label={name} className="absolute inset-0 z-20">
          <span className="sr-only">{name}</span>
        </Link>
      )}
      <div className="bg-paper relative aspect-square overflow-hidden">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {category && (
          <span
            className={`font-ui bg-ink absolute top-3 ${
              isRTL ? "right-3" : "left-3"
            } px-2.5 py-1 text-[10px] tracking-wide text-white uppercase`}
          >
            {categoryLabel}
          </span>
        )}

        <div className="bg-ink/95 absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
          <p className="text-xs text-white/80">{shortSpec}</p>
          {brands.length > 0 && (
            <p className="font-ui mt-2 text-[10px] tracking-wide text-white/50 uppercase">
              {t("catalog.fits", "Fits:")} {brands.join(isRTL ? "، " : ", ")}
            </p>
          )}
        </div>
      </div>

      <div className={`flex flex-1 flex-col p-4 ${isRTL ? "text-right" : "text-left"}`}>
        <h3 className="font-ui text-ink text-sm tracking-wide uppercase">{name}</h3>
        <p className="text-steel-dark mt-1 text-xs">{shortSpec}</p>
      </div>
    </article>
  );
}
