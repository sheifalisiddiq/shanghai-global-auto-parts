"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { EngineAssemblyModel } from "./EngineAssemblyModel";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export default function HeroCanvas({
  active = true,
  explodeProgress,
}: {
  active?: boolean;
  explodeProgress: MutableRefObject<number>;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.2, 5.8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={active ? "always" : "never"}
    >
      <Suspense fallback={null}>
        <EngineAssemblyModel reducedMotion={reducedMotion} explodeProgress={explodeProgress} />
      </Suspense>
    </Canvas>
  );
}
