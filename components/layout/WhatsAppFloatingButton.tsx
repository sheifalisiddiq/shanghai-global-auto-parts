"use client";

import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const WHATSAPP_NUMBER = "97165335866";
const DEFAULT_MESSAGE = "Hi Shanghai Global, I'd like to enquire about auto spare parts.";

/** Persistent floating WhatsApp button, mounted globally so it's available on every page. */
export function WhatsAppFloatingButton() {
  const { t } = useLanguage();
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t("lay.waDefaultMsg", DEFAULT_MESSAGE))}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("lay.waAria", "Chat with us on WhatsApp")}
      className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 flex size-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-950/40 transition-transform hover:scale-105 hover:bg-emerald-500"
    >
      <MessageCircle className="size-7 fill-white text-emerald-600" />
    </a>
  );
}
