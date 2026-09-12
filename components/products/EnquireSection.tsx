import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { categories } from "@/lib/data/categories";

export function EnquireSection() {
  return (
    <section id="enquire" className="bg-ink scroll-mt-24 py-24 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow="Product Enquiry" title="Get a Quote" tone="white" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
            Tell us the part, quantity and vehicle make or model — our team responds within
            24–48 hours with pricing and availability.
          </p>
        </div>
        <InquiryForm interestOptions={categories.map((c) => c.label)} tone="dark" />
      </Container>
    </section>
  );
}
