"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

export function PartModel({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    if (!reducedMotion) {
      g.rotation.y += delta * 0.25;
    }

    const targetTiltX = state.pointer.y * 0.15;
    const targetTiltY = state.pointer.x * 0.25;
    g.rotation.x += (targetTiltX - g.rotation.x) * 0.04;
    g.position.x += (targetTiltY * 0.3 - g.position.x) * 0.04;
  });

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.28, 24, 64]} />
        <meshStandardMaterial color="#8a8a8a" metalness={0.65} roughness={0.3} />
      </mesh>

      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.3;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            rotation={[Math.PI / 2, 0, angle]}
          >
            <cylinderGeometry args={[0.12, 0.12, 0.5, 12]} />
            <meshStandardMaterial color="#EF0606" metalness={0.35} roughness={0.45} />
          </mesh>
        );
      })}

      <mesh>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#161616" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}
