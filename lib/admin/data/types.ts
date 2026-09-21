import type { RoleId } from "@/lib/admin/access/roles";
import type { RoleOverrides } from "@/lib/admin/access/access";

/** English + Arabic text. Arabic is entered manually (no auto-translate). */
export interface Localized {
  en: string;
  ar: string;
}

export type Status = "draft" | "published" | "scheduled" | "archived" | "trash";

export interface Base {
  id: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  /** Seeded demo row. ALWAYS shown with a "Sample" badge in the UI. */
  isSample?: boolean;
  deletedAt?: string | null;
}

export interface SeoFields {
  metaTitle: Localized;
  metaDescription: Localized;
  focusKeyword: string;
  canonicalUrl: string;
  index: boolean;
  follow: boolean;
  sitemapInclude: boolean;
  og: { title: Localized; description: Localized; image: string };
  twitter: { card: "summary" | "summary_large_image"; title: Localized; description: Localized; image: string };
  schemaType: string;
  customJsonLd: string;
}

/* ------------------------------ Catalogue ------------------------------ */

export interface Brand extends Base {
  name: Localized;
  slug: string;
  category: Localized;
  badge: string;
  logo: string;
  shortDescription: Localized;
  longDescription: Localized;
  banner: string;
  thumbnail: string;
  sortOrder: number;
  featured: boolean;
  keyComponents: string[];
  seo: SeoFields;
}

export interface Model extends Base {
  name: Localized;
  slug: string;
  brandId: string;
  image: string;
  description: Localized;
  /** Year / generation / variant. */
  generation: string;
  featured: boolean;
  sortOrder: number;
  categoryIds: string[];
  seo: SeoFields;
}

export interface FitmentRow {
  brandId: string;
  modelId: string;
  years: string;
}

export interface Product extends Base {
  name: Localized;
  slug: string;
  sku: string;
  oemNumbers: string[];
  brandId: string;
  modelId: string;
  categoryId: string;
  /** Extra compatible vehicles (confirmed fitment). */
  fitment: FitmentRow[];
  yearGeneration: string;
  crossReferences: string[];
  shortDescription: Localized;
  fullDescription: Localized;
  features: { text: Localized }[];
  specifications: { label: Localized; value: Localized }[];
  fittingNotes: Localized;
  faq: { question: Localized; answer: Localized }[];
  mainImage: string;
  imageAlt: Localized;
  gallery: { url: string; alt: Localized }[];
  catalogPdf: string;
  commercial: {
    enquiryCta: boolean;
    whatsappCta: boolean;
    availability: "in-stock" | "on-request" | "out-of-stock";
    showPrice: boolean;
    price: string;
  };
  countryIds: string[];
  tags: string[];
  featured: boolean;
  seo: SeoFields;
}

export interface Category extends Base {
  name: Localized;
  slug: string;
  parentId: string;
  description: Localized;
  image: string;
  icon: string;
  seo: SeoFields;
}

export interface Country extends Base {
  name: Localized;
  slug: string;
  code: string;
  flag: string;
  shortDescription: Localized;
  longDescription: Localized;
  archiveEnabled: boolean;
  featured: boolean;
  sortOrder: number;
  banner: string;
  seo: SeoFields;
}

/* -------------------------------- Blogs -------------------------------- */

export interface BlogCategory extends Base {
  name: Localized;
  slug: string;
  description: Localized;
  purpose: Localized;
  banner: string;
  thumbnail: string;
  sortOrder: number;
  seo: SeoFields;
}

export interface BlogTag extends Base {
  name: Localized;
  slug: string;
  description: Localized;
  seo: SeoFields;
}

export interface BlogPost extends Base {
  title: Localized;
  slug: string;
  excerpt: Localized;
  /** Rich-text HTML per language. */
  content: Localized;
  authorName: string;
  authorRole: string;
  publishDate: string;
  scheduledAt: string;
  featuredImage: string;
  imageAlt: Localized;
  categoryId: string;
  tagIds: string[];
  countryIds: string[];
  relatedPostIds: string[];
  relatedProductIds: string[];
  relatedBrandIds: string[];
  relatedModelIds: string[];
  internalLinks: { label: string; url: string }[];
  cta: { label: Localized; url: string };
  readTime: string;
  featured: boolean;
  seo: SeoFields;
}

export interface Testimonial extends Base {
  name: string;
  slug: string;
  meta: Localized;
  country: string;
  text: Localized;
  videoUrl: string;
  rating: number;
  relatedProductId: string;
  relatedBrandId: string;
  image: string;
  thumbnail: string;
  imageAlt: Localized;
  featured: boolean;
  seo: SeoFields;
}

/* ------------------------------- Careers ------------------------------- */

export interface Job extends Base {
  title: Localized;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  salaryRange: string;
  showSalary: boolean;
  summary: Localized;
  responsibilities: { text: Localized }[];
  requirements: { text: Localized }[];
  skills: { text: Localized }[];
  benefits: { text: Localized }[];
  applicationDeadline: string;
  datePosted: string;
  validThrough: string;
  hiringOrganisation: string;
  applyUrl: string;
  hrEmail: string;
  cvUpload: boolean;
  jobStatus: "open" | "closed";
  seo: SeoFields;
}

export type ApplicationStatus = "new" | "under-review" | "shortlisted" | "rejected" | "hired";

export interface Application extends Base {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  appliedAt: string;
  cvFile: string;
  experience: string;
  notes: string;
  internalNotes: string;
  applicationStatus: ApplicationStatus;
}

/* ------------------------------ Enquiries ------------------------------ */

export type EnquiryStatus = "new" | "in-progress" | "closed";

export interface Enquiry extends Base {
  source: "contact" | "product";
  name: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  message: string;
  consent: boolean;
  receivedAt: string;
  enquiryStatus: EnquiryStatus;
}

/* -------------------------------- Media -------------------------------- */

export interface MediaItem extends Base {
  name: string;
  url: string;
  type: "image" | "video" | "document";
  folder: string;
  size: number;
  alt: string;
  title: string;
  uploadedBy: string;
}

/* ---------------------------------- SEO --------------------------------- */

export interface Redirect extends Base {
  oldUrl: string;
  newUrl: string;
  type: 301 | 302;
  enabled: boolean;
  notes: string;
  hits: number;
  lastHit: string;
}

export interface Log404 extends Base {
  url: string;
  hits: number;
  lastHit: string;
  referrer: string;
}

export const SCHEMA_TYPES = [
  "Organization",
  "WebSite",
  "WebPage",
  "BreadcrumbList",
  "Product",
  "Article",
  "JobPosting",
  "FAQPage",
  "LocalBusiness",
] as const;
export type SchemaType = (typeof SCHEMA_TYPES)[number];

export interface SchemaEntry extends Base {
  schemaType: SchemaType;
  name: string;
  /** "global" or a content scope: page / product / blog / job / location. */
  scope: string;
  jsonLd: string;
  enabled: boolean;
}

export interface SeoGlobal {
  defaultTitlePattern: string;
  defaultDescription: Localized;
  defaultSocialImage: string;
  siteName: string;
  organisationName: string;
  organisationLogo: string;
  socialProfiles: { network: string; url: string }[];
  templates: { product: string; brand: string; model: string; category: string; blog: string; country: string };
  indexing: { archives: boolean; search: boolean; filters: boolean };
  updatedAt: string;
}

export interface SitemapSettings {
  include: {
    pages: boolean;
    products: boolean;
    brands: boolean;
    models: boolean;
    categories: boolean;
    blogs: boolean;
    tags: boolean;
    countries: boolean;
    jobs: boolean;
  };
  imageSitemap: boolean;
  lastGeneratedAt: string;
  entryCount: number;
}

export interface RobotsConfig {
  rules: string;
  updatedAt: string;
}

/* ------------------------------- Page docs ------------------------------- */

export interface PageSection {
  id: string;
  type: string;
  visible: boolean;
  data: Record<string, unknown>;
}

export interface PageDoc {
  status: Status;
  title: Localized;
  slug: string;
  sections: PageSection[];
  settings: Record<string, unknown>;
  seo: SeoFields;
  updatedAt: string;
  updatedBy?: string;
}

export const PAGE_KEYS = ["home", "about", "products", "blogs", "careers", "contact"] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

/* ------------------------------ Admin / tech ------------------------------ */

export interface AdminUserRow extends Base {
  name: string;
  email: string;
  roleId: RoleId;
  active: boolean;
  lastLogin: string;
}

export interface AuditEntry extends Base {
  at: string;
  actor: string;
  actorRole: string;
  action: string;
  collection: string;
  entityId: string;
  summary: string;
  before: string;
  after: string;
}

export interface CodeSnippet extends Base {
  name: string;
  description: string;
  codeType: "html" | "css" | "javascript" | "approved";
  placement: "header" | "before-body-close" | "footer" | "page-specific";
  scope: "site-wide" | "selected";
  scopeTargets: string;
  code: string;
  enabled: boolean;
  version: number;
  author: string;
  validation: "unchecked" | "valid" | "warning" | "invalid";
  history: { version: number; at: string; by: string; code: string }[];
}

export interface Plugin extends Base {
  name: string;
  version: string;
  author: string;
  description: string;
  installedAt: string;
  active: boolean;
  updateAvailable: string;
  installed: boolean;
  checks: string[];
}

export interface Backup extends Base {
  type: "database" | "media" | "settings" | "code" | "full";
  createdAt: string;
  createdBy: string;
  notes: string;
  sizeMb: number;
  restorePoint: boolean;
}

export interface CacheStatus {
  pageCache: boolean;
  objectCache: boolean;
  cdn: boolean;
  lastCleared: string;
  lastCdnPurge: string;
  lastAssetRebuild: string;
  environment: string;
}

export interface SiteSettings {
  siteName: string;
  hotline: string;
  secondaryPhone: string;
  whatsapp: string;
  emailPrimary: string;
  emailSecondary: string;
  businessHours: Localized;
  offices: { label: Localized; address: Localized; phone: string; country: string }[];
  socialProfiles: { network: string; url: string }[];
  enquiryEmail: string;
  hrEmail: string;
  updatedAt: string;
}

/* ------------------------------ Registries ------------------------------ */

export interface CollectionMap {
  brands: Brand;
  models: Model;
  products: Product;
  categories: Category;
  countries: Country;
  posts: BlogPost;
  blogCategories: BlogCategory;
  tags: BlogTag;
  testimonials: Testimonial;
  jobs: Job;
  applications: Application;
  enquiries: Enquiry;
  media: MediaItem;
  redirects: Redirect;
  log404: Log404;
  schemas: SchemaEntry;
  users: AdminUserRow;
  audit: AuditEntry;
  snippets: CodeSnippet;
  plugins: Plugin;
  backups: Backup;
}
export type CollectionKey = keyof CollectionMap;

export interface SingletonMap {
  page_home: PageDoc;
  page_about: PageDoc;
  page_products: PageDoc;
  page_blogs: PageDoc;
  page_careers: PageDoc;
  page_contact: PageDoc;
  seoGlobal: SeoGlobal;
  sitemap: SitemapSettings;
  robots: RobotsConfig;
  cache: CacheStatus;
  settings: SiteSettings;
  roleOverrides: RoleOverrides;
}
export type SingletonKey = keyof SingletonMap;

export interface SeedData {
  collections: { [K in CollectionKey]: CollectionMap[K][] };
  singletons: SingletonMap;
}

export type CreateInput<T extends Base> = Omit<T, keyof Base> & Partial<Base>;
