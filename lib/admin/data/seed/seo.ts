import { contact, locations } from "@/lib/data/company";
import { siteConfig } from "@/lib/seo/site";
import type { Log404, Redirect, RobotsConfig, SchemaEntry, SeoGlobal, SitemapSettings } from "../types";
import { L, baseFields } from "./util";

export function seedSeoGlobal(): SeoGlobal {
  return {
    defaultTitlePattern: `%s | ${siteConfig.name}`,
    defaultDescription: L(siteConfig.description),
    defaultSocialImage: siteConfig.ogImage,
    siteName: siteConfig.name,
    organisationName: siteConfig.legalName,
    organisationLogo: "/icon.svg",
    socialProfiles: [],
    templates: {
      product: "%product% | %brand% %model% spare part | %site%",
      brand: "%brand% spare parts | %site%",
      model: "%brand% %model% spare parts | %site%",
      category: "%category% for Chinese vehicles | %site%",
      blog: "%title% | %site% Blog",
      country: "Chinese auto parts in %country% | %site%",
    },
    indexing: { archives: true, search: false, filters: false },
    updatedAt: "2026-09-01T09:00:00.000Z",
  };
}

export function seedSitemap(): SitemapSettings {
  return {
    include: {
      pages: true,
      products: true,
      brands: true,
      models: true,
      categories: true,
      blogs: true,
      tags: false,
      countries: false,
      jobs: true,
    },
    imageSitemap: false,
    lastGeneratedAt: "",
    entryCount: 0,
  };
}

export function seedRobots(): RobotsConfig {
  return {
    rules: `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteConfig.url}/sitemap.xml\n`,
    updatedAt: "2026-09-01T09:00:00.000Z",
  };
}

const orgJson = JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: "sales",
      areaServed: "AE",
    },
  },
  null,
  2,
);

const json = (o: unknown) => JSON.stringify(o, null, 2);

/** Types the live site already emits are enabled; the others are ready to enable. */
export function seedSchemas(): SchemaEntry[] {
  const mk = (
    id: string,
    schemaType: SchemaEntry["schemaType"],
    name: string,
    scope: string,
    jsonLd: string,
    enabled: boolean,
  ): SchemaEntry => ({ ...baseFields(id), schemaType, name, scope, jsonLd, enabled });
  return [
    mk("sch-org", "Organization", "Organisation (matches the live site)", "global", orgJson, true),
    mk("sch-website", "WebSite", "Website", "global", json({ "@context": "https://schema.org", "@type": "WebSite", name: siteConfig.name, url: siteConfig.url }), false),
    mk("sch-webpage", "WebPage", "WebPage (default)", "page", json({ "@context": "https://schema.org", "@type": "WebPage", name: "%title%", url: "%url%" }), false),
    mk("sch-breadcrumb", "BreadcrumbList", "Breadcrumb (matches the live site)", "global", json({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url }] }), true),
    mk("sch-product", "Product", "Product (matches the live site)", "product", json({ "@context": "https://schema.org", "@type": "Product", name: "%product%", sku: "%sku%", category: "%category%", image: "%image%", url: "%url%" }), true),
    mk("sch-article", "Article", "Blog article", "blog", json({ "@context": "https://schema.org", "@type": "Article", headline: "%title%", datePublished: "%date%", author: { "@type": "Person", name: "%author%" }, image: "%image%" }), false),
    mk("sch-jobposting", "JobPosting", "Job posting", "job", json({ "@context": "https://schema.org", "@type": "JobPosting", title: "%title%", datePosted: "%datePosted%", validThrough: "%validThrough%", hiringOrganization: { "@type": "Organization", name: siteConfig.legalName }, jobLocation: { "@type": "Place", address: "%location%" } }), false),
    mk("sch-faq", "FAQPage", "FAQ (matches the live site)", "page", json({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "%question%", acceptedAnswer: { "@type": "Answer", text: "%answer%" } }] }), true),
    ...locations.map((l) =>
      mk(
        `sch-local-${l.id}`,
        "LocalBusiness",
        `Local business: ${l.label} (matches the live site)`,
        "location",
        json({ "@context": "https://schema.org", "@type": "AutoPartsStore", name: `${siteConfig.name} - ${l.label}`, address: l.address, telephone: l.phone, openingHours: "Mo-Fr 08:00-21:00", url: siteConfig.url, email: contact.emails.primary }),
        true,
      ),
    ),
  ];
}

/** SAMPLE rows: the live site has no redirect rules or 404 logging yet. */
export function seedRedirects(): Redirect[] {
  const rows: Omit<Redirect, keyof ReturnType<typeof baseFields>>[] = [
    { oldUrl: "/career", newUrl: "/careers", type: 301, enabled: true, notes: "Sample: two URLs serve the same page today.", hits: 42, lastHit: "2026-09-18T10:12:00.000Z" },
    { oldUrl: "/blog", newUrl: "/blogs", type: 301, enabled: true, notes: "Sample: two URLs serve the same page today.", hits: 17, lastHit: "2026-09-16T08:02:00.000Z" },
    { oldUrl: "/old-catalogue", newUrl: "/products", type: 302, enabled: false, notes: "Sample: temporary redirect, disabled.", hits: 0, lastHit: "" },
  ];
  return rows.map((r, i) => ({ ...baseFields(`rdr-sample-${i + 1}`, "published", true), ...r }));
}

export function seedLog404(): Log404[] {
  const rows: Omit<Log404, keyof ReturnType<typeof baseFields>>[] = [
    { url: "/products/jetour/x70", hits: 23, lastHit: "2026-09-19T15:40:00.000Z", referrer: "https://www.google.com/" },
    { url: "/catalogue.pdf", hits: 9, lastHit: "2026-09-17T12:05:00.000Z", referrer: "" },
    { url: "/wp-login.php", hits: 61, lastHit: "2026-09-20T03:21:00.000Z", referrer: "" },
  ];
  return rows.map((r, i) => ({ ...baseFields(`l404-sample-${i + 1}`, "published", true), ...r }));
}
