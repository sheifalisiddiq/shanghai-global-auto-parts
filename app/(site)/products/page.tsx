import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProductsExplorer } from "./ProductsExplorer";
import { ProductsHero } from "@/components/products/ProductsHero";
import { BrandTiles } from "@/components/products/BrandTiles";
import { EnquireSection } from "@/components/products/EnquireSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPrimaryPartUrl } from "@/lib/data/catalog";
import { products } from "@/lib/data/products";
import { siteConfig } from "@/lib/seo/site";

const title = "Auto Parts Catalog — Brakes, Filters, Engine Parts";
const description =
  "Browse Shanghai Global's catalog of original and OEM auto parts for Chinese vehicle brands. Search by part name or code and filter by brand, model and category.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/products" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/products`,
    title,
    description,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  twitter: { card: "summary_large_image", title, description, images: [siteConfig.ogImage] },
};

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.map((p, i) => {
            const path = getPrimaryPartUrl(p);
            return {
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Product",
                name: p.name,
                category: p.category,
                description: p.shortSpec,
                // Only parts with a confirmed model have their own page.
                ...(path ? { url: `${siteConfig.url}${path}` } : {}),
              },
            };
          }),
        }}
      />

      <ProductsHero />
      <BrandTiles />

      <section className="bg-white py-14 lg:py-20">
        <Container>
          <Suspense
            fallback={<div className="py-12 text-center text-sm text-slate-400">…</div>}
          >
            <ProductsExplorer />
          </Suspense>
        </Container>
      </section>

      <EnquireSection />
    </>
  );
}
