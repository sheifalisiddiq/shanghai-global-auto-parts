import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { companyIntro, solutions } from "@/lib/data/company";

export function StoryIntro() {
  return (
    <section className="bg-white pt-16 pb-20 lg:pt-24 lg:pb-28">
      <Container>
        <Reveal>
          <span className="font-ui text-brand-red mb-4 block text-xs tracking-[0.3em] uppercase">
            About Shanghai Global
          </span>
          <p className="font-display text-ink max-w-4xl text-3xl leading-[1.15] font-bold uppercase sm:text-4xl lg:text-5xl">
            {companyIntro}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8 max-w-2xl">
          <p className="text-steel-dark text-base leading-relaxed sm:text-lg">
            {solutions.paragraph}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
