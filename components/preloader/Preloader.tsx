"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import { PreloaderMark } from "./PreloaderMark";
import { preloaderState } from "@/lib/preloader/state";

export const PRELOADER_DONE_EVENT = "preloader:done";

export function Preloader() {
  const [active, setActive] = useState(true);
  const reducedMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const gaugeRef = useRef<HTMLSpanElement>(null);
  const ticksRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(active);

  useEffect(() => {
    let cancelled = false;

    function finish() {
      if (cancelled) return;
      setActive(false);
      preloaderState.done = true;
      window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
    }

    async function run() {
      const overlay = overlayRef.current;
      if (!overlay) return finish();

      if (reducedMotion) {
        await wait(400);
        if (cancelled) return;
        await tween(overlay, { opacity: 0, duration: 0.3 });
        finish();
        return;
      }

      const path = pathRef.current;
      if (path) {
        gsap.set(path, { transformOrigin: "50% 50%", scale: 0.6, opacity: 0 });
      }

      const tl = gsap.timeline();
      if (path) {
        tl.to(path, { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" });
      }
      if (wordRef.current) {
        tl.to(wordRef.current, { opacity: 1, duration: 0.4 }, "-=0.35");
      }
      if (gaugeRef.current) {
        tl.to(gaugeRef.current, { width: "100%", duration: 0.85, ease: "power1.inOut" }, "-=0.1");
      }

      const timelineDone = new Promise<void>((resolve) => {
        tl.eventCallback("onComplete", () => resolve());
      });

      await Promise.all([
        timelineDone,
        typeof document !== "undefined" && document.fonts ? document.fonts.ready : Promise.resolve(),
      ]);

      if (cancelled) return;

      await tween(overlay, { yPercent: -100, duration: 0.9, ease: "power4.inOut" });
      finish();
    }

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      className="bg-ink fixed inset-0 z-[100] flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading Shanghai Global Auto Parts"
    >
      <PreloaderMark pathRef={pathRef} wordRef={wordRef} gaugeRef={gaugeRef} ticksRef={ticksRef} />
    </div>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function tween(target: gsap.TweenTarget, vars: gsap.TweenVars) {
  return new Promise<void>((resolve) => {
    gsap.to(target, { ...vars, onComplete: () => resolve() });
  });
}
