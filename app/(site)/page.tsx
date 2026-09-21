import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustFeaturesBar } from "@/components/sections/TrustFeaturesBar";
import { CompanyIntro } from "@/components/sections/CompanyIntro";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { ProductsCarousel } from "@/components/sections/ProductsCarousel";
import { CompanyIntroText } from "@/components/sections/CompanyIntroText";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { FeaturedCountries } from "@/components/sections/FeaturedCountries";
import { BlogHighlights } from "@/components/sections/BlogHighlights";
import { GoogleReviews } from "@/components/sections/GoogleReviews";
import { FAQ } from "@/components/sections/FAQ";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "Chinese Automotive Parts Supplier — UAE",
  description:
    "Shanghai Global Auto Parts LLC supplies original, OEM and reliable spare parts for Chinese vehicle brands, sourced across 40+ countries and shipped worldwide from the UAE.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustFeaturesBar />
      <CompanyIntro />
      <BrandMarquee />
      <ProductsCarousel />
      <CompanyIntroText />
      <WhatWeDo />
      <FeaturedCountries />
      <BlogHighlights />
      <GoogleReviews />
      <FAQ />
      <CTABanner />
    </>
  );
}
