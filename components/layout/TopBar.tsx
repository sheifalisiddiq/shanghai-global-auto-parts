import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { contact } from "@/lib/data/company";
import { Container } from "@/components/ui/Container";

export function TopBar() {
  const telHref = `tel:${contact.primaryPhone.replace(/\s+/g, "")}`;

  return (
    <div className="bg-ink text-white/80">
      <Container className="flex h-9 items-center justify-between text-xs">
        <div className="hidden items-center gap-5 sm:flex">
          <a href={telHref} className="hover:text-brand-red flex items-center gap-1.5 transition-colors">
            <Phone className="size-3" aria-hidden />
            {contact.primaryPhone}
          </a>
          <a
            href={`mailto:${contact.emails.secondary}`}
            className="hover:text-brand-red flex items-center gap-1.5 transition-colors"
          >
            <Mail className="size-3" aria-hidden />
            {contact.emails.secondary}
          </a>
        </div>
        <span className="font-ui tracking-wide uppercase sm:hidden">{contact.locationsLine}</span>
        <Link
          href="/products#enquire"
          className="text-brand-red font-ui tracking-wide uppercase hover:text-white"
        >
          Enquire Now
        </Link>
      </Container>
    </div>
  );
}
