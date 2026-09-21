import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandView } from "@/components/products/BrandView";
import { JsonLd } from "@/components/seo/JsonLd";
import { carBrands } from "@/lib/data/brands";
import { getBrand } from "@/lib/data/catalog";
import { siteConfig } from "@/lib/seo/site";

interface Props {
  params: Promise<{ brand: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return carBrands.map((b) => ({ brand: b.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandId } = await params;
  const brand = getBrand(brandId);
  if (!brand) return { title: "Brand Not Found" };

  const title = `${brand.name} Spare Parts — Original & OEM Auto Parts`;
  const description = `Original and OEM ${brand.name} spare parts. ${brand.description ?? ""} Browse models and compatible parts with GCC delivery.`.trim();
  const path = `/products/${brand.id}`;

  return {
    title,
    description,
    alternates: { canonical: path },
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

export default async function BrandPage({ params }: Props) {
  const { brand: brandId } = await params;
  const brand = getBrand(brandId);
  if (!brand) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Products", item: `${siteConfig.url}/products` },
            { "@type": "ListItem", position: 3, name: brand.name },
          ],
        }}
      />
      <BrandView brandId={brand.id} />
    </>
  );
}
