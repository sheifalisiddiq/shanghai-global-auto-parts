import type { Metadata } from "next";
import { StoryIntro } from "@/components/about/StoryIntro";
import { CapabilityList } from "@/components/about/CapabilityList";
import { AboutNetwork } from "@/components/about/AboutNetwork";
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
      <CapabilityList />
      <AboutNetwork />
      <LocationsPreview />
      <CTABanner />
    </>
  );
}
