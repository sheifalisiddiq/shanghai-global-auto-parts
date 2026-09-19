"use client";

import { useState, type FormEvent } from "react";
import { Phone, Mail, CheckCircle2, AlertTriangle, Send, ShieldCheck, Loader2 } from "lucide-react";
import { contact } from "@/lib/data/company";
import { cn } from "@/lib/utils/cn";

type Status = "idle" | "submitting" | "success" | "error" | "fallback";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export function InquiryForm({
  interestOptions,
  tone = "light",
  className,
}: {
  interestOptions?: string[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const { t } = useLanguage();
  const isDark = tone === "dark";

  const labelClass = cn(
    "block text-xs font-bold uppercase tracking-wider mb-2",
    isDark ? "text-slate-300" : "text-slate-700",
  );

  const inputClass = cn(
    "w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 outline-none",
    isDark
      ? "border-white/15 bg-white/[0.05] text-white placeholder:text-slate-500 focus:border-brand-red focus:bg-white/[0.08] focus:ring-2 focus:ring-brand-red/20 [&>option]:bg-slate-900 [&>option]:text-white"
      : "border-slate-200 bg-slate-50/70 text-ink placeholder:text-slate-400 focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/15 hover:border-slate-300",
  );

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      interest: String(form.get("interest") ?? ""),
      message: String(form.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }
      if (data.fallback) {
        setStatus("fallback");
        return;
      }
      setErrorMessage(data.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "rounded-2xl border p-8 shadow-sm transition-all",
          isDark
            ? "border-brand-red/40 bg-white/[0.04] text-white"
            : "border-emerald-200 bg-emerald-50/40 text-ink",
          className,
        )}
      >
        <div className="flex items-start gap-3.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <h4 className="text-base font-bold">Enquiry Received Successfully</h4>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Thank you for reaching out. Our parts specialist is reviewing your request and will contact you within 0–2 hours with pricing and availability.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "fallback" || status === "error") {
    return (
      <div
        className={cn(
          "rounded-2xl border p-8 space-y-5 shadow-sm",
          isDark ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-white",
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-brand-red mt-0.5 size-5 shrink-0" />
          <p className="text-ink text-sm">
            {status === "fallback"
              ? "Online submission isn't available right now — reach our parts desk directly for an instant quote."
              : errorMessage}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={`tel:${contact.primaryPhone.replace(/\s+/g, "")}`}
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-brand-red"
          >
            <Phone className="size-3.5" /> {contact.primaryPhone}
          </a>
          <a
            href={`mailto:${contact.emails.primary}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-xs font-bold tracking-wider text-ink uppercase transition-colors hover:border-brand-red hover:text-brand-red"
          >
            <Mail className="size-3.5" /> Email Us
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border p-6 sm:p-8 shadow-sm transition-all",
        isDark
          ? "border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-xl"
          : "border-slate-200/90 bg-white shadow-sm",
        className,
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Name & Email */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              {t("form.fullName", "Full Name")} <span className="text-brand-red">*</span>
            </label>
            <input
              name="name"
              required
              placeholder={t("form.namePlaceholder", "e.g. Ahmed Al Mansoori")}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              {t("form.email", "Email Address")} <span className="text-brand-red">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder={t("form.emailPlaceholder", "e.g. ahmed@example.com")}
              className={inputClass}
            />
          </div>
        </div>

        {/* Row 2: Phone & Subject */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              {t("form.phone", "Phone Number")} <span className="text-brand-red">*</span>
            </label>
            <input
              name="phone"
              type="tel"
              required
              placeholder={t("form.phonePlaceholder", "e.g. +971 50 123 4567")}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              {t("form.subject", "Subject / Inquiry Type")}
            </label>
            {interestOptions ? (
              <select name="interest" defaultValue="" className={inputClass}>
                <option value="" disabled>
                  {t("form.selectCategory", "Select category...")}
                </option>
                {interestOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="interest"
                placeholder={t("form.subjectPlaceholder", "e.g. Brake pads or VIN quote")}
                className={inputClass}
              />
            )}
          </div>
        </div>

        {/* Row 3: Message Textarea */}
        <div>
          <label className={labelClass}>
            {t("form.details", "Tell Us What You Need")} <span className="text-brand-red">*</span>
          </label>
          <textarea
            name="message"
            required
            rows={4}
            placeholder={t(
              "form.detailsPlaceholder",
              "Please specify vehicle make/model, year, VIN or chassis number, and the required part numbers or descriptions...",
            )}
            className={cn(inputClass, "resize-none leading-relaxed")}
          />
        </div>

        {/* Row 4: Submit Button & Response Note */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-100 dark:border-white/10">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand-red/25 transition-all duration-200 hover:bg-brand-red-dark hover:shadow-lg hover:shadow-brand-red/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none cursor-pointer group shrink-0"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>{t("form.sending", "Sending…")}</span>
              </>
            ) : (
              <>
                <span>{t("form.send", "Send Enquiry")}</span>
                <Send className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-180" />
              </>
            )}
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
            <span>{t("form.guarantee", "Response guaranteed within 0–2 hours")}</span>
          </div>
        </div>
      </form>
    </div>
  );
}
