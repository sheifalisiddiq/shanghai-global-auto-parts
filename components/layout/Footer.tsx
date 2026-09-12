import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import { footerQuickLinks } from "@/lib/data/nav";
import { locations, contact, companyIntro, brandLogoDisclaimer } from "@/lib/data/company";

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr_1.5fr]">
        <div>
          <Logo tone="white" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">{companyIntro}</p>
          <p className="font-ui mt-6 text-xs tracking-[0.2em] text-white/50 uppercase">
            {contact.locationsLine}
          </p>
        </div>

        <div>
          <h3 className="font-ui mb-5 text-xs tracking-[0.25em] text-white uppercase">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            {footerQuickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand-red transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-ui mb-5 text-xs tracking-[0.25em] text-white uppercase">
            Reach Us
          </h3>
          <ul className="space-y-4 text-sm">
            {locations.map((loc) => (
              <li key={loc.id} className="flex gap-3">
                <MapPin className="text-brand-red mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  <span className="font-ui block text-xs tracking-wide text-white uppercase">
                    {loc.label}
                  </span>
                  {loc.address}
                  {" — "}
                  <a href={`tel:${loc.phone.replace(/\s+/g, "")}`} className="hover:text-brand-red">
                    {loc.phone}
                  </a>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2 text-sm">
            <a
              href={`mailto:${contact.emails.primary}`}
              className="hover:text-brand-red flex items-center gap-2"
            >
              <Mail className="size-4" aria-hidden /> {contact.emails.primary}
            </a>
            <a
              href={`tel:${contact.primaryPhone.replace(/\s+/g, "")}`}
              className="hover:text-brand-red flex items-center gap-2"
            >
              <Phone className="size-4" aria-hidden /> {contact.primaryPhone}
            </a>
            <span className="flex items-center gap-2">
              <Clock className="size-4" aria-hidden /> {contact.hours}
            </span>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>{contact.copyright}</span>
          <span className="max-w-md">{brandLogoDisclaimer}</span>
        </Container>
      </div>
    </footer>
  );
}
