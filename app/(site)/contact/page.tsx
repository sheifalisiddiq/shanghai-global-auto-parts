import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapPanel } from "@/components/contact/MapPanel";
import { JsonLd } from "@/components/seo/JsonLd";
import { locations, contact } from "@/lib/data/company";
import { siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Contact Us | Shanghai Global Auto Parts",
  description:
    "Contact Shanghai Global Auto Parts LLC — offices and warehouse distribution hubs in Sharjah, Abu Dhabi, and Qatar.",
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

      <ContactForm />
      <MapPanel />
    </>
  );
}
