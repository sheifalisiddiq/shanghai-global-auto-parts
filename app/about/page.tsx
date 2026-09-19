import type { Metadata } from "next";
import { StoryIntro } from "@/components/about/StoryIntro";
import { StatsBand } from "@/components/sections/StatsBand";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { MissionVisionValues } from "@/components/about/MissionVisionValues";
import { CapabilityList } from "@/components/about/CapabilityList";
import { AboutNetwork } from "@/components/about/AboutNetwork";
import { QualityAssurance } from "@/components/about/QualityAssurance";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { LocationsPreview } from "@/components/about/LocationsPreview";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Shanghai Global Auto Parts LLC runs its own factories and partner OEM facilities across China, supplying original and reliable auto parts to businesses in 40+ countries.",
};

export default function AboutPage() {
  return (
    <>
      <StoryIntro />
      <StatsBand />
      <JourneyTimeline />
      <MissionVisionValues />
      <CapabilityList />
      <AboutNetwork />
      <QualityAssurance />
      <BrandMarquee />
      <LocationsPreview />
      <CTABanner />
    </>
  );
}
