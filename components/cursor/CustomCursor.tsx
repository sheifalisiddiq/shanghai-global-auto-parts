"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const TRAIL_COUNT = 6;

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotationRef = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = cursorRef.current;
    if (!el) return;

    const setX = gsap.quickTo(el, "x", { duration: 0.25, ease: "power3.out" });
    const setY = gsap.quickTo(el, "y", { duration: 0.25, ease: "power3.out" });

    const trailSetters = reducedMotion
      ? []
      : trailRefs.current
          .filter((node): node is HTMLDivElement => !!node)
          .map((node, i) => ({
            setX: gsap.quickTo(node, "x", { duration: 0.35 + i * 0.06, ease: "power3.out" }),
            setY: gsap.quickTo(node, "y", { duration: 0.35 + i * 0.06, ease: "power3.out" }),
          }));

    let spin: gsap.core.Tween | null = null;
    if (!reducedMotion) {
      spin = gsap.to(rotationRef, {
        current: 360,
        duration: 6,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          gsap.set(el, { rotate: rotationRef.current });
        },
      });
    }

    function onMouseMove(e: MouseEvent) {
      setX(e.clientX - 14);
      setY(e.clientY - 14);
      trailSetters.forEach(({ setX: tx, setY: ty }) => {
        tx(e.clientX - 3);
        ty(e.clientY - 3);
      });
    }

    function isInteractive(target: EventTarget | null) {
      return target instanceof Element && !!target.closest("a, button, [role='button'], input, textarea, select");
    }

    function onMouseOver(e: MouseEvent) {
      gsap.to(el, { scale: isInteractive(e.target) ? 1.5 : 1, duration: 0.25, ease: "power2.out" });
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      spin?.kill();
    };
  }, [enabled, reducedMotion]);

  if (!enabled) return null;

  return (
    <>
      {!reducedMotion &&
        Array.from({ length: TRAIL_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              trailRefs.current[i] = el;
            }}
            className="bg-brand-red pointer-events-none fixed top-0 left-0 z-[199] size-1.5 rounded-full"
            style={{ opacity: 0.45 * (1 - i / TRAIL_COUNT) }}
            aria-hidden
          />
        ))}

      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[200] size-7"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-full">
          <path
            d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"
            stroke="#EF0606"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="6.2" stroke="#EF0606" strokeWidth={1.8} />
          <circle cx="12" cy="12" r="2.2" fill="#EF0606" />
        </svg>
      </div>
    </>
  );
}
