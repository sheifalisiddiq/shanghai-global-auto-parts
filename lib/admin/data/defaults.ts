import type { Localized, SeoFields } from "./types";

export const emptyLocalized = (): Localized => ({ en: "", ar: "" });
export const loc = (en: string, ar = ""): Localized => ({ en, ar });

export const emptySeo = (): SeoFields => ({
  metaTitle: emptyLocalized(),
  metaDescription: emptyLocalized(),
  focusKeyword: "",
  canonicalUrl: "",
  index: true,
  follow: true,
  sitemapInclude: true,
  og: { title: emptyLocalized(), description: emptyLocalized(), image: "" },
  twitter: { card: "summary_large_image", title: emptyLocalized(), description: emptyLocalized(), image: "" },
  schemaType: "",
  customJsonLd: "",
});

export const nowIso = () => new Date().toISOString();

export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Text of a possibly-localized value (English first). */
export function textOf(v: unknown): string {
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && "en" in v) {
    const l = v as Localized;
    return l.en || l.ar || "";
  }
  return "";
}

/** Human label for any entity (name / title / oldUrl ...). */
export function labelOf(e: unknown): string {
  if (!e || typeof e !== "object") return "";
  const r = e as Record<string, unknown>;
  for (const k of ["name", "title", "oldUrl", "url", "summary", "email"]) {
    if (r[k]) return textOf(r[k]);
  }
  return String(r.id ?? "");
}
