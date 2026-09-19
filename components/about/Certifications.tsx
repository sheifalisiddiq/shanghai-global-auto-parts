"use client";

import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { certifications } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Certifications() {
  const { t } = useLanguage();

  return (
    <section className="bg-paper py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow={t("about.certs.eyebrow", "Quality Assurance")}
          title={t("about.certs.title", "Certified & Checked")}
        />
        <RevealGroup
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          itemSelector=":scope > div"
        >
          {certifications.map((cert) => (
            <div key={cert.id} className="border-steel-light border bg-white p-6">
              <ShieldCheck className="text-brand-red size-8" aria-hidden />
              <h3 className="font-display text-ink mt-4 text-lg font-black uppercase">
                {cert.name}
              </h3>
              <p className="text-steel-dark mt-2 text-sm leading-relaxed">
                {cert.description}
              </p>
            </div>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
