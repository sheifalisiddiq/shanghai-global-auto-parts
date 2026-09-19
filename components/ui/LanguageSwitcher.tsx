"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils/cn";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-0.5 text-xs font-bold transition-colors select-none",
        className,
      )}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={cn(
          "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase transition-all cursor-pointer",
          language === "en"
            ? "bg-brand-red text-white shadow-sm"
            : "text-zinc-400 hover:text-white hover:bg-white/10",
        )}
        aria-pressed={language === "en"}
      >
        <span>EN</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage("ar")}
        className={cn(
          "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer",
          language === "ar"
            ? "bg-brand-red text-white shadow-sm"
            : "text-zinc-400 hover:text-white hover:bg-white/10",
        )}
        aria-pressed={language === "ar"}
      >
        <span>العربية</span>
      </button>
    </div>
  );
}

export function LanguageSwitcherCompact({ className }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-zinc-300 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white cursor-pointer",
        className,
      )}
      aria-label={`Switch language to ${language === "en" ? "Arabic" : "English"}`}
    >
      <Globe className="size-3.5 text-brand-red" />
      <span>{language === "en" ? "العربية" : "EN"}</span>
    </button>
  );
}
