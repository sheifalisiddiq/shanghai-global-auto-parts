import { siteConfig } from "@/lib/seo/site";
import type {
  BlogPost,
  BlogTag,
  Brand,
  Category,
  Country,
  Job,
  Model,
  PageDoc,
  Product,
  SitemapSettings,
} from "@/lib/admin/data/types";

export interface SitemapEntry {
  url: string;
  group: string;
  lastmod: string;
  priority: number;
  changefreq: "weekly" | "monthly";
}

interface Sources {
  pages: { key: string; doc: PageDoc }[];
  products: readonly Product[];
  brands: readonly Brand[];
  models: readonly Model[];
  categories: readonly Category[];
  posts: readonly BlogPost[];
  tags: readonly BlogTag[];
  countries: readonly Country[];
  jobs: readonly Job[];
}

const live = <T extends { status: string; seo: { sitemapInclude: boolean; index: boolean } }>(rows: readonly T[]) =>
  rows.filter((r) => r.status === "published" && r.seo.sitemapInclude && r.seo.index);

/** Builds the sitemap entries from the demo data and the include/exclude settings. */
export function buildSitemap(settings: SitemapSettings, s: Sources): SitemapEntry[] {
  const base = siteConfig.url;
  const out: SitemapEntry[] = [];
  const add = (group: string, path: string, lastmod: string, priority: number, changefreq: "weekly" | "monthly" = "monthly") =>
    out.push({ url: `${base}${path}`, group, lastmod: lastmod.slice(0, 10), priority, changefreq });

  if (settings.include.pages) {
    for (const p of s.pages) {
      if (p.doc.status !== "published" || !p.doc.seo.sitemapInclude || !p.doc.seo.index) continue;
      add("Pages", p.doc.slug ? `/${p.doc.slug}` : "", p.doc.updatedAt, p.doc.slug ? 0.8 : 1, p.doc.slug ? "monthly" : "weekly");
    }
  }
  if (settings.include.brands) for (const b of live(s.brands)) add("Brands", `/products/${b.slug}`, b.updatedAt, 0.7);
  if (settings.include.models) {
    const brand = new Map(s.brands.map((b) => [b.id, b.slug]));
    for (const m of live(s.models)) add("Models", `/products/${brand.get(m.brandId) ?? m.brandId}/${m.slug}`, m.updatedAt, 0.6);
  }
  if (settings.include.products) {
    const brand = new Map(s.brands.map((b) => [b.id, b.slug]));
    const model = new Map(s.models.map((m) => [m.id, m.slug]));
    for (const p of live(s.products)) {
      const bs = brand.get(p.brandId);
      const ms = model.get(p.modelId);
      // Only parts with a confirmed model have a page on the live site.
      if (bs && ms) add("Products", `/products/${bs}/${ms}/${p.slug}`, p.updatedAt, 0.5);
    }
  }
  if (settings.include.categories) for (const c of live(s.categories)) add("Categories", `/products?category=${c.slug}`, c.updatedAt, 0.6);
  if (settings.include.blogs) for (const p of live(s.posts)) add("Blogs", `/blogs/${p.slug}`, p.updatedAt, 0.6);
  if (settings.include.tags) for (const t of live(s.tags)) add("Tags", `/blogs?tag=${t.slug}`, t.updatedAt, 0.3);
  if (settings.include.countries) for (const c of live(s.countries)) if (c.archiveEnabled) add("Countries", `/countries/${c.slug}`, c.updatedAt, 0.4);
  if (settings.include.jobs) for (const j of live(s.jobs)) if (j.jobStatus === "open") add("Jobs", `/careers#${j.slug}`, j.updatedAt, 0.5);
  return out;
}

export function sitemapXml(entries: SitemapEntry[]): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      (e) => `  <url>\n    <loc>${esc(e.url)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority.toFixed(1)}</priority>\n  </url>`,
    ),
    "</urlset>",
  ].join("\n");
}
