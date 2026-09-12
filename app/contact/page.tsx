import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ReachUsBlock } from "@/components/contact/ReachUsBlock";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapPanel } from "@/components/contact/MapPanel";
import { JsonLd } from "@/components/seo/JsonLd";
import { locations, contact } from "@/lib/data/company";
import { siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Contact & Locations — Sharjah, Abu Dhabi, Qatar",
  description:
    "Contact Shanghai Global Auto Parts LLC — offices in Sharjah, Abu Dhabi and Qatar, serving Dubai and the wider UAE region.",
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Contact", item: `${siteConfig.url}/contact` },
          ],
        }}
      />
      {locations.map((loc) => (
        <JsonLd
          key={loc.id}
          data={{
            "@context": "https://schema.org",
            "@type": "AutoPartsStore",
            name: `${siteConfig.legalName} — ${loc.label}`,
            address: loc.address,
            telephone: loc.phone,
            email: contact.emails.primary,
            openingHours: "Mo-Fr 08:00-21:00",
            url: `${siteConfig.url}/contact`,
          }}
        />
      ))}

      <section className="bg-white pt-16 pb-4 lg:pt-24">
        <Container>
          <SectionHeading eyebrow="Contact" title="Contact & Locations" />
        </Container>
      </section>

      <ReachUsBlock />
      <MapPanel />
      <ContactForm />
    </>
  );
}
