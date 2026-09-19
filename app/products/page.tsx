import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductsExplorer } from "./ProductsExplorer";
import { EnquireSection } from "@/components/products/EnquireSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { products } from "@/lib/data/products";
import { siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Auto Parts Catalog — Brakes, Filters, Engine Parts",
  description:
    "Browse Shanghai Global's catalog of original and OEM auto parts for Chinese vehicle brands, organised by category and compatible make.",
};

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Product",
              name: p.name,
              category: p.category,
              description: p.shortSpec,
              url: `${siteConfig.url}/products#${p.slug}`,
            },
          })),
        }}
      />

      <section className="bg-white pt-16 pb-8 lg:pt-24">
        <Container>
          <SectionHeading
            eyebrow="Catalog"
            title="Auto Parts, Organised by Category"
            className="max-w-3xl"
          />
          <p className="text-steel-dark mt-6 max-w-2xl text-sm sm:text-base">
            Chinese-vehicle auto parts organised by category and compatible make — every part
            original, OEM or a reliable aftermarket equivalent, quality-checked before dispatch.
          </p>
        </Container>
      </section>

      <section className="bg-white pb-24">
        <Container>
          <Suspense fallback={<div className="py-12 text-center text-sm text-slate-400">Loading parts catalog...</div>}>
            <ProductsExplorer />
          </Suspense>
        </Container>
      </section>

      <EnquireSection />
    </>
  );
}
