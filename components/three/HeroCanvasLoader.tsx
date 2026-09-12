"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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

export function HeroCanvasLoader() {
  // Must start false on both server and first client render — reading window
  // synchronously here would diverge from the server's markup and break hydration.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = () => setReady(mql.matches && supportsWebGL());
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (!ready) return <CanvasFallback />;

  return <HeroCanvas />;
}
