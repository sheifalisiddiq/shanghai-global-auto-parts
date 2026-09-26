"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { X, MessageCircle, Phone, MapPin, ChevronRight, ChevronDown, ShieldCheck } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/registerGSAP";
import { Logo } from "@/components/brand/Logo";
import { contact } from "@/lib/data/company";
import { categories } from "@/lib/data/categories";
import { carBrands } from "@/lib/data/brands";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { cn } from "@/lib/utils/cn";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const [expanded, setExpanded] = useState<"parts" | "makes" | null>(null);
  const { t } = useLanguage();

  useLockBodyScroll(open);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;

      const tl = gsap.timeline({ paused: true });
      tl.set(panel, { display: "flex" })
        .fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.4, ease: "power3.out" })
        .fromTo(
          linksRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: "power2.out" },
          "-=0.2",
        );

      if (open) {
        tl.play();
      } else {
        tl.reverse();
        tl.eventCallback("onReverseComplete", () => gsap.set(panel, { display: "none" }));
      }

      return () => {
        tl.kill();
      };
    },
    { dependencies: [open] },
  );

  const navItems = [
    { label: t("nav.home", "Home"), href: "/" },
    { label: t("nav.about", "About Shanghai Global"), href: "/about" },
    { label: t("nav.blogs", "Blogs"), href: "/blogs" },
    { label: t("nav.careers", "Careers"), href: "/careers" },
    { label: t("nav.faq", "Frequently Asked Questions"), href: "/#faq" },
    { label: t("nav.contact", "Contact & Locations"), href: "/contact" },
  ];

  return (
    <div
      ref={panelRef}
      data-lenis-prevent
      className="fixed inset-0 z-50 hidden flex-col bg-slate-950/98 text-white backdrop-blur-2xl p-6 lg:hidden overflow-y-auto"
      style={{ display: "none" }}
    >
      {/* Top Header Bar with Language Switcher */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Logo tone="white" />
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Main Links */}
      <nav className="mt-6 flex flex-col gap-2" aria-label="Mobile">
        <Link
          href="/"
          ref={(el) => {
            if (el) linksRef.current[0] = el;
          }}
          onClick={onClose}
          className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-white hover:bg-white/10 hover:text-brand-red transition-colors"
        >
          <span>{navItems[0].label}</span>
          <ChevronRight className="size-4 text-slate-500 rtl:rotate-180" />
        </Link>
        <Link
          href="/about"
          ref={(el) => {
            if (el) linksRef.current[1] = el;
          }}
          onClick={onClose}
          className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-white hover:bg-white/10 hover:text-brand-red transition-colors"
        >
          <span>{navItems[1].label}</span>
          <ChevronRight className="size-4 text-slate-500 rtl:rotate-180" />
        </Link>

        {/* Spare Parts — expandable */}
        <div
          ref={(el) => {
            if (el) linksRef.current[2] = el as unknown as HTMLAnchorElement;
          }}
        >
          <button
            type="button"
            onClick={() => setExpanded((v) => (v === "parts" ? null : "parts"))}
            aria-expanded={expanded === "parts"}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-white hover:bg-white/10 hover:text-brand-red transition-colors cursor-pointer"
          >
            <span>{t("nav.spareParts", "Spare Parts Catalog")}</span>
            <ChevronDown
              className={cn(
                "size-4 text-slate-500 transition-transform",
                expanded === "parts" && "rotate-180",
              )}
            />
          </button>
          {expanded === "parts" && (
            <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-white/10 pl-4 pb-2">
              <Link
                href="/products"
                onClick={onClose}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-brand-red hover:bg-white/10"
              >
                {t("nav.exploreAll", "Explore all")}
              </Link>
              {categories.map((cat) => {
                const catLabelKey = `cat.${cat.id}` as any;
                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.id}`}
                    onClick={onClose}
                    className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                    {t(catLabelKey, cat.label)}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Vehicle Makes — expandable */}
        <div
          ref={(el) => {
            if (el) linksRef.current[3] = el as unknown as HTMLAnchorElement;
          }}
        >
          <button
            type="button"
            onClick={() => setExpanded((v) => (v === "makes" ? null : "makes"))}
            aria-expanded={expanded === "makes"}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-white hover:bg-white/10 hover:text-brand-red transition-colors cursor-pointer"
          >
            <span>{t("nav.makes", "Vehicle Makes & Models")}</span>
            <ChevronDown
              className={cn(
                "size-4 text-slate-500 transition-transform",
                expanded === "makes" && "rotate-180",
              )}
            />
          </button>
          {expanded === "makes" && (
            <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-white/10 pl-4 pb-2 max-h-64 overflow-y-auto">
              <Link
                href="/makes"
                onClick={onClose}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-brand-red hover:bg-white/10"
              >
                {t("nav.viewAllMakes", "View all makes")}
              </Link>
              {carBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/products?brand=${brand.id}`}
                  onClick={onClose}
                  className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {navItems.slice(2).map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            ref={(el) => {
              if (el) linksRef.current[i + 4] = el;
            }}
            onClick={onClose}
            className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-white hover:bg-white/10 hover:text-brand-red transition-colors"
          >
            <span>{link.label}</span>
            <ChevronRight className="size-4 text-slate-500 rtl:rotate-180" />
          </Link>
        ))}
      </nav>

      {/* 1-Tap Action Buttons */}
      <div className="mt-8 space-y-2.5">
        <a
          href="https://wa.me/97165335866?text=Hi%20Shanghai%20Global,%20I%20need%20a%20part%20quote%20for%20my%20vehicle."
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:bg-emerald-500"
        >
          <MessageCircle className="size-4 fill-white text-emerald-600" />
          <span>{t("nav.whatsappQuote", "WhatsApp Fast Quote")}</span>
        </a>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${contact.primaryPhone.replace(/\s+/g, "")}`}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
          >
            <Phone className="size-3.5 text-brand-red" />
            <span>Sharjah HQ</span>
          </a>
          <a
            href="tel:+97126225133"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
          >
            <Phone className="size-3.5 text-brand-red" />
            <span>Abu Dhabi</span>
          </a>
        </div>
      </div>

      {/* Footer Info with Original Replacement */}
      <div className="mt-auto pt-6 border-t border-white/10 text-xs text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="size-3.5 text-brand-red shrink-0" />
          <span>Original &bull; OEM &bull; Aftermarket Chinese Parts</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <MapPin className="size-3 text-brand-red shrink-0" />
          <span>Sharjah &bull; Abu Dhabi &bull; Qatar Hub</span>
        </div>
      </div>
    </div>
  );
}
