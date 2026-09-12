import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryForm } from "@/components/forms/InquiryForm";

export function ContactForm() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow="Get In Touch" title="Send Us a Message" />
          <p className="text-steel-dark mt-6 max-w-sm text-sm leading-relaxed">
            Whether it&apos;s a bulk order, a technical question or a part you can&apos;t find —
            our team responds within 24–48 hours.
          </p>
        </div>
        <InquiryForm />
      </Container>
    </section>
  );
}
