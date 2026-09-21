import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModelView } from "@/components/products/ModelView";
import { JsonLd } from "@/components/seo/JsonLd";
import { carBrands } from "@/lib/data/brands";
import { getBrand, getModelBySlug, getModelsForBrand, getPartsForModel } from "@/lib/data/catalog";
import { siteConfig } from "@/lib/seo/site";

interface Props {
  params: Promise<{ brand: string; model: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return carBrands.flatMap((b) =>
    getModelsForBrand(b.id).map((m) => ({ brand: b.id, model: m.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandId, model: modelSlug } = await params;
  const brand = getBrand(brandId);
  const model = getModelBySlug(brandId, modelSlug);
  if (!brand || !model) return { title: "Model Not Found" };

  const hasParts = getPartsForModel(brandId, modelSlug).length > 0;
  const title = `${brand.name} ${model} Spare Parts — Confirmed Fitment`;
  const description = `Original and OEM spare parts confirmed to fit the ${brand.name} ${model}. Send your VIN and we will verify the right part.`;
  const path = `/products/${brandId}/${modelSlug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    // Models with no confirmed parts yet are thin pages: keep them out of search results.
    robots: hasParts ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "website",
      url: `${siteConfig.url}${path}`,
      title,
      description,
      siteName: siteConfig.name,
      images: [siteConfig.ogImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [siteConfig.ogImage] },
  };
}

export default async function ModelPage({ params }: Props) {
  const { brand: brandId, model: modelSlug } = await params;
  const brand = getBrand(brandId);
  const model = getModelBySlug(brandId, modelSlug);
  if (!brand || !model) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Products", item: `${siteConfig.url}/products` },
            {
              "@type": "ListItem",
              position: 3,
              name: brand.name,
              item: `${siteConfig.url}/products/${brand.id}`,
            },
            { "@type": "ListItem", position: 4, name: model },
          ],
        }}
      />
      <ModelView brandId={brand.id} modelSlug={modelSlug} />
    </>
  );
}
