import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { solutions } from "@/lib/data/company";

export function CapabilityList() {
  return (
    <section className="bg-paper py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Why Choose Us" title="What Sets Us Apart" />
        <RevealGroup
          className="mt-12 grid gap-6 sm:grid-cols-2"
          itemSelector=":scope > div"
        >
          {solutions.bullets.map((bullet, i) => (
            <div key={bullet} className="border-steel-light border-t pt-6">
              <span className="font-display text-brand-red text-sm font-black">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-ink mt-2 text-base sm:text-lg">{bullet}</p>
            </div>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
