"use client";

import { Phone, MapPin, Clock } from "lucide-react";
import { contact } from "@/lib/data/company";
import { Container } from "@/components/ui/Container";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function TopBar() {
  const { t } = useLanguage();
  const telSharjah = `tel:${contact.primaryPhone.replace(/\s+/g, "")}`;
  const telAbuDhabi = "tel:+97126225133";

  return (
    <div className="bg-[#1c1e22] text-zinc-300 border-b border-zinc-800 text-[11px] select-none">
      <Container className="flex h-9 items-center justify-between">
        {/* Left: GCC Hubs & Direct Phones */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-semibold text-white uppercase tracking-wider hidden sm:inline-block">
              {t("topbar.hub", "UAE • Qatar Parts Hub")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={telSharjah}
              className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
            >
              <MapPin className="size-3 text-brand-red shrink-0" />
              <span>{t("topbar.sharjah", "Sharjah HQ:")}</span>
              <span className="font-bold text-white ltr:font-sans">{contact.primaryPhone}</span>
            </a>

            <span className="text-zinc-600 hidden md:inline">|</span>

            <a
              href={telAbuDhabi}
              className="hidden md:flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
            >
              <Phone className="size-3 text-brand-red shrink-0" />
              <span>{t("topbar.abuDhabi", "Abu Dhabi:")}</span>
              <span className="font-bold text-white ltr:font-sans">+971 2 622 5133</span>
            </a>
          </div>
        </div>

        {/* Right: Working Hours */}
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Clock className="size-3 text-brand-red" />
          <span>{t("topbar.hours", "Sat – Thu: 8:00 AM – 8:30 PM")}</span>
        </div>
      </Container>
    </div>
  );
}
