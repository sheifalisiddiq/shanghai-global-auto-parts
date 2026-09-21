import type { SeedData } from "../types";
import {
  seedAudit,
  seedBackups,
  seedCache,
  seedEnquiries,
  seedMedia,
  seedPlugins,
  seedSettings,
  seedSnippets,
  seedUsers,
} from "./admin";
import { seedBlogCategories, seedPosts, seedTags, seedTestimonials } from "./blogs";
import { seedApplications, seedJobs } from "./careers";
import { seedBrands, seedCategories, seedCountries, seedModels, seedProducts } from "./catalog";
import { seedPages } from "./pages";
import {
  seedLog404,
  seedRedirects,
  seedRobots,
  seedSchemas,
  seedSeoGlobal,
  seedSitemap,
} from "./seo";

/**
 * Builds the demo data set from the REAL website data (lib/data/*, translations).
 * Rows that have no real source yet are marked `isSample: true` and shown with a
 * "Sample" badge. Loaded lazily (dynamic import) the first time admin needs it.
 */
export async function buildSeed(): Promise<SeedData> {
  return {
    collections: {
      brands: seedBrands(),
      models: seedModels(),
      products: seedProducts(),
      categories: seedCategories(),
      countries: seedCountries(),
      posts: seedPosts(),
      blogCategories: seedBlogCategories(),
      tags: seedTags(),
      testimonials: seedTestimonials(),
      jobs: seedJobs(),
      applications: seedApplications(),
      enquiries: seedEnquiries(),
      media: seedMedia(),
      redirects: seedRedirects(),
      log404: seedLog404(),
      schemas: seedSchemas(),
      users: seedUsers(),
      audit: seedAudit(),
      snippets: seedSnippets(),
      plugins: seedPlugins(),
      backups: seedBackups(),
    },
    singletons: {
      ...seedPages(),
      seoGlobal: seedSeoGlobal(),
      sitemap: seedSitemap(),
      robots: seedRobots(),
      cache: seedCache(),
      settings: seedSettings(),
      roleOverrides: {},
    },
  };
}
