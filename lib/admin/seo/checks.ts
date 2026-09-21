import type { Localized, Redirect, SchemaType, SeoFields } from "@/lib/admin/data/types";

/** Pure SEO helpers (no React): previews, checklists, validators. */

export const TITLE_MAX = 60;
export const DESC_MAX = 160;

export interface Check {
  ok: boolean;
  label: string;
}

const lower = (s: string) => s.toLowerCase();

export function seoChecklist(seo: SeoFields, slug: string, lang: "en" | "ar" = "en"): Check[] {
  const title = seo.metaTitle[lang];
  const desc = seo.metaDescription[lang];
  const kw = lower(seo.focusKeyword.trim());
  const checks: Check[] = [
    { ok: title.length >= 30 && title.length <= TITLE_MAX, label: `Meta title is 30-${TITLE_MAX} characters (${title.length})` },
    { ok: desc.length >= 70 && desc.length <= DESC_MAX, label: `Meta description is 70-${DESC_MAX} characters (${desc.length})` },
    { ok: !!slug, label: "Slug is set" },
  ];
  if (kw) {
    checks.push(
      { ok: lower(title).includes(kw), label: "Focus keyword appears in the meta title" },
      { ok: lower(desc).includes(kw), label: "Focus keyword appears in the meta description" },
      { ok: lower(slug).includes(kw.replace(/\s+/g, "-")), label: "Focus keyword appears in the slug" },
    );
  } else {
    checks.push({ ok: false, label: "Focus keyword is set" });
  }
  if (seo.customJsonLd.trim()) {
    checks.push({ ok: validateJsonLd(seo.customJsonLd).ok, label: "Custom JSON-LD is valid" });
  }
  return checks;
}

export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export function serpPreview(seo: SeoFields, slug: string, fallbackTitle: string, baseUrl: string, lang: "en" | "ar" = "en") {
  const title = seo.metaTitle[lang] || fallbackTitle;
  const desc = seo.metaDescription[lang] || "No meta description set. Search engines will pick text from the page.";
  const url = seo.canonicalUrl || `${baseUrl}${slug ? `/${slug}` : ""}`;
  return { title: truncate(title, TITLE_MAX + 5), desc: truncate(desc, DESC_MAX + 10), url };
}

/* ------------------------------- JSON-LD ------------------------------- */

const REQUIRED: Partial<Record<string, string[]>> = {
  Organization: ["name"],
  WebSite: ["name", "url"],
  WebPage: ["name"],
  BreadcrumbList: ["itemListElement"],
  Product: ["name"],
  Article: ["headline"],
  JobPosting: ["title", "datePosted", "hiringOrganization"],
  FAQPage: ["mainEntity"],
  LocalBusiness: ["name", "address"],
  AutoPartsStore: ["name", "address"],
};

export interface JsonLdResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  types: string[];
}

export function validateJsonLd(text: string, expected?: SchemaType): JsonLdResult {
  const result: JsonLdResult = { ok: false, errors: [], warnings: [], types: [] };
  if (!text.trim()) {
    result.errors.push("JSON-LD is empty.");
    return result;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    result.errors.push(`Not valid JSON: ${(e as Error).message}`);
    return result;
  }
  const nodes = Array.isArray(parsed) ? parsed : [parsed];
  nodes.forEach((node, i) => {
    const where = nodes.length > 1 ? ` (item ${i + 1})` : "";
    if (!node || typeof node !== "object") {
      result.errors.push(`Must be an object${where}.`);
      return;
    }
    const n = node as Record<string, unknown>;
    const ctx = String(n["@context"] ?? "");
    if (!ctx.includes("schema.org")) result.errors.push(`"@context" must be "https://schema.org"${where}.`);
    const type = n["@type"];
    if (!type) {
      result.errors.push(`Missing "@type"${where}.`);
      return;
    }
    const t = Array.isArray(type) ? String(type[0]) : String(type);
    result.types.push(t);
    for (const key of REQUIRED[t] ?? []) {
      if (n[key] === undefined || n[key] === "") result.errors.push(`${t} needs "${key}"${where}.`);
    }
    if (!REQUIRED[t]) result.warnings.push(`No built-in checks for type "${t}"${where}.`);
    if (expected && t !== expected && !(expected === "LocalBusiness" && t === "AutoPartsStore")) {
      result.warnings.push(`Expected type "${expected}" but found "${t}"${where}.`);
    }
  });
  result.ok = result.errors.length === 0;
  return result;
}

/* ------------------------------- robots.txt ------------------------------- */

const DIRECTIVES = ["user-agent", "allow", "disallow", "sitemap", "crawl-delay", "host"];

export interface RobotsResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export function validateRobots(text: string): RobotsResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let sawAgent = false;
  let sawSitemap = false;
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.split("#")[0].trim();
    if (!line) return;
    const idx = line.indexOf(":");
    if (idx < 1) {
      errors.push(`Line ${i + 1}: expected "Directive: value".`);
      return;
    }
    const dir = line.slice(0, idx).trim().toLowerCase();
    const val = line.slice(idx + 1).trim();
    if (!DIRECTIVES.includes(dir)) {
      errors.push(`Line ${i + 1}: unknown directive "${dir}".`);
      return;
    }
    if (dir === "user-agent") sawAgent = true;
    if ((dir === "allow" || dir === "disallow") && !sawAgent) errors.push(`Line ${i + 1}: "${dir}" must come after a User-agent line.`);
    if (dir === "disallow" && val === "/") warnings.push(`Line ${i + 1}: "Disallow: /" blocks the whole site from search engines.`);
    if ((dir === "allow" || dir === "disallow") && val && !val.startsWith("/") && !val.startsWith("*")) errors.push(`Line ${i + 1}: paths must start with "/".`);
    if (dir === "sitemap") {
      sawSitemap = true;
      if (!/^https?:\/\//i.test(val)) errors.push(`Line ${i + 1}: Sitemap must be an absolute URL.`);
    }
  });
  if (!sawAgent) errors.push("Add at least one User-agent line.");
  if (!sawSitemap) warnings.push("No Sitemap line: add your sitemap URL.");
  return { ok: errors.length === 0, errors, warnings };
}

/* -------------------------------- redirects -------------------------------- */

export interface RedirectIssue {
  id: string;
  level: "error" | "warning";
  message: string;
}

/** Loop / chain / duplicate / self-redirect detection over enabled rules. */
export function redirectIssues(rows: readonly Redirect[]): RedirectIssue[] {
  const issues: RedirectIssue[] = [];
  const active = rows.filter((r) => r.status !== "trash");
  const enabled = active.filter((r) => r.enabled);
  const byOld = new Map<string, Redirect[]>();
  for (const r of active) byOld.set(r.oldUrl, [...(byOld.get(r.oldUrl) ?? []), r]);

  for (const r of active) {
    if (r.oldUrl === r.newUrl) issues.push({ id: r.id, level: "error", message: "Redirects to itself." });
    if ((byOld.get(r.oldUrl) ?? []).length > 1) issues.push({ id: r.id, level: "warning", message: `Another rule already uses ${r.oldUrl} (conflict).` });
  }
  const map = new Map(enabled.map((r) => [r.oldUrl, r.newUrl]));
  for (const r of enabled) {
    const seen = new Set([r.oldUrl]);
    let cur = r.newUrl;
    let hops = 0;
    while (map.has(cur)) {
      if (seen.has(cur)) {
        issues.push({ id: r.id, level: "error", message: "Redirect loop detected." });
        break;
      }
      seen.add(cur);
      cur = map.get(cur)!;
      hops++;
    }
    if (hops > 0 && !issues.some((i) => i.id === r.id && i.message.includes("loop"))) {
      issues.push({ id: r.id, level: "warning", message: `Redirect chain (${hops + 1} hops). Point it straight at the final URL.` });
    }
  }
  return issues;
}

export function isLocalized(v: unknown): v is Localized {
  return !!v && typeof v === "object" && "en" in (v as object);
}
