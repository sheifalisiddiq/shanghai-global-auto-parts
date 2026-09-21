"use client";

import dynamic from "next/dynamic";

/** TipTap is imported only here, via next/dynamic, so it never reaches non-editor screens. */
export const RichTextEditor = dynamic(() => import("./RichTextEditorImpl"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse border border-slate-200 bg-slate-50" aria-label="Loading editor" />,
});
