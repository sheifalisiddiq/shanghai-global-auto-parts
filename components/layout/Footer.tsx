"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ArrowUp,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import { locations, contact, companyIntro, brandLogoDisclaimer } from "@/lib/data/company";
import { categories } from "@/lib/data/categories";

const popularBrands = [
  { id: "jetour", name: "Jetour", models: "T2, Dashing, X70+, X90+" },
  { id: "changan", name: "Changan", models: "CS95, CS85, UNI-K, UNI-T" },
  { id: "geely", name: "Geely", models: "Monjaro, Tugella, Coolray" },
  { id: "chery", name: "Chery", models: "Tiggo 8 Pro, Tiggo 7, Arrizo" },
  { id: "haval", name: "Haval & GWM", models: "H6, Jolion, Tank 300 / 500" },
  { id: "byd", name: "BYD & MG", models: "EV, Hybrid & Petrol series" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-ink text-slate-300 relative border-t border-white/10">
      {/* 1. Fast Action / WhatsApp Pre-Footer Ribbon */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <Container className="py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                  Direct Parts Desk &bull; UAE &bull; Qatar &bull; Worldwide
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Need an urgent part or accurate VIN verification?
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Send your vehicle VIN number or broken part photo directly to our technical desk for instant confirmation &amp; pricing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/97165335866?text=Hi%20Shanghai%20Global,%20I%20need%20a%20spare%20part%20quote.%20Here%20is%20my%20VIN%20/%20vehicle%20details:"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition-all hover:bg-emerald-500 hover:scale-[1.02]"
              >
                <MessageCircle className="size-4 fill-white text-emerald-600" />
                <span>WhatsApp Fast Quote</span>
              </a>

              <a
                href={`tel:${contact.primaryPhone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-white/10 hover:border-white/40"
              >
                <Phone className="size-4 text-brand-red" />
                <span>Call Sharjah HQ</span>
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Main 4-Column Footer */}
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Col 1: Brand & Credibility (4 cols) */}
          <div className="lg:col-span-4">
            <Logo tone="white" />
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm">
              {companyIntro}
            </p>

            {/* Quality & Trust Badges */}
            <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand-red shrink-0" />
                <span>Genuine, OEM &amp; Aftermarket Range</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>100% VIN Matched Fitment Check</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-brand-red shrink-0" />
                <span>Same-Day UAE / Express Qatar Dispatch</span>
              </div>
            </div>

            {/* Email & Working Hours */}
            <div className="mt-6 space-y-2 text-xs text-slate-400">
              <a
                href={`mailto:${contact.emails.primary}`}
                className="flex items-center gap-2 text-slate-300 hover:text-brand-red transition-colors"
              >
                <Mail className="size-3.5 text-brand-red" />
                <span>{contact.emails.primary}</span>
              </a>
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-brand-red" />
                <span>{contact.hours} (Sat &ndash; Thu)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Parts Categories (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="font-ui text-xs tracking-[0.2em] text-white uppercase mb-4 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand-red" />
              Spare Parts Catalog
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products#${cat.id}`}
                    className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    <ChevronRight className="size-3 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-red" />
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Supported Brands (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="font-ui text-xs tracking-[0.2em] text-white uppercase mb-4 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand-red" />
              Supported Makes
            </h3>
            <ul className="space-y-3 text-xs">
              {popularBrands.map((brand) => (
                <li key={brand.name}>
                  <Link
                    href={`/products?brand=${brand.id}`}
                    className="group block transition-colors"
                  >
                    <div className="font-semibold text-slate-200 group-hover:text-brand-red transition-colors">
                      {brand.name}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight">
                      {brand.models}
                    </div>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/makes"
                  className="text-xs font-semibold text-brand-red hover:underline inline-flex items-center gap-1"
                >
                  <span>View All 14+ Makes &rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: GCC Locations & Hubs (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="font-ui text-xs tracking-[0.2em] text-white uppercase mb-4 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand-red" />
              GCC Hubs &amp; Locations
            </h3>
            <div className="space-y-4 text-xs">
              {locations.map((loc) => (
                <div key={loc.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                      {loc.label}
                    </span>
                    <MapPin className="size-3 text-brand-red" />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                    {loc.address}
                  </p>
                  <div className="mt-2 flex items-center gap-2 pt-2 border-t border-white/10">
                    <Phone className="size-3 text-brand-red shrink-0" />
                    <a
                      href={`tel:${loc.phone.replace(/\s+/g, "")}`}
                      className="font-semibold text-white hover:text-brand-red transition-colors"
                    >
                      {loc.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* 3. Bottom Legal & Back to Top Bar */}
      <div className="border-t border-white/10 bg-black/60">
        <Container className="flex flex-col gap-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span>{contact.copyright}</span>
            <span className="text-[11px] text-slate-600 max-w-xl">
              {brandLogoDisclaimer}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-xs">
              <Link href="/makes" className="hover:text-white transition-colors">
                Vehicle Makes
              </Link>
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/#faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="/products#enquire" className="hover:text-white transition-colors">
                Enquiry
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:border-white/30 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <span>Top</span>
              <ArrowUp className="size-3 text-brand-red" />
            </button>
          </div>
        </Container>
      </div>
    </footer>
  );
}
