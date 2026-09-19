"use client";

import { useRef } from "react";
import Link from "next/link";
import { X, MessageCircle, Phone, MapPin, ChevronRight, ShieldCheck } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/registerGSAP";
import { Logo } from "@/components/brand/Logo";
import { contact } from "@/lib/data/company";
import { categories } from "@/lib/data/categories";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
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
    { label: t("nav.spareParts", "Spare Parts Catalog"), href: "/products" },
    { label: t("nav.makes", "Vehicle Makes & Models"), href: "/makes" },
    { label: t("nav.blogs", "Blogs"), href: "/blogs" },
    { label: t("nav.careers", "Careers"), href: "/careers" },
    { label: t("nav.faq", "Frequently Asked Questions"), href: "/#faq" },
    { label: t("nav.contact", "Contact & Locations"), href: "/contact" },
    { label: t("nav.enquiry", "Make a Part Enquiry"), href: "/products#enquire" },
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
        {navItems.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            ref={(el) => {
              if (el) linksRef.current[i] = el;
            }}
            onClick={onClose}
            className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-white hover:bg-white/10 hover:text-brand-red transition-colors"
          >
            <span>{link.label}</span>
            <ChevronRight className="size-4 text-slate-500 rtl:rotate-180" />
          </Link>
        ))}
      </nav>

      {/* Quick Category Chips */}
      <div className="mt-6 border-t border-white/10 pt-5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-red mb-2 block">
          {t("nav.componentCategories", "Browse by Component")}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const catLabelKey = `cat.${cat.id}` as any;
            return (
              <Link
                key={cat.id}
                href={`/products#${cat.id}`}
                onClick={onClose}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:border-brand-red hover:text-white transition-colors"
              >
                {t(catLabelKey, cat.label)}
              </Link>
            );
          })}
        </div>
      </div>

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
