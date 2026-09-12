import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { locations, contact } from "@/lib/data/company";

export function ReachUsBlock() {
  return (
    <section id="locations" className="bg-white scroll-mt-24 py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Reach Us" title="Our Locations" />

        <RevealGroup className="mt-12 grid gap-px sm:grid-cols-3" itemSelector=":scope > div">
          {locations.map((loc) => (
            <div key={loc.id} className="border-steel-light bg-paper/40 border p-6">
              <MapPin className="text-brand-red size-5" aria-hidden />
              <h3 className="font-ui text-ink mt-4 text-sm tracking-wide uppercase">{loc.label}</h3>
              <p className="text-steel-dark mt-2 text-sm leading-relaxed">{loc.address}</p>
              <a
                href={`tel:${loc.phone.replace(/\s+/g, "")}`}
                className="text-ink hover:text-brand-red mt-4 flex items-center gap-2 text-sm"
              >
                <Phone className="size-4" /> {loc.phone}
              </a>
            </div>
          ))}
        </RevealGroup>

        <div className="border-steel-light mt-10 flex flex-col gap-4 border-t pt-8 text-sm sm:flex-row sm:flex-wrap sm:gap-8">
          <a href={`mailto:${contact.emails.primary}`} className="text-ink hover:text-brand-red flex items-center gap-2">
            <Mail className="size-4" /> {contact.emails.primary}
          </a>
          <a href={`mailto:${contact.emails.secondary}`} className="text-ink hover:text-brand-red flex items-center gap-2">
            <Mail className="size-4" /> {contact.emails.secondary}
          </a>
          <span className="text-steel-dark flex items-center gap-2">
            <Clock className="size-4" /> {contact.hours}
          </span>
        </div>
      </Container>
    </section>
  );
}
