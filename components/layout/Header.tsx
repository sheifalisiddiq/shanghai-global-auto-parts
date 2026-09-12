"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  ArrowUpRight,
  Disc3,
  Cog,
  Waypoints,
  Settings2,
  Thermometer,
  Zap,
  Filter,
  CarFront,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { MobileNav } from "@/components/layout/MobileNav";
import { categories } from "@/lib/data/categories";
import { cn } from "@/lib/utils/cn";

const categoryIcons: Record<string, typeof Disc3> = {
  brakes: Disc3,
  engine: Cog,
  suspension: Waypoints,
  transmission: Settings2,
  cooling: Thermometer,
  electrical: Zap,
  filters: Filter,
  "body-accessories": CarFront,
};

const popularBrands = [
  { name: "Jetour", subtitle: "T2, Dashing, X70, X90", href: "/products" },
  { name: "Changan", subtitle: "CS95, CS85, UNI Series", href: "/products" },
  { name: "Geely", subtitle: "Monjaro, Tugella, Coolray", href: "/products" },
  { name: "Chery", subtitle: "Tiggo 8 Pro, Arrizo", href: "/products" },
  { name: "Haval & GWM", subtitle: "H6, Jolion, Tank 300/500", href: "/products" },
  { name: "BYD, MG & GAC", subtitle: "EV, Hybrid & Petrol", href: "/products" },
];

export function Header() {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [partsOpen, setPartsOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const pathname = usePathname();

  const partsTimeout = useRef<NodeJS.Timeout | null>(null);
  const brandsTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setPartsOpen(false);
    setBrandsOpen(false);
  }, [pathname]);

  const handlePartsEnter = () => {
    if (partsTimeout.current) clearTimeout(partsTimeout.current);
    setPartsOpen(true);
    setBrandsOpen(false);
  };
  const handlePartsLeave = () => {
    partsTimeout.current = setTimeout(() => setPartsOpen(false), 200);
  };

  const handleBrandsEnter = () => {
    if (brandsTimeout.current) clearTimeout(brandsTimeout.current);
    setBrandsOpen(true);
    setPartsOpen(false);
  };
  const handleBrandsLeave = () => {
    brandsTimeout.current = setTimeout(() => setBrandsOpen(false), 200);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 text-white backdrop-blur-md transition-all duration-300",
          compact ? "py-2.5 shadow-xl shadow-black/50 bg-slate-950/95" : "py-4",
        )}
      >
        <Container className="flex items-center justify-between">
          {/* Logo with White Tone */}
          <Link href="/" aria-label="Shanghai Global Auto Parts — Home" className="shrink-0">
            <Logo tone="white" />
          </Link>

          {/* Desktop Primary Navigation */}
          <nav className="hidden items-center gap-1 xl:gap-2 lg:flex" aria-label="Primary">
            <Link
              href="/"
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                pathname === "/" ? "text-brand-red bg-white/5" : "text-slate-300 hover:text-white hover:bg-white/5",
              )}
            >
              Home
            </Link>

            {/* Spare Parts Dropdown */}
            <div
              className="relative"
              onMouseEnter={handlePartsEnter}
              onMouseLeave={handlePartsLeave}
            >
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer",
                  partsOpen || pathname.startsWith("/products")
                    ? "text-brand-red bg-white/5"
                    : "text-slate-300 hover:text-white hover:bg-white/5",
                )}
                onClick={() => setPartsOpen((prev) => !prev)}
              >
                <span>Spare Parts</span>
                <ChevronDown className={cn("size-3.5 transition-transform duration-200", partsOpen && "rotate-180")} />
              </button>

              {/* Parts Dropdown Menu */}
              {partsOpen && (
                <div className="absolute top-full left-0 mt-2 w-[540px] rounded-2xl border border-white/15 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-mono text-[10px] font-bold tracking-wider text-brand-red uppercase">
                      Component Categories
                    </span>
                    <Link
                      href="/products"
                      className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white"
                    >
                      <span>Explore all</span>
                      <ArrowUpRight className="size-3 text-brand-red" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => {
                      const Icon = categoryIcons[cat.id] || Disc3;
                      return (
                        <Link
                          key={cat.id}
                          href={`/products#${cat.id}`}
                          className="group flex items-start gap-2.5 rounded-xl p-2.5 transition-colors hover:bg-white/10"
                        >
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-brand-red/50 group-hover:bg-brand-red/10 transition-colors">
                            <Icon className="size-4 text-slate-300 group-hover:text-brand-red transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white group-hover:text-brand-red transition-colors">
                              {cat.label}
                            </div>
                            <div className="truncate text-[11px] text-slate-400">
                              {cat.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Brands Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleBrandsEnter}
              onMouseLeave={handleBrandsLeave}
            >
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer",
                  brandsOpen
                    ? "text-brand-red bg-white/5"
                    : "text-slate-300 hover:text-white hover:bg-white/5",
                )}
                onClick={() => setBrandsOpen((prev) => !prev)}
              >
                <span>Vehicle Makes</span>
                <ChevronDown className={cn("size-3.5 transition-transform duration-200", brandsOpen && "rotate-180")} />
              </button>

              {/* Brands Dropdown Menu */}
              {brandsOpen && (
                <div className="absolute top-full left-0 mt-2 w-[340px] rounded-2xl border border-white/15 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-mono text-[10px] font-bold tracking-wider text-brand-red uppercase">
                      Supported Chinese Brands
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {popularBrands.map((brand) => (
                      <Link
                        key={brand.name}
                        href={brand.href}
                        className="group flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors hover:bg-white/10"
                      >
                        <div>
                          <div className="font-bold text-white group-hover:text-brand-red transition-colors">
                            {brand.name}
                          </div>
                          <div className="text-[10px] text-slate-400">{brand.subtitle}</div>
                        </div>
                        <ArrowUpRight className="size-3.5 text-slate-500 group-hover:text-brand-red transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                pathname === "/about" ? "text-brand-red bg-white/5" : "text-slate-300 hover:text-white hover:bg-white/5",
              )}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                pathname === "/contact" ? "text-brand-red bg-white/5" : "text-slate-300 hover:text-white hover:bg-white/5",
              )}
            >
              Contact &bull; Locations
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="https://wa.me/97165335866?text=Hi%20Shanghai%20Global,%20I%20need%20a%20part%20quote%20for%20my%20vehicle."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-950/40 transition-transform hover:bg-emerald-500 hover:scale-[1.02]"
            >
              <MessageCircle className="size-3.5 fill-white text-emerald-600" />
              <span>WhatsApp Quote</span>
            </a>

            <Link
              href="/products#enquire"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-4 py-2 text-xs font-bold text-white shadow-md shadow-brand-red/30 transition-transform hover:bg-brand-red-dark hover:scale-[1.02]"
            >
              <span>VIN Enquiry</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden cursor-pointer"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </Container>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
