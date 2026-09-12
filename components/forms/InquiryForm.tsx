"use client";

import { useState, type FormEvent } from "react";
import { Phone, Mail, CheckCircle2, AlertTriangle } from "lucide-react";
import { ButtonAction } from "@/components/ui/Button";
import { contact } from "@/lib/data/company";
import { cn } from "@/lib/utils/cn";

type Status = "idle" | "submitting" | "success" | "error" | "fallback";

export function InquiryForm({
  interestOptions,
  tone = "light",
  className,
}: {
  interestOptions?: string[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const inputClass = cn(
    "font-body w-full border-b bg-transparent py-3 text-sm outline-none transition-colors",
    tone === "dark"
      ? "border-white/20 text-white placeholder:text-white/40 focus:border-brand-red [&>option]:text-ink"
      : "border-steel-light text-ink placeholder:text-steel focus:border-brand-red",
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
      <div className={cn("border-brand-red/30 bg-paper flex items-start gap-3 border p-6", className)}>
        <CheckCircle2 className="text-brand-red mt-0.5 size-5 shrink-0" />
        <p className="text-ink text-sm">
          Thank you — your enquiry has been sent. Our team will respond within 24–48 hours.
        </p>
      </div>
    );
  }

  if (status === "fallback" || status === "error") {
    return (
      <div className={cn("border-steel-light bg-paper space-y-4 border p-6", className)}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-brand-red mt-0.5 size-5 shrink-0" />
          <p className="text-ink text-sm">
            {status === "fallback"
              ? "Online submission isn't available right now — reach us directly and we'll respond fast."
              : errorMessage}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={`tel:${contact.primaryPhone.replace(/\s+/g, "")}`}
            className="font-ui bg-ink inline-flex items-center gap-2 px-5 py-3 text-xs tracking-wide text-white uppercase"
          >
            <Phone className="size-4" /> {contact.primaryPhone}
          </a>
          <a
            href={`mailto:${contact.emails.primary}`}
            className="font-ui border-ink text-ink inline-flex items-center gap-2 border px-5 py-3 text-xs tracking-wide uppercase"
          >
            <Mail className="size-4" /> Email Us
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("grid gap-5 sm:grid-cols-2", className)}>
      <input name="name" required placeholder="Full name" className={inputClass} />
      <input name="email" type="email" required placeholder="Email address" className={inputClass} />
      <input name="phone" required placeholder="Phone number" className={inputClass} />
      {interestOptions ? (
        <select name="interest" defaultValue="" className={inputClass}>
          <option value="" disabled>
            What are you looking for?
          </option>
          {interestOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input name="interest" placeholder="Subject (optional)" className={inputClass} />
      )}
      <textarea
        name="message"
        required
        rows={4}
        placeholder="Tell us what you need — part, quantity, vehicle make/model"
        className={cn(inputClass, "sm:col-span-2 resize-none")}
      />
      <ButtonAction
        type="submit"
        disabled={status === "submitting"}
        className="sm:col-span-2 sm:w-fit disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Enquiry"}
      </ButtonAction>
    </form>
  );
}
