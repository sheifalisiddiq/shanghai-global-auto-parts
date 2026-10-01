"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils/cn";
import { LOGO_MARK_PATH } from "@/lib/brand/logoMark";

export function LogoMark({
  className,
  color = "#EF0606",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d={LOGO_MARK_PATH} fill={color} />
    </svg>
  );
}

export function Logo({
  variant = "full",
  tone = "ink",
  className,
}: {
  variant?: "full" | "mark";
  tone?: "ink" | "white";
  className?: string;
}) {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const textColor = tone === "white" ? "text-white" : "text-ink";
  const subColor = tone === "white" ? "text-white/70" : "text-steel-dark";

  if (variant === "mark") {
    return <LogoMark className={cn("h-9 w-9", className)} />;
  }

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            isAr ? "font-brand text-base sm:text-xl" : "font-brand text-sm tracking-tight uppercase sm:text-lg",
            textColor,
          )}
        >
          {t("viewer.brandName")}
        </span>
        <span
          className={cn(
            isAr ? "font-body mt-0.5 text-[10px] sm:text-[11px]" : "font-body mt-0.5 text-[9px] tracking-wide uppercase sm:text-[10px]",
            subColor,
          )}
        >
          {t("viewer.brandSub")}
        </span>
      </span>
    </span>
  );
}
