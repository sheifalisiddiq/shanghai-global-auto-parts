"use client";

import { useState } from "react";
import { Search, ArrowRight, ShieldCheck, MessageCircle, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";

const popularSearches = [
  "Jetour T2 Brake Pads",
  "Changan CS95 Water Pump",
  "Geely Monjaro Shock Absorber",
  "Chery Tiggo 8 Headlight",
  "Haval H6 Oil Filter",
];

export function PartFinderBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim() || "spare parts availability";
    const encoded = encodeURIComponent(
      `Hi Shanghai Global, I am inquiring about: ${query}. Please confirm price and availability.`,
    );
    window.open(`https://wa.me/97165335866?text=${encoded}`, "_blank");
  };

  const handleChipClick = (chip: string) => {
    setSearchQuery(chip);
    const encoded = encodeURIComponent(
      `Hi Shanghai Global, I am inquiring about: ${chip}. Please confirm price and availability.`,
    );
    window.open(`https://wa.me/97165335866?text=${encoded}`, "_blank");
  };

  return (
    <section className="relative z-20 border-y border-white/10 bg-slate-950 py-10 sm:py-14 text-white shadow-2xl">
      <Container>
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-brand-red animate-pulse" />
              <h2 className="font-display text-base sm:text-lg font-black uppercase tracking-wide text-white">
                Instant Part &amp; VIN Lookup
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>100% Fitment Guarantee via 17-Digit VIN</span>
            </div>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 rounded-2xl border border-white/20 bg-white/5 p-2 shadow-2xl backdrop-blur-md transition-all focus-within:border-brand-red focus-within:ring-2 focus-within:ring-brand-red/30"
          >
            <div className="flex items-center flex-1 px-3 py-2">
              <Search className="size-5 text-slate-400 shrink-0 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Part Name, OEM Number, or 17-digit VIN..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-medium"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-red-dark hover:scale-[1.01] shrink-0 cursor-pointer"
            >
              <span>Check Price &amp; Availability</span>
              <ArrowRight className="size-4" />
            </button>
          </form>

          {/* Popular Search Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Frequent Searches:
            </span>
            {popularSearches.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:border-brand-red hover:text-white transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
