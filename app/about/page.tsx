import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { StoryIntro } from "@/components/about/StoryIntro";
import { CapabilityList } from "@/components/about/CapabilityList";
import { LocationsPreview } from "@/components/about/LocationsPreview";
import { CTABanner } from "@/components/sections/CTABanner";
import { whatWeDo } from "@/lib/data/company";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Shanghai Global Auto Parts LLC runs its own factories and partner OEM facilities across China, supplying genuine and reliable auto parts to businesses in 40+ countries.",
};

const network = whatWeDo.find((item) => item.id === "network")!;

export default function AboutPage() {
  return (
    <>
      <StoryIntro />
      <CapabilityList />

      <section className="bg-white py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <span className="font-ui text-brand-red mb-3 block text-xs tracking-[0.3em] uppercase">
              Our Network
            </span>
            <h2 className="font-display text-ink text-3xl leading-[1.05] font-black uppercase sm:text-4xl">
              {network.title}
            </h2>
            <p className="text-steel-dark mt-6 max-w-lg text-base leading-relaxed">{network.copy}</p>
          </Reveal>

          <div className="bg-steel-light relative order-1 aspect-4/3 overflow-hidden lg:order-2">
            <Image
              src="/images/about/factory-line.jpg"
              alt="OEM factory production line manufacturing automotive components"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <LocationsPreview />
      <CTABanner />
    </>
  );
}
