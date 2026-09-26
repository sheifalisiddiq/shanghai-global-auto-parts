"use client";

import { scrollToTarget } from "@/lib/scroll/lenisInstance";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
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
import { socialLinks } from "@/lib/data/social";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const popularBrands = [
  { id: "jetour", name: "Jetour", models: "T2, Dashing, X70+, X90+" },
  { id: "changan", name: "Changan", models: "CS95, CS85, UNI-K, UNI-T" },
  { id: "geely", name: "Geely", models: "Monjaro, Tugella, Coolray" },
  { id: "chery", name: "Chery", models: "Tiggo 8 Pro, Tiggo 7, Arrizo" },
  { id: "haval", name: "Haval & GWM", models: "H6, Jolion, Tank 300 / 500" },
  { id: "byd", name: "BYD & MG", models: "EV, Hybrid & Petrol series" },
];

export function Footer() {
  const { t } = useLanguage();

  const scrollToTop = () => {
    scrollToTarget(0);
  };

  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white select-none">
      {/* Main Footer Grid */}
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Col 1: Brand & Contact Summary (4 cols) */}
          <div className="lg:col-span-4">
            <Logo tone="white" />
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm">
              {t("footer.intro", companyIntro)}
            </p>

            {/* Quality & Trust Badges */}
            <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand-red shrink-0" />
                <span>{t("footer.range", "Original, OEM & Aftermarket Range")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>{t("footer.vinCheck", "100% VIN Matched Fitment Check")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-brand-red shrink-0" />
                <span>{t("footer.dispatch", "Same-Day UAE / Express Qatar Dispatch")}</span>
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

            {/* Social Media Links */}
            <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5">
              {socialLinks.map(({ id, label, href, Icon }) => (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-brand-red/50 hover:bg-brand-red/10 hover:text-brand-red"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Parts Categories (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="font-ui text-xs tracking-[0.2em] text-white uppercase mb-4 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand-red" />
              {t("footer.catalog", "Spare Parts Catalog")}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products#${cat.id}`}
                    className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    <ChevronRight className="size-3 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-red rtl:rotate-180" />
                    <span>{t(`cat.${cat.id}` as any, cat.label)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Supported Brands (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="font-ui text-xs tracking-[0.2em] text-white uppercase mb-4 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand-red" />
              {t("footer.makes", "Supported Makes")}
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
                  <span>{t("footer.viewAllMakes", "View All 14+ Makes →")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: GCC Locations & Hubs (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="font-ui text-xs tracking-[0.2em] text-white uppercase mb-4 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand-red" />
              {t("footer.hubs", "GCC Hubs & Locations")}
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

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <Link href="/makes" className="hover:text-white transition-colors">
                Vehicle Makes
              </Link>
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/career" className="hover:text-white transition-colors">
                Career
              </Link>
              <Link href="/blogs" className="hover:text-white transition-colors">
                Blogs
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
