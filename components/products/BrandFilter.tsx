"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { carBrands } from "@/lib/data/brands";
import { brandName } from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils/cn";

/** Multi-select brand dropdown. Keeps the toolbar to one row instead of a wall of chips. */
export function BrandFilter({
  activeIds,
  onToggle,
}: {
  activeIds: string[];
  onToggle: (id: string) => void;
}) {
  const { t, isRTL } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="border-steel-light text-ink hover:border-ink font-ui flex w-full min-w-44 items-center justify-between gap-3 border bg-white px-4 py-3.5 text-xs tracking-wide uppercase transition-colors"
      >
        <span>
          {t("products.filterBrand")}
          {activeIds.length > 0 && <span className="text-brand-red ms-2">{activeIds.length}</span>}
        </span>
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-multiselectable
          className="border-steel-light absolute start-0 top-full z-30 mt-1 max-h-72 w-72 overflow-y-auto border bg-white py-1 shadow-lg"
          data-lenis-prevent
        >
          {carBrands.map((brand) => {
            const active = activeIds.includes(brand.id);
            return (
              <li key={brand.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => onToggle(brand.id)}
                  className={cn(
                    "font-ui flex w-full items-center justify-between px-4 py-2.5 text-start text-xs tracking-wide uppercase transition-colors hover:bg-slate-50",
                    active ? "text-ink font-semibold" : "text-steel-dark",
                  )}
                >
                  {brandName(brand, isRTL)}
                  {active && <Check className="text-brand-red size-4" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
