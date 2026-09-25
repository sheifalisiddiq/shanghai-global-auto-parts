"use client";

import { Mail, Phone, Clock, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { contact } from "@/lib/data/company";
import { socialLinks } from "@/lib/data/social";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function ContactForm() {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow={t("contact.getInTouch")} title={t("contact.sendMessage")} />
          <p className="text-steel-dark mt-4 max-w-md text-sm leading-relaxed">
            {t("contact.formSubtitle")}
          </p>

          {/* Quick Contact Cards */}
          <div className="mt-8 space-y-3.5 max-w-md">
            <a
              href={`tel:${contact.primaryPhone.replace(/\s+/g, "")}`}
              className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 transition-all hover:border-brand-red/40 hover:bg-white hover:shadow-xs group"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors">
                <Phone className="size-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t("form.hotline")}</div>
                <div className="text-sm font-bold text-ink" dir="ltr">{contact.primaryPhone}</div>
              </div>
            </a>

            <a
              href={`mailto:${contact.emails.primary}`}
              className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 transition-all hover:border-brand-red/40 hover:bg-white hover:shadow-xs group"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors">
                <Mail className="size-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t("form.officialEmail")}</div>
                <div className="text-sm font-bold text-ink" dir="ltr">{contact.emails.primary}</div>
              </div>
            </a>

            <a
              href="https://wa.me/97165335866?text=Hi%20Shanghai%20Global,%20I%20need%20a%20spare%20part%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 transition-all hover:border-emerald-500/40 hover:bg-white hover:shadow-xs group"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MessageCircle className="size-4 fill-current" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t("form.instantChat")}</div>
                <div className="text-sm font-bold text-ink" dir="ltr">WhatsApp Desk (+971 6 533 5866)</div>
              </div>
            </a>

            <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
                <Clock className="size-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t("form.businessHours")}</div>
                <div className="text-sm font-semibold text-ink">{t("topbar.hours")}</div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map(({ id, label, href, Icon }) => (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50/60 text-slate-500 transition-colors hover:border-brand-red/40 hover:bg-brand-red/10 hover:text-brand-red"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <InquiryForm />
      </Container>
    </section>
  );
}
