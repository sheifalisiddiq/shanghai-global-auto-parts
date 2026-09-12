"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/registerGSAP";
import { primaryNav } from "@/lib/data/nav";
import { contact } from "@/lib/data/company";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import { cn } from "@/lib/utils/cn";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);

  useLockBodyScroll(open);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;

      const tl = gsap.timeline({ paused: true });
      tl.set(panel, { display: "flex" })
        .fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: "power4.out" })
        .fromTo(
          linksRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: "power3.out" },
          "-=0.25",
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

  return (
    <div
      ref={panelRef}
      className="bg-ink fixed inset-0 z-50 hidden flex-col p-8 lg:hidden"
      style={{ display: "none" }}
    >
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="font-ui text-xs tracking-wide text-white uppercase"
        >
          Close
        </button>
      </div>

      <nav className="mt-16 flex flex-col gap-6" aria-label="Mobile">
        {primaryNav.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            ref={(el) => {
              if (el) linksRef.current[i] = el;
            }}
            onClick={onClose}
            className={cn(
              "font-display text-4xl font-black text-white uppercase",
              "hover:text-brand-red transition-colors",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 text-white/70">
        <a href={`tel:${contact.primaryPhone.replace(/\s+/g, "")}`} className="font-ui text-sm">
          {contact.primaryPhone}
        </a>
        <a href={`mailto:${contact.emails.primary}`} className="font-ui text-sm">
          {contact.emails.primary}
        </a>
      </div>
    </div>
  );
}
