"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { MutableRefObject } from "react";

const LINE_COLOR = "#9a9a9a";
const LINE_OPACITY = 0.85;
const EXPLODE_SCALE = 2.6;
const GEAR_TEETH = 20;
const BOLT_COUNT = 6;

function LineCylinder({
  radiusTop,
  radiusBottom,
  height,
  radialSegments = 24,
  position,
  rotation,
}: {
  radiusTop: number;
  radiusBottom: number;
  height: number;
  radialSegments?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const edges = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    geometry.dispose();
    return edgesGeometry;
  }, [radiusTop, radiusBottom, height, radialSegments]);

  return (
    <lineSegments geometry={edges} position={position} rotation={rotation}>
      <lineBasicMaterial color={LINE_COLOR} transparent opacity={LINE_OPACITY} />
    </lineSegments>
  );
}

function LineBox({
  args,
  position,
  rotation,
}: {
  args: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const edges = useMemo(() => {
    const geometry = new THREE.BoxGeometry(...args);
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    geometry.dispose();
    return edgesGeometry;
  }, [args]);

  return (
    <lineSegments geometry={edges} position={position} rotation={rotation}>
      <lineBasicMaterial color={LINE_COLOR} transparent opacity={LINE_OPACITY} />
    </lineSegments>
  );
}

type StackPart = { restY: number };

const PART_DEFS: StackPart[] = [
  { restY: 1.0 }, // top ring
  { restY: 0.5 }, // gear ring
  { restY: 0.1 }, // mid ring
  { restY: -0.35 }, // core body
  { restY: -0.85 }, // bottom ring + bolts
];

export function GearAssemblyModel({
  reducedMotion,
  explodeProgress,
}: {
  reducedMotion: boolean;
  explodeProgress: MutableRefObject<number>;
}) {
  const group = useRef<Group>(null);
  const partRefs = useRef<(Group | null)[]>([]);

  const gearTeeth = useMemo(
    () =>
      Array.from({ length: GEAR_TEETH }).map((_, i) => {
        const angle = (i / GEAR_TEETH) * Math.PI * 2;
        const radius = 1.22;
        return {
          key: i,
          position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [
            number,
            number,
            number,
          ],
          rotation: [0, -angle, 0] as [number, number, number],
        };
      }),
    [],
  );

  const bolts = useMemo(
    () =>
      Array.from({ length: BOLT_COUNT }).map((_, i) => {
        const angle = (i / BOLT_COUNT) * Math.PI * 2;
        const radius = 0.85;
        return {
          key: i,
          position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [
            number,
            number,
            number,
          ],
        };
      }),
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (g && !reducedMotion) {
      g.rotation.y += delta * 0.2;
      const targetTiltX = state.pointer.y * 0.12;
      const targetTiltY = state.pointer.x * 0.2;
      g.rotation.x += (targetTiltX - g.rotation.x) * 0.04;
      g.position.x += (targetTiltY * 0.25 - g.position.x) * 0.04;
    }

    const t = explodeProgress.current;
    partRefs.current.forEach((partGroup, i) => {
      if (!partGroup) return;
      const restY = PART_DEFS[i].restY;
      partGroup.position.y = restY + (restY * EXPLODE_SCALE - restY) * t;
    });
  });

  return (
    <group ref={group}>
      <group ref={(el) => { partRefs.current[0] = el; }} position={[0, PART_DEFS[0].restY, 0]}>
        <LineCylinder radiusTop={1.3} radiusBottom={1.3} height={0.15} radialSegments={32} />
      </group>

      <group ref={(el) => { partRefs.current[1] = el; }} position={[0, PART_DEFS[1].restY, 0]}>
        <LineCylinder radiusTop={1.05} radiusBottom={1.05} height={0.28} radialSegments={28} />
        {gearTeeth.map((tooth) => (
          <LineBox key={tooth.key} args={[0.14, 0.24, 0.08]} position={tooth.position} rotation={tooth.rotation} />
        ))}
      </group>

      <group ref={(el) => { partRefs.current[2] = el; }} position={[0, PART_DEFS[2].restY, 0]}>
        <LineCylinder radiusTop={1.0} radiusBottom={1.0} height={0.15} radialSegments={32} />
      </group>

      <group ref={(el) => { partRefs.current[3] = el; }} position={[0, PART_DEFS[3].restY, 0]}>
        <LineCylinder radiusTop={0.55} radiusBottom={0.55} height={0.8} radialSegments={20} />
      </group>

      <group ref={(el) => { partRefs.current[4] = el; }} position={[0, PART_DEFS[4].restY, 0]}>
        <LineCylinder radiusTop={1.15} radiusBottom={1.15} height={0.18} radialSegments={32} />
        {bolts.map((bolt) => (
          <LineCylinder
            key={bolt.key}
            radiusTop={0.08}
            radiusBottom={0.08}
            height={0.4}
            radialSegments={10}
            position={bolt.position}
          />
        ))}
      </group>
    </group>
  );
}
