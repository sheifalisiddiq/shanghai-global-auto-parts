"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap/registerGSAP";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * up    - fade + rise (default)
 * mask  - rises while a clip edge wipes upward (headings, images)
 * scale - fade + gentle zoom-in
 * start - slides in from the inline-start side (left in LTR, right in RTL)
 * end   - slides in from the inline-end side
 */
export type RevealVariant = "up" | "mask" | "scale" | "start" | "end";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function fromVars(variant: RevealVariant, y: number, dir: 1 | -1): gsap.TweenVars {
  switch (variant) {
    case "mask":
      return { opacity: 0, y, clipPath: "inset(100% 0 0 0)" };
    case "scale":
      return { opacity: 0, scale: 0.92, y: y * 0.4 };
    case "start":
      return { opacity: 0, x: -60 * dir };
    case "end":
      return { opacity: 0, x: 60 * dir };
    default:
      return { opacity: 0, y };
  }
}

function toVars(variant: RevealVariant): gsap.TweenVars {
  switch (variant) {
    case "mask":
      return { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", clearProps: "clipPath" };
    case "scale":
      return { opacity: 1, scale: 1, y: 0 };
    case "start":
    case "end":
      return { opacity: 1, x: 0 };
    default:
      return { opacity: 1, y: 0 };
  }
}

export function Reveal({
  children,
  className,
  y = 40,
  delay = 0,
  variant = "up",
  duration = 0.9,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  variant?: RevealVariant;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { isRTL } = useLanguage();

  useGSAP(
    () => {
      registerGSAP();
      if (!ref.current || prefersReducedMotion()) return;

      gsap.fromTo(ref.current, fromVars(variant, y, isRTL ? -1 : 1), {
        ...toVars(variant),
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: ref, dependencies: [isRTL, variant] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function RevealGroup({
  children,
  className,
  itemSelector = ":scope > *",
  y = 30,
  stagger = 0.1,
  variant = "up",
}: {
  children: ReactNode;
  className?: string;
  itemSelector?: string;
  y?: number;
  stagger?: number;
  variant?: Extract<RevealVariant, "up" | "scale" | "mask">;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGSAP();
      if (!ref.current || prefersReducedMotion()) return;
      const items = ref.current.querySelectorAll(itemSelector);
      if (!items.length) return;

      gsap.fromTo(items, fromVars(variant, y, 1), {
        ...toVars(variant),
        duration: 0.85,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: ref, dependencies: [variant] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export { ScrollTrigger };
