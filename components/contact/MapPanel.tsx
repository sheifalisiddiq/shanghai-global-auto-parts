import { Container } from "@/components/ui/Container";
import { locations } from "@/lib/data/company";

export function MapPanel() {
  return (
    <section className="bg-paper py-20 lg:py-28">
      <Container>
        <div className="grid gap-4 sm:grid-cols-3">
          {locations.map((loc) => (
            <div key={loc.id} className="border-steel-light aspect-square overflow-hidden border">
              <iframe
                title={`Map — ${loc.label}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(loc.address)}&output=embed`}
                className="h-full w-full grayscale-[40%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
