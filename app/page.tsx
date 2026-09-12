import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { CompanyIntro } from "@/components/sections/CompanyIntro";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { StatsBand } from "@/components/sections/StatsBand";
import { Solutions } from "@/components/sections/Solutions";
import { ProductsCarousel } from "@/components/sections/ProductsCarousel";
import { GoogleReviews } from "@/components/sections/GoogleReviews";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "Chinese Automotive Parts Supplier — UAE",
  description:
    "Shanghai Global Auto Parts LLC supplies genuine, OEM and reliable spare parts for Chinese vehicle brands, sourced across 40+ countries and shipped worldwide from the UAE.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandMarquee />
      <CompanyIntro />
      <GoogleReviews />
      <WhatWeDo />
      <StatsBand />
      <Solutions />
      <ProductsCarousel />
      <CTABanner />
    </>
  );
}
