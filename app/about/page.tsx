import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { StoryIntro } from "@/components/about/StoryIntro";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { MissionVisionValues } from "@/components/about/MissionVisionValues";
import { StatsBand } from "@/components/sections/StatsBand";
import { Certifications } from "@/components/about/Certifications";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { OfficeWarehouse } from "@/components/about/OfficeWarehouse";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Shanghai Global Auto Parts LLC runs its own factories and partner OEM facilities across China, supplying original and reliable auto parts to businesses in 40+ countries.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <StoryIntro />
      <JourneyTimeline />
      <MissionVisionValues />
      <StatsBand />
      <Certifications />
      <BrandMarquee />
      <OfficeWarehouse />
      <CTABanner />
    </>
  );
}
