"use client";

import { useEffect } from "react";
import { getLenis } from "@/lib/scroll/lenisInstance";

let locks = 0;
let originalOverflow = "";

/** Ref-counted so overlapping locks (preloader + menu) can never leave the page stuck. */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    if (locks === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    locks += 1;
    getLenis()?.stop();
    return () => {
      locks = Math.max(0, locks - 1);
      if (locks === 0) {
        document.body.style.overflow = originalOverflow;
        getLenis()?.start();
      }
    };
  }, [locked]);
}
