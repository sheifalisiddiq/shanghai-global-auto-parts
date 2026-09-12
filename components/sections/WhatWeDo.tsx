import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { whatWeDo } from "@/lib/data/company";

export function WhatWeDo() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <Container>
        <SectionHeading eyebrow="What We Do" title="Built Around Your Supply Chain" />

        <RevealGroup className="border-steel-light mt-14 border-t" itemSelector=":scope > article">
          {whatWeDo.map((item) => (
            <article
              key={item.id}
              className="border-steel-light group grid gap-4 border-b py-10 transition-colors duration-300 hover:bg-paper/60 lg:grid-cols-[100px_1.2fr_2fr] lg:items-start lg:gap-10 lg:px-4"
            >
              <span className="font-display text-steel-light text-5xl font-black group-hover:text-brand-red/30 transition-colors duration-300">
                {item.index}
              </span>
              <h3 className="font-ui text-ink text-lg tracking-wide uppercase lg:text-xl">
                {item.title}
              </h3>
              <div>
                <p className="text-steel-dark max-w-2xl text-sm leading-relaxed sm:text-base">
                  {item.copy}
                </p>
                {item.cta && (
                  <Button href={item.cta.href} variant="outline" className="mt-6 px-5 py-3 text-xs">
                    {item.cta.label}
                  </Button>
                )}
              </div>
            </article>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
