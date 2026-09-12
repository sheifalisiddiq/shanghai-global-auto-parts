"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import { CanvasFallback } from "./CanvasFallback";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => <CanvasFallback />,
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function HeroCanvasLoader({
  explodeProgress,
}: {
  explodeProgress: MutableRefObject<number>;
}) {
  // Must start false on both server and first client render — reading window
  // synchronously here would diverge from the server's markup and break hydration.
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = () => setReady(mql.matches && supportsWebGL());
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      {ready ? (
        <HeroCanvas active={active} explodeProgress={explodeProgress} />
      ) : (
        <CanvasFallback />
      )}
    </div>
  );
}
