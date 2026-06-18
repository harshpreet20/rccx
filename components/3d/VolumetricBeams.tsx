'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FLOOD_POSITIONS: [number, number, number][] = [
  [-6, 14, -5],
  [6, 14, -5],
  [-6, 14, 5],
  [6, 14, 5],
];

const DUST_COUNT = 120;

function DustParticles({ origin }: { origin: [number, number, number] }) {
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      const r = Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      const depthFrac = Math.random(); // 0 = top, 1 = bottom
      arr[i * 3] = origin[0] + Math.cos(angle) * r * depthFrac;
      arr[i * 3 + 1] = origin[1] - depthFrac * 14;
      arr[i * 3 + 2] = origin[2] + Math.sin(angle) * r * depthFrac;
    }
    return arr;
  }, [origin]);

  const velocities = useMemo(() => {
    const arr = new Float32Array(DUST_COUNT);
    for (let i = 0; i < DUST_COUNT; i++) arr[i] = 0.002 + Math.random() * 0.004;
    return arr;
  }, []);

  useFrame(() => {
    const geo = geoRef.current;
    if (!geo) return;
    const arr = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < DUST_COUNT; i++) {
      arr[i * 3 + 1] += velocities[i]; // drift upward
      if (arr[i * 3 + 1] > origin[1]) {
        // reset to bottom of beam
        const r = Math.random() * 2.5;
        const angle = Math.random() * Math.PI * 2;
        arr[i * 3] = origin[0] + Math.cos(angle) * r;
        arr[i * 3 + 1] = origin[1] - 14;
        arr[i * 3 + 2] = origin[2] + Math.sin(angle) * r;
      }
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={0xfff5e0}
        size={0.04}
        transparent
        opacity={0.35}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function VolumetricBeams() {
  return (
    <group>
      {FLOOD_POSITIONS.map((pos, i) => (
        <group key={i}>
          {/* Cone beam */}
          <mesh position={[pos[0], pos[1] - 7, pos[2]]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[3.5, 14, 16, 1, true]} />
            <meshBasicMaterial
              color={0xfff5e0}
              transparent
              opacity={0.025}
              side={THREE.BackSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Dust in beam */}
          <DustParticles origin={pos} />
        </group>
      ))}
    </group>
  );
}
