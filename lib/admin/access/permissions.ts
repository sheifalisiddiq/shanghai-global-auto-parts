/**
 * Central permission vocabulary for the admin CMS.
 * Pure TypeScript (no React / icon imports) so `proxy.ts` and the client share it.
 */

export const RESOURCES = [
  "dashboard",
  "pages",
  "products",
  "brands",
  "models",
  "categories",
  "countries",
  "posts",
  "blogCategories",
  "tags",
  "testimonials",
  "jobs",
  "applications",
  "enquiries",
  "media",
  "seoGlobal",
  "redirects",
  "sitemap",
  "robots",
  "schema",
  "users",
  "roles",
  "audit",
  "code",
  "plugins",
  "backups",
  "cache",
  "settings",
] as const;

export type Resource = (typeof RESOURCES)[number];

/**
 * view     open the screen
 * create   add new records
 * edit     change content
 * seo      edit the SEO fields (renders the SEO panel)
 * publish  publish / update / schedule
 * delete   move to trash / delete
 * export   export / import
 * manage   special operations (generate sitemap, upload plugin, edit code, restore backup, ...)
 */
export const ACTIONS = ["view", "create", "edit", "seo", "publish", "delete", "export", "manage"] as const;
export type Action = (typeof ACTIONS)[number];

export type Grants = Partial<Record<Resource, readonly Action[]>>;

export const RESOURCE_LABELS: Record<Resource, string> = {
  dashboard: "Dashboard",
  pages: "Pages",
  products: "Products",
  brands: "Brands",
  models: "Models",
  categories: "Product categories",
  countries: "Countries",
  posts: "Blog posts",
  blogCategories: "Blog categories",
  tags: "Blog tags",
  testimonials: "Testimonials",
  jobs: "Job openings",
  applications: "Applications",
  enquiries: "Enquiries",
  media: "Media",
  seoGlobal: "SEO global settings",
  redirects: "Redirects",
  sitemap: "Sitemap",
  robots: "Robots.txt",
  schema: "Schema",
  users: "Users",
  roles: "Roles & permissions",
  audit: "Audit log",
  code: "Code / script manager",
  plugins: "Plugin upload",
  backups: "Backup & rollback",
  cache: "Cache / performance",
  settings: "Settings",
};

export const ACTION_LABELS: Record<Action, string> = {
  view: "View",
  create: "Create",
  edit: "Edit",
  seo: "SEO",
  publish: "Publish",
  delete: "Delete",
  export: "Export / import",
  manage: "Manage",
};

const LETTERS: Record<string, Action> = {
  V: "view",
  C: "create",
  E: "edit",
  S: "seo",
  P: "publish",
  D: "delete",
  X: "export",
  M: "manage",
};

/** "V C E" -> ["view", "create", "edit"] */
export function letters(spec: string): Action[] {
  return spec
    .split(/\s+/)
    .filter(Boolean)
    .map((l) => {
      const a = LETTERS[l];
      if (!a) throw new Error(`Unknown permission letter "${l}"`);
      return a;
    });
}
