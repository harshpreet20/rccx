'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Regulation badminton court: 13.4m × 6.1m
// Scale: 1 unit = 0.5m → 26.8 × 12.2 units
const CW = 26.8;
const CH = 12.2;

// Singles width in units: 5.18m × 2 = 10.36 units → offset from centre = ±5.18
const SINGLES_HALF = 5.18;
const DOUBLES_HALF = CH / 2; // 6.1
// Short service line: 1.98m from net → 3.96 units
const SSL = 3.96;
// Long service line (singles): 0.76m from back → CW/2 - 1.52
const LSL_SINGLES = CW / 2 - 1.52;
// Net at centre
// Service courts depth: SSL to back of service court

function buildCourtLines(): Float32Array {
  const lines: number[] = [];

  const line = (x1: number, y: number, z1: number, x2: number, z2: number) => {
    lines.push(x1, y, z1, x2, y, z2);
  };

  const Y = 0.012; // just above floor

  // Doubles boundary
  line(-CW / 2, Y, -DOUBLES_HALF, CW / 2, -DOUBLES_HALF);
  line(-CW / 2, Y, DOUBLES_HALF, CW / 2, DOUBLES_HALF);
  line(-CW / 2, Y, -DOUBLES_HALF, -CW / 2, DOUBLES_HALF);
  line(CW / 2, Y, -DOUBLES_HALF, CW / 2, DOUBLES_HALF);

  // Singles side lines
  line(-CW / 2, Y, -SINGLES_HALF, CW / 2, -SINGLES_HALF);
  line(-CW / 2, Y, SINGLES_HALF, CW / 2, SINGLES_HALF);

  // Net line (centre)
  line(0, Y, -DOUBLES_HALF, 0, DOUBLES_HALF);

  // Centre line (full length)
  line(-CW / 2, Y, 0, CW / 2, 0);

  // Short service lines (both sides)
  line(-SSL, Y, -SINGLES_HALF, -SSL, SINGLES_HALF);
  line(SSL, Y, -SINGLES_HALF, SSL, SINGLES_HALF);

  // Long service line for doubles (rear service line)
  const LSL_D = CW / 2 - 0.76;
  line(-LSL_D, Y, -DOUBLES_HALF, -LSL_D, DOUBLES_HALF);
  line(LSL_D, Y, -DOUBLES_HALF, LSL_D, DOUBLES_HALF);

  return new Float32Array(lines);
};

export default function CourtFloor() {
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);
  const emissivePlanesRef = useRef<THREE.Group>(null);
  let t = 0;

  useFrame((_, delta) => {
    t += delta;
    const pulse = 2.5 + Math.sin(t * 0.7) * 1.5;
    if (emissivePlanesRef.current) {
      emissivePlanesRef.current.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = pulse;
      });
    }
  });

  const linePositions = buildCourtLines();
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

  // Build emissive line strips (thin planes along each court line)
  const lineSegments = [
    // Doubles boundary
    { x: 0, z: -DOUBLES_HALF, w: CW, h: 0.05, ry: 0 },
    { x: 0, z: DOUBLES_HALF, w: CW, h: 0.05, ry: 0 },
    { x: -CW / 2, z: 0, w: 0.05, h: CH, ry: 0 },
    { x: CW / 2, z: 0, w: 0.05, h: CH, ry: 0 },
    // Singles side lines
    { x: 0, z: -SINGLES_HALF, w: CW, h: 0.04, ry: 0 },
    { x: 0, z: SINGLES_HALF, w: CW, h: 0.04, ry: 0 },
    // Net line
    { x: 0, z: 0, w: 0.05, h: CH, ry: 0 },
    // Centre line
    { x: 0, z: 0, w: CW, h: 0.04, ry: 0 },
    // Short service lines
    { x: -SSL, z: 0, w: 0.04, h: SINGLES_HALF * 2, ry: 0 },
    { x: SSL, z: 0, w: 0.04, h: SINGLES_HALF * 2, ry: 0 },
  ];

  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[CW, CH]} />
        <meshStandardMaterial
          color={0x060e1c}
          roughness={0.55}
          metalness={0.4}
        />
      </mesh>

      {/* Emissive gold court lines */}
      <group ref={emissivePlanesRef}>
        {lineSegments.map((seg, i) => (
          <mesh key={i} position={[seg.x, 0.011, seg.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[seg.w, seg.h]} />
            <meshStandardMaterial
              color={0xc9a84c}
              emissive={0xc9a84c}
              emissiveIntensity={3}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Wire net */}
      <group position={[0, 0.775, 0]}>
        <mesh>
          <boxGeometry args={[CH, 1.55, 0.04]} />
          <meshBasicMaterial color={0xc9a84c} wireframe opacity={0.6} transparent />
        </mesh>
        {/* Net posts */}
        <mesh position={[0, 0, -DOUBLES_HALF]}>
          <cylinderGeometry args={[0.04, 0.04, 1.55, 8]} />
          <meshStandardMaterial color={0xc9a84c} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, DOUBLES_HALF]}>
          <cylinderGeometry args={[0.04, 0.04, 1.55, 8]} />
          <meshStandardMaterial color={0xc9a84c} metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Stadium crowd stands — four sides, dark silhouette blur */}
      {[
        { pos: [0, 1.5, -DOUBLES_HALF - 3] as [number, number, number], rot: [0, 0, 0] as [number, number, number], w: CW + 8, h: 4 },
        { pos: [0, 1.5, DOUBLES_HALF + 3] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], w: CW + 8, h: 4 },
        { pos: [-CW / 2 - 3, 1.5, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], w: CH + 6, h: 4 },
        { pos: [CW / 2 + 3, 1.5, 0] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number], w: CH + 6, h: 4 },
      ].map((stand, i) => (
        <mesh key={i} position={stand.pos} rotation={stand.rot}>
          <planeGeometry args={[stand.w, stand.h]} />
          <meshBasicMaterial color={0x0a1020} opacity={0.7} transparent side={THREE.FrontSide} />
        </mesh>
      ))}
    </group>
  );
}
