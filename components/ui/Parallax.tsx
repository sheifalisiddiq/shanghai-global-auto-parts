"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGSAP } from "@/lib/gsap/registerGSAP";
import { cn } from "@/lib/utils/cn";

/**
 * Scroll-linked parallax frame. The wrapper clips; the inner layer is taller than
 * the wrapper by `speed`% x 2 and drifts as the wrapper crosses the viewport, so
 * the media moves slower than the page and its edges never show.
 * Children should fill the inner layer (e.g. next/image `fill`).
 */
export function Parallax({
  children,
  className,
  innerClassName,
  speed = 8,
  start = "top bottom",
  end = "bottom top",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /** Overscan in percent of wrapper height on each side. Bigger = stronger drift. */
  speed?: number;
  start?: string;
  end?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGSAP();
      if (!wrapRef.current || !innerRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const mm = gsap.matchMedia();
      // Gentler drift on phones: shorter scroll distances make strong parallax feel jumpy.
      mm.add({ wide: "(min-width: 768px)", narrow: "(max-width: 767px)" }, (ctx) => {
        const factor = ctx.conditions?.wide ? 1 : 0.5;
        const extra = speed * 2 * factor;
        const shift = ((extra / 2) / (100 + extra)) * 100;
        gsap.set(innerRef.current, { height: `${100 + extra}%`, top: `${-extra / 2}%` });
        gsap.fromTo(
          innerRef.current,
          { yPercent: -shift },
          {
            yPercent: shift,
            ease: "none",
            scrollTrigger: { trigger: wrapRef.current, start, end, scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [speed, start, end] },
  );

  return (
    <div ref={wrapRef} className={cn("relative overflow-hidden", className)}>
      <div ref={innerRef} className={cn("absolute inset-x-0 top-0 h-full will-change-transform", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
