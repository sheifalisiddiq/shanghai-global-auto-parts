import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, CheckCircle2, Search, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { carBrands } from "@/lib/data/brands";
import { brandLogoDisclaimer } from "@/lib/data/company";

export const metadata: Metadata = {
  title: "Supported Vehicle Makes & Models — Chinese Auto Spare Parts",
  description:
    "Comprehensive catalog of supported Chinese vehicle makes including Jetour, Changan, Geely, Chery, BYD, Haval, MG, BAIC, and more. Original and OEM parts with express GCC delivery.",
};

export default function MakesPage() {
  return (
    <>
      {/* 1. Page Header Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-20 text-white border-b border-white/10">
        {/* Subtle grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 shadow-sm backdrop-blur-md mb-4">
              <span className="size-2 rounded-full bg-brand-red animate-pulse" />
              <span className="font-mono text-xs font-bold tracking-wider uppercase text-white">
                Compatible Vehicle Manufacturers
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase leading-[1.05] tracking-tight">
              Supported Vehicle Makes &amp; Models
            </h1>

            <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed">
              We stock and supply original, OEM, and high-grade aftermarket spare parts for all leading Chinese automobile manufacturers. Every part is 100% VIN-verified to guarantee exact chassis fitment.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand-red" />
                <span>100% VIN Fitment Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span>Direct Tier-1 OEM Sourcing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-brand-red" />
                <span>14+ Major Brands Catalogued</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Grid of Supported Vehicle Makes */}
      <section className="bg-slate-50 py-16 lg:py-20">
        <Container>
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-red block mb-1">
                Directory
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-slate-900 tracking-tight">
                Select Your Vehicle Make
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Click any manufacturer to view available catalog parts or submit an instant VIN inquiry.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-red hover:underline self-start sm:self-auto"
            >
              <span>Explore Entire Spare Parts Catalog</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carBrands.map((brand) => (
              <div
                key={brand.id}
                id={brand.id}
                className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-brand-red/40 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Brand Header & Badge */}
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3.5">
                    {brand.logo ? (
                      <div className="relative flex size-14 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-2 group-hover:border-brand-red/30 transition-colors">
                        <Image
                          src={brand.logo.src}
                          alt={brand.logo.alt}
                          width={48}
                          height={48}
                          className="max-h-8 w-auto object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xs uppercase">
                        {brand.name.slice(0, 3)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-red transition-colors">
                        {brand.name}
                      </h3>
                      {brand.category && (
                        <div className="text-[11px] font-medium text-slate-500">
                          {brand.category}
                        </div>
                      )}
                    </div>
                  </div>

                  {brand.badge && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[10px] font-bold text-slate-700">
                      {brand.badge}
                    </span>
                  )}
                </div>

                {/* Description */}
                {brand.description && (
                  <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                    {brand.description}
                  </p>
                )}

                {/* Supported Models List */}
                {brand.models && brand.models.length > 0 && (
                  <div className="mt-4">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Popular Models Supported:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {brand.models.map((model) => (
                        <span
                          key={model}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Components */}
                {brand.keyComponents && (
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Frequently Supplied Components:
                    </span>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {brand.keyComponents.join(" • ")}
                    </p>
                  </div>
                )}

                {/* Card CTAs */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/products?brand=${brand.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-red"
                  >
                    <span>Browse Parts</span>
                    <ArrowRight className="size-3.5" />
                  </Link>

                  <a
                    href={`https://wa.me/97165335866?text=${encodeURIComponent(
                      `Hi Shanghai Global, I am inquiring about spare parts for my ${brand.name}. Please check availability.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                  >
                    <MessageCircle className="size-3.5 text-emerald-600" />
                    <span>WhatsApp Quote</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center text-xs text-slate-500">
            {brandLogoDisclaimer}
          </div>
        </Container>
      </section>

      {/* 3. Fast VIN Sourcing Banner */}
      <section className="bg-slate-950 py-12 text-white border-t border-white/10">
        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Custom Parts Sourcing Desk
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                Don&apos;t see your specific model or rare component?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                Send your vehicle VIN chassis number or broken part photo directly to our technical desk in Sharjah &amp; Abu Dhabi. We source from over 40+ factory partners.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/97165335866?text=Hi%20Shanghai%20Global,%20I%20need%20a%20part%20sourced%20for%20my%20vehicle.%20Here%20is%20my%20VIN:"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition-transform hover:bg-emerald-500 hover:scale-[1.02]"
              >
                <MessageCircle className="size-4 fill-white text-emerald-600" />
                <span>Instant VIN Verification</span>
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/10"
              >
                <span>Branch Locations</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
