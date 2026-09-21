import { contact, locations } from "@/lib/data/company";
import { siteConfig } from "@/lib/seo/site";
import type {
  AdminUserRow,
  AuditEntry,
  Backup,
  CacheStatus,
  CodeSnippet,
  Enquiry,
  MediaItem,
  Plugin,
  SiteSettings,
} from "../types";
import { L, baseFields } from "./util";

const S = (id: string) => baseFields(id, "published", true);

/** SAMPLE users (the five demo accounts + one extra). Only the five demo accounts can log in. */
export function seedUsers(): AdminUserRow[] {
  return [
    { ...S("u-admin"), name: "Demo Administrator", email: "admin@shanghaiglobal.demo", roleId: "administrator", active: true, lastLogin: "2026-09-20T08:00:00.000Z" },
    { ...S("u-seo"), name: "Demo SEO Manager", email: "seo@shanghaiglobal.demo", roleId: "seo-manager", active: true, lastLogin: "2026-09-19T14:10:00.000Z" },
    { ...S("u-content"), name: "Demo Content Editor", email: "content@shanghaiglobal.demo", roleId: "content-editor", active: true, lastLogin: "2026-09-19T09:30:00.000Z" },
    { ...S("u-products"), name: "Demo Product Manager", email: "products@shanghaiglobal.demo", roleId: "product-manager", active: true, lastLogin: "2026-09-18T11:45:00.000Z" },
    { ...S("u-hr"), name: "Demo HR Manager", email: "hr@shanghaiglobal.demo", roleId: "hr", active: true, lastLogin: "2026-09-17T16:20:00.000Z" },
    { ...S("u-extra"), name: "Sample Former Editor", email: "former.editor@example.com", roleId: "content-editor", active: false, lastLogin: "2026-08-02T10:00:00.000Z" },
  ];
}

export function seedAudit(): AuditEntry[] {
  const rows: Omit<AuditEntry, keyof ReturnType<typeof baseFields>>[] = [
    { at: "2026-09-18T10:00:00.000Z", actor: "Demo Content Editor", actorRole: "Content Editor", action: "publish", collection: "posts", entityId: "vin-identification-guide", summary: "Sample: published a blog post", before: "", after: "" },
    { at: "2026-09-17T13:20:00.000Z", actor: "Demo SEO Manager", actorRole: "SEO Manager", action: "update", collection: "redirects", entityId: "rdr-sample-1", summary: "Sample: edited a redirect", before: "", after: "" },
    { at: "2026-09-16T09:05:00.000Z", actor: "Demo Product Manager", actorRole: "Product Manager", action: "update", collection: "products", entityId: "brk-001", summary: "Sample: updated a product", before: "", after: "" },
  ];
  return rows.map((r, i) => ({ ...S(`aud-sample-${i + 1}`), ...r }));
}

export function seedSnippets(): CodeSnippet[] {
  return [
    {
      ...S("snp-sample-1"),
      name: "Sample analytics snippet",
      description: "Sample only. Replace with the real tracking snippet.",
      codeType: "javascript",
      placement: "header",
      scope: "site-wide",
      scopeTargets: "",
      code: "// SAMPLE: analytics placeholder (not executed in admin)\nwindow.dataLayer = window.dataLayer || [];",
      enabled: false,
      version: 1,
      author: "Demo Administrator",
      validation: "valid",
      history: [{ version: 1, at: "2026-09-01T09:00:00.000Z", by: "Demo Administrator", code: "// SAMPLE: analytics placeholder (not executed in admin)\nwindow.dataLayer = window.dataLayer || [];" }],
    },
    {
      ...S("snp-sample-2"),
      name: "Sample banner style",
      description: "Sample only.",
      codeType: "css",
      placement: "header",
      scope: "selected",
      scopeTargets: "/products",
      code: ".sample-banner { background: #fff3cd; }",
      enabled: true,
      version: 2,
      author: "Demo Administrator",
      validation: "valid",
      history: [
        { version: 1, at: "2026-08-20T09:00:00.000Z", by: "Demo Administrator", code: ".sample-banner { background: #fff; }" },
        { version: 2, at: "2026-09-01T09:00:00.000Z", by: "Demo Administrator", code: ".sample-banner { background: #fff3cd; }" },
      ],
    },
  ];
}

export function seedPlugins(): Plugin[] {
  return [
    { ...S("plg-sample-1"), name: "Sample image optimiser", version: "1.2.0", author: "Sample Vendor", description: "Sample plugin. Compresses uploaded images.", installedAt: "2026-08-10T09:00:00.000Z", active: true, updateAvailable: "1.3.0", installed: true, checks: ["File type OK", "Version OK", "Compatible", "No dependency issues", "Security scan clean"] },
    { ...S("plg-sample-2"), name: "Sample form spam guard", version: "0.9.4", author: "Sample Vendor", description: "Sample plugin. Blocks spam on public forms.", installedAt: "2026-07-22T09:00:00.000Z", active: false, updateAvailable: "", installed: true, checks: ["File type OK", "Version OK", "Compatible", "No dependency issues", "Security scan clean"] },
  ];
}

export function seedBackups(): Backup[] {
  return [
    { ...S("bkp-sample-1"), type: "full", createdAt: "2026-09-15T02:00:00.000Z", createdBy: "System", notes: "Sample nightly backup", sizeMb: 412, restorePoint: true },
    { ...S("bkp-sample-2"), type: "database", createdAt: "2026-09-10T02:00:00.000Z", createdBy: "Demo Administrator", notes: "Sample: before catalogue import", sizeMb: 38, restorePoint: true },
    { ...S("bkp-sample-3"), type: "settings", createdAt: "2026-09-01T02:00:00.000Z", createdBy: "System", notes: "Sample settings snapshot", sizeMb: 1, restorePoint: false },
  ];
}

export function seedCache(): CacheStatus {
  return {
    pageCache: true,
    objectCache: false,
    cdn: true,
    lastCleared: "",
    lastCdnPurge: "",
    lastAssetRebuild: "",
    environment: "Demo (simulated: no server connected)",
  };
}

export function seedSettings(): SiteSettings {
  return {
    siteName: siteConfig.name,
    hotline: contact.primaryPhone,
    secondaryPhone: "+971 2 622 5133",
    whatsapp: "+971 6 533 5866",
    emailPrimary: contact.emails.primary,
    emailSecondary: contact.emails.secondary,
    businessHours: L(contact.hours),
    offices: locations.map((l) => ({
      label: L(l.label),
      address: L(l.address),
      phone: l.phone,
      country: l.id === "qatar" ? "Qatar" : "United Arab Emirates",
    })),
    socialProfiles: [],
    enquiryEmail: siteConfig.email,
    hrEmail: siteConfig.email,
    updatedAt: "2026-09-01T09:00:00.000Z",
  };
}

/** SAMPLE enquiries: the live forms email the business and store nothing. */
export function seedEnquiries(): Enquiry[] {
  const rows: Omit<Enquiry, keyof ReturnType<typeof baseFields>>[] = [
    { source: "contact", name: "Sample Contact One", email: "contact.one@example.com", phone: "+971 50 111 0001", country: "United Arab Emirates", subject: "Wholesale pricing", message: "Sample enquiry: please send your wholesale price list for Jetour parts.", consent: true, receivedAt: "2026-09-19T09:15:00.000Z", enquiryStatus: "new" },
    { source: "contact", name: "Sample Contact Two", email: "contact.two@example.com", phone: "+974 5000 0002", country: "Qatar", subject: "Partnership", message: "Sample enquiry: we would like to discuss a distribution partnership.", consent: true, receivedAt: "2026-09-17T13:40:00.000Z", enquiryStatus: "in-progress" },
    { source: "contact", name: "Sample Contact Three", email: "contact.three@example.com", phone: "+971 50 111 0003", country: "United Arab Emirates", subject: "Delivery times", message: "Sample enquiry: how long does delivery to Abu Dhabi take?", consent: true, receivedAt: "2026-09-12T10:05:00.000Z", enquiryStatus: "closed" },
    { source: "product", name: "Sample Buyer One", email: "buyer.one@example.com", phone: "+971 50 222 0001", country: "United Arab Emirates", subject: "Brakes", message: "Sample enquiry: need front brake pads for a Chery Tiggo 7 Pro, VIN available.", consent: true, receivedAt: "2026-09-20T07:30:00.000Z", enquiryStatus: "new" },
    { source: "product", name: "Sample Buyer Two", email: "buyer.two@example.com", phone: "+971 50 222 0002", country: "United Arab Emirates", subject: "Filters", message: "Sample enquiry: quote for 50 oil filters.", consent: true, receivedAt: "2026-09-18T15:00:00.000Z", enquiryStatus: "in-progress" },
    { source: "product", name: "Sample Buyer Three", email: "buyer.three@example.com", phone: "+974 5000 0003", country: "Qatar", subject: "Suspension", message: "Sample enquiry: control arms for MG ZS.", consent: true, receivedAt: "2026-09-11T11:25:00.000Z", enquiryStatus: "closed" },
  ];
  return rows.map((r, i) => ({ ...S(`enq-sample-${i + 1}`), ...r }));
}

const FILES = [
  "/images/about/factory-line.jpg",
  "/images/careers/automotive-engineer-hero.png",
  "/images/hero/hero-bg.jpg",
  "/images/hero/hero-parts.jpg",
  "/images/warehouse/qc-technician.jpg",
  "/images/engine_schematic/cad_engine.jpg",
  "/images/engine_schematic/cad_transparent.png",
  "/images/engine_schematic/full_transparent.png",
  ...["body-accessories", "brakes", "cooling", "electrical", "engine", "filters", "suspension", "transmission"].flatMap((c) => [
    `/images/products/${c}/category.jpg`,
    `/images/products/${c}/1.jpg`,
    `/images/products/${c}/2.jpg`,
    `/images/products/${c}/3.jpg`,
  ]),
  "/logos/baic.png",
  "/logos/byd.svg",
  "/logos/changan.svg",
  "/logos/chery.svg",
  "/logos/geely.svg",
  "/logos/gwm.svg",
  "/logos/haval.svg",
  "/logos/jac.png",
  "/logos/jetour.svg",
  "/logos/ldv.svg",
  "/logos/mg.svg",
  "/logos/nio.svg",
  "/logos/omoda.svg",
];

/** Real site assets (not sample). ALT text is left empty for the client to fill in. */
export function seedMedia(): MediaItem[] {
  return FILES.map((url) => {
    const parts = url.split("/").filter(Boolean);
    const name = parts[parts.length - 1];
    return {
      ...baseFields(`med-${parts.slice(1).join("-").replace(/\.[a-z]+$/, "")}`),
      name,
      url,
      type: "image" as const,
      folder: parts.slice(0, -1).join("/"),
      size: 0,
      alt: "",
      title: name.replace(/\.[a-z]+$/, "").replace(/[-_]/g, " "),
      uploadedBy: "Seed",
    };
  });
}
