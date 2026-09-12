"use client";

import { useEffect, useState } from "react";

export function useReducedMotion() {
  // Must start false on both server and first client render — reading matchMedia
  // synchronously here would diverge from the server's markup and break hydration.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only value, must be read post-hydration.
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}
