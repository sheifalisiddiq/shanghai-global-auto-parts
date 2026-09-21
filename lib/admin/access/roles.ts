import { ACTIONS, RESOURCES, letters, type Action, type Grants, type Resource } from "./permissions";

export const ROLE_IDS = [
  "administrator",
  "seo-manager",
  "content-editor",
  "product-manager",
  "hr",
] as const;
export type RoleId = (typeof ROLE_IDS)[number];

export type DashboardVariant = "admin" | "seo" | "content" | "product" | "hr";

export interface RoleDef {
  id: RoleId;
  label: string;
  description: string;
  dashboard: DashboardVariant;
  /** Built-in default grants (server truth until DB-backed roles exist). */
  grants: Grants;
}

/** Administrator: every action on every resource, computed (never hand-listed). */
const ADMIN_GRANTS: Grants = Object.fromEntries(RESOURCES.map((r) => [r, ACTIONS])) as Grants;

const CONTENT_RESOURCES: Resource[] = ["posts", "blogCategories", "tags", "testimonials"];
const CATALOGUE_RESOURCES: Resource[] = ["products", "brands", "models", "categories", "countries"];

function map(resources: Resource[], spec: string): Grants {
  return Object.fromEntries(resources.map((r) => [r, letters(spec)])) as Grants;
}

export const ROLES: Record<RoleId, RoleDef> = {
  administrator: {
    id: "administrator",
    label: "Administrator",
    description: "Full access to every module, action and setting.",
    dashboard: "admin",
    grants: ADMIN_GRANTS,
  },
  "seo-manager": {
    id: "seo-manager",
    label: "SEO Manager",
    description: "Manages SEO fields on pages, products and blogs, plus the SEO module.",
    dashboard: "seo",
    grants: {
      dashboard: letters("V"),
      pages: letters("V S"),
      ...map(CATALOGUE_RESOURCES, "V S"),
      ...map(CONTENT_RESOURCES, "V S"),
      seoGlobal: letters("V E"),
      robots: letters("V E"),
      redirects: letters("V C E D X"),
      sitemap: letters("V E M"),
      schema: letters("V C E D"),
    },
  },
  "content-editor": {
    id: "content-editor",
    label: "Content Editor",
    description: "Edits website pages, blog posts, testimonials and media.",
    dashboard: "content",
    grants: {
      dashboard: letters("V"),
      pages: letters("V C E P"),
      ...map(CONTENT_RESOURCES, "V C E P D"),
      media: letters("V C E D"),
    },
  },
  "product-manager": {
    id: "product-manager",
    label: "Product Manager",
    description: "Manages the product catalogue: products, brands, models, categories and countries.",
    dashboard: "product",
    grants: {
      dashboard: letters("V"),
      ...map(CATALOGUE_RESOURCES, "V C E P D X"),
      media: letters("V C E D"),
    },
  },
  hr: {
    id: "hr",
    label: "HR / Recruitment",
    description: "Manages job openings and reviews applications.",
    dashboard: "hr",
    grants: {
      dashboard: letters("V"),
      jobs: letters("V C E P D"),
      applications: letters("V E D X"),
    },
  },
};

export function isRoleId(value: string | undefined | null): value is RoleId {
  return !!value && (ROLE_IDS as readonly string[]).includes(value);
}

export function roleLabel(id: RoleId): string {
  return ROLES[id].label;
}

/** Dev/verification helper: Administrator must be a superset of every other role. */
export function adminIsSuperset(): boolean {
  const admin = ROLES.administrator.grants;
  return ROLE_IDS.every((id) =>
    (Object.entries(ROLES[id].grants) as [Resource, readonly Action[]][]).every(([res, acts]) =>
      acts.every((a) => admin[res]?.includes(a)),
    ),
  );
}
