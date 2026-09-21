import { blogPosts, type BlogPost as SitePost } from "@/lib/data/blogs";
import { googleRating, reviews } from "@/lib/data/company";
import { slugify } from "@/lib/data/catalog";
import type { BlogCategory, BlogPost, BlogTag, Testimonial } from "../types";
import { L, baseFields, seoFrom } from "./util";

/** The live site's five categories, then the five categories listed in the PDF. */
const SITE_CATEGORIES = ["Fitment & VIN", "Sourcing & Original", "Maintenance", "Operations & QC", "Logistics & Trade"];
const PDF_CATEGORIES: { name: string; purpose: string }[] = [
  { name: "Latest Updates", purpose: "Recent company, market, branch, product or industry updates" },
  { name: "Product Guides", purpose: "Buying guides, fitment guides, model/part guides, maintenance and comparison content" },
  { name: "Testimonials", purpose: "Customer and company testimonials" },
  { name: "Company News", purpose: "Company announcements, branch updates, events, hiring/news, milestones" },
  { name: "Automotive Tips", purpose: "Maintenance tips, spare-parts education, technical explanations and practical advice" },
];

export const catId = (name: string) => `bc-${slugify(name)}`;
export const tagId = (name: string) => `tag-${slugify(name)}`;

export function seedBlogCategories(): BlogCategory[] {
  const rows = [
    ...SITE_CATEGORIES.map((name) => ({ name, purpose: "" })),
    ...PDF_CATEGORIES,
  ];
  return rows.map((r, i) => ({
    ...baseFields(catId(r.name)),
    name: L(r.name),
    slug: slugify(r.name),
    description: L(""),
    purpose: L(r.purpose),
    banner: "",
    thumbnail: "",
    sortOrder: i + 1,
    seo: seoFrom(`${r.name} | Blog`, r.purpose),
  }));
}

export function seedTags(): BlogTag[] {
  const names = Array.from(new Set(blogPosts.flatMap((p) => p.tags)));
  return names.map((name) => ({
    ...baseFields(tagId(name)),
    name: L(name),
    slug: slugify(name),
    description: L(""),
    seo: seoFrom(name, ""),
  }));
}

function toHtml(p: SitePost): string {
  const c = p.content;
  const parts: string[] = [`<p>${c.intro}</p>`];
  for (const s of c.sections) {
    parts.push(`<h2>${s.heading}</h2>`);
    for (const para of s.paragraphs) parts.push(`<p>${para}</p>`);
    if (s.bulletPoints?.length) parts.push(`<ul>${s.bulletPoints.map((b) => `<li>${b}</li>`).join("")}</ul>`);
  }
  parts.push(`<h2>Conclusion</h2><p>${c.conclusion}</p>`);
  if (c.keyTakeaways?.length) {
    parts.push(`<h2>Key takeaways</h2><ul>${c.keyTakeaways.map((k) => `<li>${k}</li>`).join("")}</ul>`);
  }
  return parts.join("");
}

function toIso(date: string): string {
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? "2026-09-01T09:00:00.000Z" : d.toISOString();
}

export function seedPosts(): BlogPost[] {
  return blogPosts.map((p) => ({
    ...baseFields(p.slug),
    title: L(p.title),
    slug: p.slug,
    excerpt: L(p.excerpt),
    content: L(toHtml(p)),
    authorName: p.author.name,
    authorRole: p.author.role,
    publishDate: toIso(p.date),
    scheduledAt: "",
    featuredImage: p.image,
    imageAlt: L(p.title),
    categoryId: catId(p.category),
    tagIds: p.tags.map(tagId),
    countryIds: [],
    relatedPostIds: [],
    relatedProductIds: [],
    relatedBrandIds: [],
    relatedModelIds: [],
    internalLinks: [],
    cta: { label: L("Enquire now"), url: "/products#enquire" },
    readTime: p.readTime,
    featured: !!p.featured,
    seo: seoFrom(p.title, p.excerpt),
  }));
}

export function seedTestimonials(): Testimonial[] {
  return reviews.map((r) => ({
    ...baseFields(r.id),
    name: r.author,
    slug: slugify(r.author),
    meta: L(r.meta ?? "", r.metaAr ?? ""),
    country: "",
    text: L(r.quote, r.quoteAr ?? ""),
    videoUrl: "",
    rating: googleRating.score >= 4.5 ? 5 : 4,
    relatedProductId: "",
    relatedBrandId: "",
    image: "",
    thumbnail: "",
    imageAlt: L(""),
    featured: true,
    seo: seoFrom(`${r.author} testimonial`, r.quote.slice(0, 155)),
  }));
}
