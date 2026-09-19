import type { TranslationKey } from "@/lib/i18n/translations";
import { carBrands, type CarBrand } from "./brands";
import { products, type Product } from "./products";

/* ------------------------------------------------------------------ */
/* Slugs & labels                                                      */
/* ------------------------------------------------------------------ */

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Arabic display text for brands (names, taglines, descriptions). */
const brandAr: Record<string, { name: string; category: string; description: string }> = {
  jetour: {
    name: "جيتور",
    category: "سيارات دفع رباعي وكروس أوفر",
    description: "سيارات دفع رباعي فاخرة مصممة لتضاريس الخليج بمحركات تيربو عالية الأداء.",
  },
  changan: {
    name: "شانجان",
    category: "سيارات دفع رباعي وسيدان وكروس أوفر",
    description: "من أبرز شركات السيارات الصينية بحضور واسع لدى الوكلاء والأساطيل في الخليج.",
  },
  geely: {
    name: "جيلي",
    category: "سيارات دفع رباعي وسيدان",
    description: "مركبات متطورة على منصة CMA بهندسة مشتركة مع فولفو ومحركات هجينة.",
  },
  chery: {
    name: "شيري",
    category: "سيارات دفع رباعي وسيدان",
    description: "قوة صناعية عالمية بمحركات أكتيكو المزودة بتيربو والحائزة على جوائز.",
  },
  haval: {
    name: "هافال",
    category: "دفع رباعي و4x4",
    description: "قسم السيارات الرياضية في جريت وول موتورز، معروف بمتانة الشاسيه وقدرات الطرق الوعرة.",
  },
  gwm: {
    name: "جي دبليو إم (جريت وول وتانك)",
    category: "4x4 وطرق وعرة وبيك أب",
    description: "سيارات 4x4 قوية بهيكل منفصل وبيك أب عملية مصممة للبيئات الصعبة.",
  },
  byd: {
    name: "بي واي دي",
    category: "كهربائية وهجينة وسيدان",
    description: "رائدة عالمياً في مركبات الطاقة الجديدة بتقنية بطارية بليد ومحركات DM-i الهجينة.",
  },
  mg: {
    name: "إم جي (موريس غاراجز)",
    category: "دفع رباعي وسيدان وكهربائية",
    description: "تشكيلة حديثة بإرث بريطاني تحظى بشعبية واسعة في أسواق الخليج.",
  },
  baic: {
    name: "بايك",
    category: "طرق وعرة 4x4 ودفع رباعي",
    description: "هندسة شاسيه بمستوى عسكري تقدم سيارات 4x4 حقيقية وكروس أوفر حضرية حديثة.",
  },
  jac: {
    name: "جاك موتورز",
    category: "تجارية وكروس أوفر",
    description: "فانات تجارية وبيك أب ثقيلة وسيارات ركاب حضرية موثوقة.",
  },
  ldv: {
    name: "إل دي في (ماكسوس)",
    category: "فان وMPV وبيك أب",
    description: "فانات توصيل تجارية ومركبات عائلية وشاحنات عمل ثقيلة بكابينة مزدوجة.",
  },
  omoda: {
    name: "أومودا وجايكو",
    category: "كروس أوفر عصرية",
    description: "تصميم فاست باك مستقبلي وكروس أوفر حضرية فاخرة بدفع رباعي ذكي.",
  },
  nio: {
    name: "نيو",
    category: "سيارات كهربائية فاخرة",
    description: "سيارات كهربائية ذكية من الجيل الجديد بمحركين وعزم مرتفع.",
  },
  venucia: {
    name: "فينوشيا",
    category: "كروس أوفر وسيدان",
    description: "سيارات مشروع دونغفنغ ونيسان المشترك تجمع هندسة مجربة وإلكترونيات حديثة.",
  },
};

export function brandName(brand: CarBrand, isRTL: boolean): string {
  return (isRTL && brandAr[brand.id]?.name) || brand.name;
}

export function brandTagline(brand: CarBrand, isRTL: boolean): string {
  return (isRTL && brandAr[brand.id]?.category) || brand.category || "";
}

export function brandDescription(brand: CarBrand, isRTL: boolean): string {
  return (isRTL && brandAr[brand.id]?.description) || brand.description || "";
}

export function categoryKey(id: string): TranslationKey {
  return (id === "body-accessories" ? "cat.body" : `cat.${id}`) as TranslationKey;
}

export function categoryDescKey(id: string): TranslationKey {
  return `catdesc.${id}` as TranslationKey;
}

/* ------------------------------------------------------------------ */
/* Fitment                                                             */
/* ------------------------------------------------------------------ */

/**
 * Confirmed fitment: productId -> brandId -> models the part is confirmed to fit.
 * A part is listed under a model ONLY if it appears here. Never inferred from brand.
 *
 * DEMO DATA: these entries are sample placeholders for the demo build.
 * Verify each against the parts catalogue / VIN data before launch.
 */
const fitmentSeed: Record<string, Record<string, string[]>> = {
  "brk-001": { chery: ["Tiggo 7 Pro", "Tiggo 8 Pro Max"], mg: ["MG HS"], geely: ["Coolray"] },
  "flt-001": { chery: ["Tiggo 7 Pro"], jetour: ["Dashing"], omoda: ["Omoda C5"] },
  "eng-002": { geely: ["Monjaro"], mg: ["MG HS"] },
  "sus-001": { byd: ["Atto 3"], mg: ["MG ZS / ZS EV"] },
  "sus-002": { chery: ["Tiggo 8 Pro Max"], jac: ["JS4"] },
  "elc-002": { haval: ["Jolion"], gwm: ["Tank 300"] },
  "bdy-003": { changan: ["CS75 Plus"], omoda: ["Omoda C5"] },
  "trn-001": { chery: ["Tiggo 2"] },
  "trn-002": { mg: ["MG ZS / ZS EV"], geely: ["Coolray"] },
  "col-001": { haval: ["H6 3rd Gen"], jetour: ["X70 Plus"] },
};

export interface Fitment {
  brandId: string;
  model: string;
  modelSlug: string;
}

export function getBrand(brandId: string): CarBrand | undefined {
  return carBrands.find((b) => b.id === brandId);
}

export function getModelBySlug(brandId: string, modelSlug: string): string | undefined {
  return getBrand(brandId)?.models?.find((m) => slugify(m) === modelSlug);
}

/** Validated fitment entries for a product (brand must be compatible, model must exist). */
export function getFitment(product: Product): Fitment[] {
  const entry = fitmentSeed[product.id];
  if (!entry) return [];
  const out: Fitment[] = [];
  for (const [brandId, models] of Object.entries(entry)) {
    const brand = getBrand(brandId);
    if (!brand || !product.compatibleBrandIds.includes(brandId)) continue;
    for (const model of models) {
      if (brand.models?.includes(model)) {
        out.push({ brandId, model, modelSlug: slugify(model) });
      }
    }
  }
  return out;
}

export function getSku(product: Product): string {
  return `SG-${product.id.toUpperCase()}`;
}

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getPartsForBrand(brandId: string): Product[] {
  return products.filter((p) => p.compatibleBrandIds.includes(brandId));
}

/** Strict: only parts whose confirmed fitment lists this exact model. */
export function getPartsForModel(brandId: string, modelSlug: string): Product[] {
  return products.filter((p) =>
    getFitment(p).some((f) => f.brandId === brandId && f.modelSlug === modelSlug),
  );
}

export function getModelsForBrand(brandId: string) {
  const brand = getBrand(brandId);
  return (brand?.models ?? []).map((name) => {
    const slug = slugify(name);
    return { name, slug, partCount: getPartsForModel(brandId, slug).length };
  });
}

/** Models that have at least one confirmed part (used by the landing-page model filter). */
export function getConfirmedModels(brandIds: string[] = []) {
  const ids = brandIds.length ? brandIds : carBrands.map((b) => b.id);
  return ids.flatMap((brandId) =>
    getModelsForBrand(brandId)
      .filter((m) => m.partCount > 0)
      .map((m) => ({ ...m, brandId })),
  );
}

export function getPartUrl(product: Product, brandId: string, modelSlug: string): string {
  return `/products/${brandId}/${modelSlug}/${product.slug}`;
}

/** Canonical URL for a part: its first confirmed brand/model, or null if none. */
export function getPrimaryPartUrl(product: Product): string | null {
  const first = getFitment(product)[0];
  return first ? getPartUrl(product, first.brandId, first.modelSlug) : null;
}

/** Link for a part when viewed in a brand context (first confirmed model of that brand). */
export function getPartUrlForBrand(product: Product, brandId: string): string | null {
  const match = getFitment(product).find((f) => f.brandId === brandId);
  return match ? getPartUrl(product, match.brandId, match.modelSlug) : null;
}

export function getRelatedParts(product: Product, brandId: string, modelSlug: string, limit = 4) {
  const sameModel = getPartsForModel(brandId, modelSlug).filter((p) => p.id !== product.id);
  const sameCategory = getPartsForBrand(brandId).filter(
    (p) => p.id !== product.id && p.category === product.category && !sameModel.includes(p),
  );
  return [...sameModel, ...sameCategory].slice(0, limit);
}

/** Split "Front axle, ceramic compound, OE fitment" into bullet points (EN and AR commas). */
export function splitSpec(spec: string): string[] {
  return spec
    .split(/[,،]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}
