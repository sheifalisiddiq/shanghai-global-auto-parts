"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, registerGSAP } from "@/lib/gsap/registerGSAP";

/**
 * Text whose words light up one by one as it scrolls into view.
 * Splits by word only (never characters) so Arabic letter joining is preserved.
 */
export function ScrubText({
  text,
  as = "p",
  className,
  start = "top 82%",
  end = "bottom 55%",
}: {
  text: string;
  as?: "h2" | "p";
  className?: string;
  start?: string;
  end?: string;
}) {
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);

  useGSAP(
    () => {
      registerGSAP();
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const split = SplitText.create(ref.current, { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.18 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start, end, scrub: true },
        },
      );
      return () => split.revert();
    },
    { scope: ref, dependencies: [text, start, end] },
  );

  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
