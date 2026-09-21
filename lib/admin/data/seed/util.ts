import { emptySeo, loc, nowIso } from "../defaults";
import type { Base, Localized, SeoFields, Status } from "../types";

const SEEDED_AT = "2026-09-01T09:00:00.000Z";

export function baseFields(id: string, status: Status = "published", isSample = false): Base {
  return {
    id,
    status,
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
    updatedBy: "Seed",
    isSample,
    deletedAt: null,
  };
}

/** SEO block pre-filled from what the live page already uses. */
export function seoFrom(title: string, description = "", extra: Partial<SeoFields> = {}): SeoFields {
  const seo = emptySeo();
  seo.metaTitle = loc(title);
  seo.metaDescription = loc(description);
  return { ...seo, ...extra };
}

export const L = (en: string, ar = ""): Localized => loc(en, ar);

export { nowIso };
