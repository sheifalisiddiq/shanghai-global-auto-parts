"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, MapPin, Sparkles, ArrowUpRight } from "lucide-react";

interface Hotspot {
  id: string;
  title: string;
  category: string;
  href: string;
  top: string;
  left: string;
}

const hotspots: Hotspot[] = [
  {
    id: "brakes",
    title: "Performance Calipers & Ventilated Rotors",
    category: "Braking Systems",
    href: "/products#brakes",
    top: "38%",
    left: "48%",
  },
  {
    id: "turbo",
    title: "Turbochargers & Compressor Assemblies",
    category: "Engine & Forced Induction",
    href: "/products#engine",
    top: "46%",
    left: "82%",
  },
  {
    id: "suspension",
    title: "Adjustable Coilovers & Strut Dampers",
    category: "Suspension & Steering",
    href: "/products#suspension",
    top: "54%",
    left: "22%",
  },
  {
    id: "transmission",
    title: "Forged Pinion & Transmission Gears",
    category: "Transmission & Drivetrain",
    href: "/products#transmission",
    top: "76%",
    left: "64%",
  },
];

export function HeroPartsShowcase() {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  return (
    <div className="relative w-full select-none">
      {/* Outer Glow & Subtle Frame */}
      <div className="relative mx-auto w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900 shadow-2xl shadow-slate-900/15 sm:rounded-3xl">
        {/* Aspect Ratio Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11] lg:aspect-[4/3]">
          <Image
            src="/images/hero/hero-parts.jpg"
            alt="Shanghai Global Genuine, OEM and Performance Automotive Spare Parts"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 650px"
            priority
            className="object-cover object-center transition-transform duration-700 ease-out hover:scale-102"
          />

          {/* Subtle Studio Lighting Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />

          {/* Floating Verified Quality Tag - Top Left */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 backdrop-blur-md sm:top-4 sm:left-4">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold tracking-wide text-white uppercase sm:text-xs">
              Genuine &bull; OEM &bull; Aftermarket
            </span>
          </div>

          {/* Stock Tag - Top Right */}
          <div className="absolute top-3 right-3 z-20 hidden items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md sm:flex">
            <ShieldCheck className="size-3.5 text-brand-red" />
            <span>100% VIN Verified</span>
          </div>

          {/* Interactive Component Hotspots */}
          {hotspots.map((spot) => {
            const isActive = activeHotspot?.id === spot.id;
            return (
              <div
                key={spot.id}
                style={{ top: spot.top, left: spot.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  type="button"
                  onClick={() => setActiveHotspot(isActive ? null : spot)}
                  onMouseEnter={() => setActiveHotspot(spot)}
                  aria-label={`Inspect ${spot.title}`}
                  className="group relative flex size-7 items-center justify-center rounded-full bg-brand-red text-white shadow-lg transition-transform hover:scale-110 focus:outline-none"
                >
                  <span className="absolute inset-0 size-full animate-ping rounded-full bg-brand-red/60" />
                  <span className="relative size-2 rounded-full bg-white transition-transform group-hover:scale-125" />
                </button>

                {/* Hotspot Tooltip */}
                {isActive && (
                  <div className="absolute bottom-full left-1/2 mb-2 w-52 -translate-x-1/2 rounded-xl border border-white/20 bg-slate-950/90 p-2.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 z-30">
                    <p className="text-[10px] font-bold tracking-wider text-brand-red uppercase">
                      {spot.category}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-white leading-tight">
                      {spot.title}
                    </p>
                    <Link
                      href={spot.href}
                      className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white"
                    >
                      <span>Explore category</span>
                      <ArrowUpRight className="size-3 text-brand-red" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Bar Info Overlay */}
          <div className="absolute right-3 bottom-3 left-3 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 backdrop-blur-md sm:right-4 sm:bottom-4 sm:left-4">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-brand-red shrink-0" />
              <span className="text-xs font-medium text-slate-200">
                Sharjah HQ &bull; Abu Dhabi &bull; Qatar Hub
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/80">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>5,000+ Fast-Moving Parts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Caption for Parts Authority */}
      <div className="mt-3 flex items-center justify-between px-2 text-[11px] text-slate-500 font-medium">
        <span className="flex items-center gap-1.5">
          <Sparkles className="size-3 text-brand-red" />
          High-precision mechanical, body &amp; electrical components
        </span>
        <span className="hidden sm:inline-block">Click hotspots to explore parts &rarr;</span>
      </div>
    </div>
  );
}
