/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/seo/site";
import { serpPreview } from "@/lib/admin/seo/checks";
import type { SeoFields } from "@/lib/admin/data/types";
import { cn } from "@/lib/utils/cn";

/** SEO Preview: Google result (desktop + mobile) and social share card. */
export function SeoPreview({ seo, slug, fallbackTitle, lang = "en" }: { seo: SeoFields; slug: string; fallbackTitle: string; lang?: "en" | "ar" }) {
  const [mobile, setMobile] = useState(false);
  const serp = serpPreview(seo, slug, fallbackTitle, siteConfig.url, lang);
  const ogTitle = seo.og.title[lang] || seo.metaTitle[lang] || fallbackTitle;
  const ogDesc = seo.og.description[lang] || seo.metaDescription[lang];
  const ogImage = seo.og.image || siteConfig.ogImage;

  return (
    <div className="space-y-5" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div>
        <div className="mb-2 flex items-center justify-between" dir="ltr">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">Search result</p>
          <div className="inline-flex border border-slate-200 text-[11px] font-bold uppercase">
            {[false, true].map((m) => (
              <button
                key={String(m)}
                type="button"
                onClick={() => setMobile(m)}
                className={cn("px-2.5 py-1", mobile === m ? "bg-ink text-white" : "text-slate-500 hover:text-ink")}
              >
                {m ? "Mobile" : "Desktop"}
              </button>
            ))}
          </div>
        </div>
        <div className={cn("border border-slate-200 bg-white p-4", mobile ? "max-w-[22rem]" : "max-w-2xl")}>
          <p className="truncate text-xs text-slate-600" dir="ltr">
            {serp.url}
          </p>
          <p className="mt-0.5 text-lg leading-snug text-[#1a0dab]">{serp.title}</p>
          <p className="mt-0.5 text-sm leading-snug text-slate-600">{serp.desc}</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase" dir="ltr">
          Social share card ({seo.twitter.card === "summary" ? "compact" : "large"})
        </p>
        <div className={cn("overflow-hidden border border-slate-200 bg-white", seo.twitter.card === "summary" ? "flex max-w-md" : "max-w-md")}>
          <div className={cn("bg-slate-100", seo.twitter.card === "summary" ? "h-28 w-28 shrink-0" : "aspect-[1.91/1] w-full")}>
            <img src={ogImage} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 p-3">
            <p className="text-[11px] text-slate-500 uppercase" dir="ltr">
              {new URL(siteConfig.url).hostname}
            </p>
            <p className="truncate text-sm font-bold text-ink">{ogTitle}</p>
            {ogDesc && <p className="line-clamp-2 text-xs text-slate-600">{ogDesc}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
