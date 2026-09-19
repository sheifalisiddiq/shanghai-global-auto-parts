"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { categories } from "@/lib/data/categories";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function EnquireSection() {
  const { t } = useLanguage();
  return (
    <section id="enquire" className="bg-ink scroll-mt-24 py-24 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow={t("products.enquireEyebrow")}
            title={t("products.enquireTitle")}
            tone="white"
          />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
            {t("products.enquireBody")}
          </p>
        </div>
        <InquiryForm interestOptions={categories.map((c) => c.label)} tone="dark" />
      </Container>
    </section>
  );
}
