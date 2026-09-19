import type { MetadataRoute } from "next";
import { carBrands } from "@/lib/data/brands";
import { getFitment, getModelsForBrand, getPrimaryPartUrl } from "@/lib/data/catalog";
import { products } from "@/lib/data/products";
import { siteConfig } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/products", "/makes", "/career", "/blogs", "/contact"];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const brandEntries: MetadataRoute.Sitemap = carBrands.map((b) => ({
    url: `${siteConfig.url}/products/${b.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Only models with confirmed parts are indexable, so only those go in the sitemap.
  const modelEntries: MetadataRoute.Sitemap = carBrands.flatMap((b) =>
    getModelsForBrand(b.id)
      .filter((m) => m.partCount > 0)
      .map((m) => ({
        url: `${siteConfig.url}/products/${b.id}/${m.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  );

  // Canonical URL only: a part listed under several models appears once.
  const partEntries: MetadataRoute.Sitemap = products.flatMap((p) => {
    const path = getFitment(p).length ? getPrimaryPartUrl(p) : null;
    return path
      ? [
          {
            url: `${siteConfig.url}${path}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.5,
          },
        ]
      : [];
  });

  return [...staticEntries, ...brandEntries, ...modelEntries, ...partEntries];
}
