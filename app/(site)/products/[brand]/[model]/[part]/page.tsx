import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PartDetail } from "@/components/products/PartDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { categories } from "@/lib/data/categories";
import {
  getBrand,
  getFitment,
  getModelBySlug,
  getPrimaryPartUrl,
  getProductBySlug,
  getSku,
} from "@/lib/data/catalog";
import { products } from "@/lib/data/products";
import { siteConfig } from "@/lib/seo/site";

interface Props {
  params: Promise<{ brand: string; model: string; part: string }>;
}

export const dynamicParams = false;

/** One page per confirmed (part, brand, model) combination — never a guessed one. */
export function generateStaticParams() {
  return products.flatMap((p) =>
    getFitment(p).map((f) => ({ brand: f.brandId, model: f.modelSlug, part: p.slug })),
  );
}

function resolve(brandId: string, modelSlug: string, partSlug: string) {
  const product = getProductBySlug(partSlug);
  const brand = getBrand(brandId);
  const model = getModelBySlug(brandId, modelSlug);
  if (!product || !brand || !model) return null;
  const confirmed = getFitment(product).some(
    (f) => f.brandId === brandId && f.modelSlug === modelSlug,
  );
  return confirmed ? { product, brand, model } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandId, model: modelSlug, part } = await params;
  const found = resolve(brandId, modelSlug, part);
  if (!found) return { title: "Part Not Found" };

  const { product, brand, model } = found;
  const title = `${product.name} for ${brand.name} ${model}`;
  const description = `${product.name} — ${product.shortSpec}. Confirmed fit for the ${brand.name} ${model}. Original and OEM parts, quality-checked, GCC delivery.`;
  // The same part can sit under several models: canonical points at the first confirmed one.
  const canonical = getPrimaryPartUrl(product) ?? `/products/${brandId}/${modelSlug}/${part}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: `${siteConfig.url}${canonical}`,
      title,
      description,
      siteName: siteConfig.name,
      images: [{ url: product.image.src, alt: product.image.alt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [product.image.src] },
  };
}

export default async function PartPage({ params }: Props) {
  const { brand: brandId, model: modelSlug, part } = await params;
  const found = resolve(brandId, modelSlug, part);
  if (!found) notFound();

  const { product, brand, model } = found;
  const category = categories.find((c) => c.id === product.category);
  const url = `${siteConfig.url}/products/${brandId}/${modelSlug}/${product.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          sku: getSku(product),
          description: product.shortSpec,
          category: category?.label,
          image: `${siteConfig.url}${product.image.src}`,
          url,
          isAccessoryOrSparePartFor: {
            "@type": "Vehicle",
            name: `${brand.name} ${model}`,
          },
        }}
      />
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
            {
              "@type": "ListItem",
              position: 4,
              name: model,
              item: `${siteConfig.url}/products/${brand.id}/${modelSlug}`,
            },
            { "@type": "ListItem", position: 5, name: product.name },
          ],
        }}
      />
      <PartDetail brandId={brand.id} modelSlug={modelSlug} partSlug={product.slug} />
    </>
  );
}
