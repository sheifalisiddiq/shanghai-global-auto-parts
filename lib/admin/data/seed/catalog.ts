import { carBrands } from "@/lib/data/brands";
import { brandDescription, brandName, brandTagline, getFitment, getSku, slugify } from "@/lib/data/catalog";
import { categories as siteCategories } from "@/lib/data/categories";
import { products as siteProducts } from "@/lib/data/products";
import { translations } from "@/lib/i18n/translations";
import type { Brand, Category, Country, FitmentRow, Model, Product } from "../types";
import { L, baseFields, seoFrom } from "./util";

const ar = (key: string): string => (translations.ar as Record<string, string>)[key] ?? "";
const arOnly = (en: string, arText: string) => (arText && arText !== en ? arText : "");

export function seedBrands(): Brand[] {
  return carBrands.map((b, i) => ({
    ...baseFields(b.id),
    name: L(b.name, arOnly(b.name, brandName(b, true))),
    slug: b.id,
    category: L(b.category ?? "", arOnly(b.category ?? "", brandTagline(b, true))),
    badge: b.badge ?? "",
    logo: b.logo?.src ?? "",
    shortDescription: L(b.description ?? "", arOnly(b.description ?? "", brandDescription(b, true))),
    longDescription: L(""),
    banner: "",
    thumbnail: b.logo?.src ?? "",
    sortOrder: i + 1,
    featured: !!b.badge,
    keyComponents: b.keyComponents ?? [],
    seo: seoFrom(`${b.name} spare parts`, b.description ?? "", { canonicalUrl: `/products/${b.id}` }),
  }));
}

export const modelId = (brandId: string, name: string) => `${brandId}--${slugify(name)}`;

export function seedModels(): Model[] {
  const out: Model[] = [];
  for (const b of carBrands) {
    (b.models ?? []).forEach((name, i) => {
      out.push({
        ...baseFields(modelId(b.id, name)),
        name: L(name),
        slug: slugify(name),
        brandId: b.id,
        image: "",
        description: L(""),
        generation: "",
        featured: false,
        sortOrder: i + 1,
        categoryIds: [],
        seo: seoFrom(`${b.name} ${name} spare parts`, "", { canonicalUrl: `/products/${b.id}/${slugify(name)}` }),
      });
    });
  }
  return out;
}

export function seedCategories(): Category[] {
  return siteCategories.map((c) => {
    const key = c.id === "body-accessories" ? "cat.body" : `cat.${c.id}`;
    return {
      ...baseFields(c.id),
      name: L(c.label, ar(key)),
      slug: c.id,
      parentId: "",
      description: L(c.description, ar(`catdesc.${c.id}`)),
      image: c.image.src,
      icon: c.icon,
      seo: seoFrom(`${c.label} for Chinese vehicles`, c.description),
    };
  });
}

export function seedProducts(): Product[] {
  return siteProducts.map((p) => {
    const confirmed = getFitment(p);
    const fitment: FitmentRow[] = confirmed.map((f) => ({
      brandId: f.brandId,
      modelId: modelId(f.brandId, f.model),
      years: "",
    }));
    // Brands the part is listed as compatible with but without a confirmed model.
    for (const brandId of p.compatibleBrandIds) {
      if (!fitment.some((f) => f.brandId === brandId)) fitment.push({ brandId, modelId: "", years: "" });
    }
    const primary = fitment[0];
    return {
      ...baseFields(p.id),
      name: L(p.name, p.nameAr ?? ""),
      slug: p.slug,
      sku: getSku(p),
      oemNumbers: [],
      brandId: primary?.brandId ?? "",
      modelId: primary?.modelId ?? "",
      categoryId: p.category,
      fitment,
      yearGeneration: "",
      crossReferences: [],
      shortDescription: L(p.shortSpec, p.shortSpecAr ?? ""),
      fullDescription: L(""),
      features: [],
      specifications: [],
      fittingNotes: L(""),
      faq: [],
      mainImage: p.image.src,
      imageAlt: L(p.image.alt),
      gallery: [],
      catalogPdf: "",
      commercial: { enquiryCta: true, whatsappCta: true, availability: "on-request", showPrice: false, price: "" },
      countryIds: [],
      tags: [],
      featured: !!p.featured,
      seo: seoFrom(`${p.name} | Chinese auto parts`, p.shortSpec),
    };
  });
}

/**
 * Only countries supported by real website data are seeded: the offices in
 * lib/data/company.ts are in the UAE (Sharjah, Abu Dhabi) and Qatar. The other
 * countries in lib/data/countries.ts are flagged as unconfirmed placeholders in
 * their source, so they are deliberately NOT seeded. The client adds any others.
 */
export function seedCountries(): Country[] {
  const rows: { id: string; code: string; en: string; slug: string }[] = [
    { id: "ae", code: "AE", en: "United Arab Emirates", slug: "united-arab-emirates" },
    { id: "qa", code: "QA", en: "Qatar", slug: "qatar" },
  ];
  return rows.map((c, i) => ({
    ...baseFields(c.id),
    name: L(c.en, ar(`home.countries.${c.id}`)),
    slug: c.slug,
    code: c.code,
    flag: "",
    shortDescription: L(""),
    longDescription: L(""),
    archiveEnabled: false,
    featured: true,
    sortOrder: i + 1,
    banner: "",
    seo: seoFrom(`Chinese auto parts in ${c.en}`, "", { sitemapInclude: false }),
  }));
}
