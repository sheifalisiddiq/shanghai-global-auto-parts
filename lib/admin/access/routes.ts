import type { Action, Resource } from "./permissions";

/**
 * THE route registry. Sidebar, header title, quick links, proxy and the guards
 * all read this list, so adding a screen means adding one entry here.
 * Pure data (no React / icons): `iconKey` is mapped in components/admin/shell/icons.ts.
 */

export type IconKey =
  | "dashboard"
  | "pages"
  | "products"
  | "blogs"
  | "careers"
  | "enquiries"
  | "media"
  | "seo"
  | "users"
  | "technical"
  | "settings";

export interface NavGroup {
  id: string;
  label: string;
  icon: IconKey;
  /** Leaf group (no children): the link target. */
  href?: string;
}

export const NAV_GROUPS: NavGroup[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/admin" },
  { id: "pages", label: "Pages", icon: "pages" },
  { id: "products", label: "Products", icon: "products" },
  { id: "blogs", label: "Blogs", icon: "blogs" },
  { id: "careers", label: "Careers", icon: "careers" },
  { id: "enquiries", label: "Enquiries", icon: "enquiries" },
  { id: "media", label: "Media", icon: "media", href: "/admin/media" },
  { id: "seo", label: "SEO", icon: "seo" },
  { id: "users", label: "Users & Roles", icon: "users" },
  { id: "technical", label: "Technical", icon: "technical" },
  { id: "settings", label: "Settings", icon: "settings", href: "/admin/settings" },
];

export interface RouteDef {
  /** Static path, or a path containing `[id]` for record editors. */
  path: string;
  title: string;
  resource: Resource;
  action: Action;
  /** Sidebar group. Omit for routes that are not in the sidebar. */
  group?: string;
  /** Sidebar label when different from title. */
  navLabel?: string;
}

const A = "/admin";

export const ROUTES: RouteDef[] = [
  { path: A, title: "Dashboard", resource: "dashboard", action: "view", group: "dashboard" },
  { path: `${A}/access-denied`, title: "Access denied", resource: "dashboard", action: "view" },

  // Pages
  { path: `${A}/pages/home`, title: "Home", resource: "pages", action: "view", group: "pages" },
  { path: `${A}/pages/about`, title: "About Us", resource: "pages", action: "view", group: "pages" },
  { path: `${A}/pages/products`, title: "Products", resource: "pages", action: "view", group: "pages" },
  { path: `${A}/pages/blogs`, title: "Blogs", resource: "pages", action: "view", group: "pages" },
  { path: `${A}/pages/careers`, title: "Careers", resource: "pages", action: "view", group: "pages" },
  { path: `${A}/pages/contact`, title: "Contact Us", resource: "pages", action: "view", group: "pages" },

  // Products
  { path: `${A}/products/all`, title: "All Products", resource: "products", action: "view", group: "products" },
  { path: `${A}/products/all/new`, title: "New product", resource: "products", action: "create" },
  { path: `${A}/products/all/[id]`, title: "Edit product", resource: "products", action: "view" },
  { path: `${A}/products/brands`, title: "Brands", resource: "brands", action: "view", group: "products" },
  { path: `${A}/products/brands/new`, title: "New brand", resource: "brands", action: "create" },
  { path: `${A}/products/brands/[id]`, title: "Edit brand", resource: "brands", action: "view" },
  { path: `${A}/products/models`, title: "Models", resource: "models", action: "view", group: "products" },
  { path: `${A}/products/models/new`, title: "New model", resource: "models", action: "create" },
  { path: `${A}/products/models/[id]`, title: "Edit model", resource: "models", action: "view" },
  { path: `${A}/products/categories`, title: "Categories", resource: "categories", action: "view", group: "products" },
  { path: `${A}/products/countries`, title: "Countries", resource: "countries", action: "view", group: "products" },

  // Blogs
  { path: `${A}/blogs/posts`, title: "All Posts", resource: "posts", action: "view", group: "blogs" },
  { path: `${A}/blogs/posts/new`, title: "New post", resource: "posts", action: "create" },
  { path: `${A}/blogs/posts/[id]`, title: "Edit post", resource: "posts", action: "view" },
  { path: `${A}/blogs/categories`, title: "Categories", resource: "blogCategories", action: "view", group: "blogs" },
  { path: `${A}/blogs/tags`, title: "Tags", resource: "tags", action: "view", group: "blogs" },
  { path: `${A}/blogs/testimonials`, title: "Testimonials", resource: "testimonials", action: "view", group: "blogs" },
  { path: `${A}/blogs/testimonials/new`, title: "New testimonial", resource: "testimonials", action: "create" },
  { path: `${A}/blogs/testimonials/[id]`, title: "Edit testimonial", resource: "testimonials", action: "view" },

  // Careers
  { path: `${A}/careers/openings`, title: "Job Openings", resource: "jobs", action: "view", group: "careers" },
  { path: `${A}/careers/openings/new`, title: "New job", resource: "jobs", action: "create" },
  { path: `${A}/careers/openings/[id]`, title: "Edit job", resource: "jobs", action: "view" },
  { path: `${A}/careers/applications`, title: "Applications", resource: "applications", action: "view", group: "careers" },

  // Enquiries
  { path: `${A}/enquiries/contact`, title: "Contact Enquiries", resource: "enquiries", action: "view", group: "enquiries" },
  { path: `${A}/enquiries/product`, title: "Product Enquiries", resource: "enquiries", action: "view", group: "enquiries" },

  // Media
  { path: `${A}/media`, title: "Media", resource: "media", action: "view", group: "media" },

  // SEO
  { path: `${A}/seo`, title: "SEO", resource: "seoGlobal", action: "view" },
  { path: `${A}/seo/global`, title: "Global Settings", resource: "seoGlobal", action: "view", group: "seo" },
  { path: `${A}/seo/redirects`, title: "Redirects", resource: "redirects", action: "view", group: "seo" },
  { path: `${A}/seo/sitemap`, title: "Sitemap", resource: "sitemap", action: "view", group: "seo" },
  { path: `${A}/seo/robots`, title: "Robots.txt", resource: "robots", action: "view", group: "seo" },
  { path: `${A}/seo/schema`, title: "Schema", resource: "schema", action: "view", group: "seo" },

  // Users & Roles
  { path: `${A}/users`, title: "Users", resource: "users", action: "view", group: "users" },
  { path: `${A}/users/roles`, title: "Roles & Permissions", resource: "roles", action: "view", group: "users" },
  { path: `${A}/users/audit`, title: "Audit Log", resource: "audit", action: "view", group: "users" },

  // Technical
  { path: `${A}/technical`, title: "Technical", resource: "code", action: "view" },
  { path: `${A}/technical/code`, title: "Code / Script Manager", resource: "code", action: "view", group: "technical", navLabel: "Code / Script Manager" },
  { path: `${A}/technical/plugins`, title: "Plugin Upload", resource: "plugins", action: "view", group: "technical" },
  { path: `${A}/technical/backups`, title: "Backup & Rollback", resource: "backups", action: "view", group: "technical" },
  { path: `${A}/technical/cache`, title: "Cache / Performance", resource: "cache", action: "view", group: "technical" },

  // Settings
  { path: `${A}/settings`, title: "Settings", resource: "settings", action: "view", group: "settings" },
];

const STATIC = new Map<string, RouteDef>();
const DYNAMIC: { re: RegExp; def: RouteDef }[] = [];
for (const r of ROUTES) {
  if (r.path.includes("[id]")) {
    DYNAMIC.push({ re: new RegExp(`^${r.path.replace("[id]", "[^/]+")}$`), def: r });
  } else {
    STATIC.set(r.path, r);
  }
}

export function normalizePath(pathname: string): string {
  const p = pathname.split("?")[0].split("#")[0];
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}

/** Static routes win over `[id]` patterns (so `/new` never matches `[id]`). */
export function matchRoute(pathname: string): RouteDef | null {
  const p = normalizePath(pathname);
  return STATIC.get(p) ?? DYNAMIC.find((d) => d.re.test(p))?.def ?? null;
}

/** First sidebar route of a group (used for redirects such as /admin/seo). */
export function firstRouteOfGroup(group: string): RouteDef | undefined {
  return ROUTES.find((r) => r.group === group);
}
