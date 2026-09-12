import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { companyIntro } from "@/lib/data/company";

export function CompanyIntro() {
  return (
    <section className="bg-paper py-24 lg:py-32">
      <Container>
        <Reveal>
          <p className="font-display text-ink max-w-5xl text-3xl leading-[1.15] font-bold uppercase sm:text-4xl lg:text-5xl">
            {companyIntro}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
