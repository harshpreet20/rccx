'use client';

import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface LightingHandles {
  flood1: React.MutableRefObject<THREE.SpotLight | null>;
  flood2: React.MutableRefObject<THREE.SpotLight | null>;
  flood3: React.MutableRefObject<THREE.SpotLight | null>;
  flood4: React.MutableRefObject<THREE.SpotLight | null>;
}

const Lighting = forwardRef<LightingHandles>((_, ref) => {
  const flood1 = useRef<THREE.SpotLight | null>(null);
  const flood2 = useRef<THREE.SpotLight | null>(null);
  const flood3 = useRef<THREE.SpotLight | null>(null);
  const flood4 = useRef<THREE.SpotLight | null>(null);

  useImperativeHandle(ref, () => ({ flood1, flood2, flood3, flood4 }));

  // Subtle court line pulse via rect area — handled in CourtFloor
  return (
    <>
      {/* 4 Stadium floods — intensity driven by StadiumIntro */}
      <spotLight
        ref={flood1}
        position={[-6, 14, -5]}
        color={0xfff5e0}
        intensity={0}
        angle={0.55}
        penumbra={0.3}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        ref={flood2}
        position={[6, 14, -5]}
        color={0xfff5e0}
        intensity={0}
        angle={0.55}
        penumbra={0.3}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        ref={flood3}
        position={[-6, 14, 5]}
        color={0xfff5e0}
        intensity={0}
        angle={0.55}
        penumbra={0.3}
      />
      <spotLight
        ref={flood4}
        position={[6, 14, 5]}
        color={0xfff5e0}
        intensity={0}
        angle={0.55}
        penumbra={0.3}
      />

      {/* Gold key — broadcast quality key light */}
      <spotLight
        position={[8, 12, 8]}
        color={0xc9a84c}
        intensity={80}
        angle={0.4}
        penumbra={0.5}
      />

      {/* Navy fill */}
      <directionalLight position={[-10, 6, -5]} color={0x1a3060} intensity={6} />

      {/* Crimson rim — silhouettes the player */}
      <spotLight
        position={[-6, 3, -12]}
        color={0x9b2335}
        intensity={50}
        angle={0.55}
        penumbra={0.6}
      />

      {/* Court bounce */}
      <rectAreaLight
        position={[0, 0.15, 0]}
        width={28}
        height={14}
        color={0x0a2040}
        intensity={2}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* Ambient */}
      <ambientLight color={0x0a1628} intensity={0.4} />
    </>
  );
});

Lighting.displayName = 'Lighting';
export default Lighting;
