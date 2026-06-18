'use client';

import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Lighting, { type LightingHandles } from './Lighting';
import CourtFloor from './CourtFloor';
import PlayerSilhouette from './PlayerSilhouette';
import ShuttlecockMesh, { type ShuttlecockHandles } from './ShuttlecockMesh';
import VolumetricBeams from './VolumetricBeams';
import CameraRig from './CameraRig';
import StadiumIntro from './StadiumIntro';
import ScenePostFX from './ScenePostFX';

// Deception moment: chromatic + camera shake — runs inside the Canvas
function DeceptionEffect({ triggerRef }: { triggerRef: React.MutableRefObject<(() => void) | null> }) {
  const shakeFrames = useRef(0);
  const chromOffset = useRef(0);

  triggerRef.current = () => {
    shakeFrames.current = 12;
    chromOffset.current = 0.006;
  };

  useFrame(({ camera }) => {
    if (shakeFrames.current > 0) {
      shakeFrames.current--;
      const s = (shakeFrames.current / 12) * 0.06;
      camera.position.x += (Math.random() - 0.5) * s;
      camera.position.y += (Math.random() - 0.5) * s * 0.5;
    }
    if (chromOffset.current > 0) {
      chromOffset.current = Math.max(0, chromOffset.current - 0.0004);
    }
  });

  return null;
}

// Mobile detection — disable heavy effects on touch devices
const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export default function BadmintonScene() {
  const lightingRef = useRef<LightingHandles | null>(null);
  const shuttleRef = useRef<ShuttlecockHandles | null>(null);
  const introCompleteRef = useRef(false);
  const deceptionTriggerRef = useRef<(() => void) | null>(null);
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    introCompleteRef.current = true;
    setIntroComplete(true);
  }, []);

  const handleDeception = useCallback(() => {
    deceptionTriggerRef.current?.();
  }, []);

  return (
    <>
      <Canvas
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: '#060E1C',
        }}
        camera={{ position: [0, 28, 0], fov: 45, near: 0.1, far: 300 }}
        gl={{
          antialias: !isMobile,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        shadows
      >
        <Lighting ref={lightingRef} />
        <CourtFloor />
        <PlayerSilhouette />
        <ShuttlecockMesh ref={shuttleRef} />
        {!isMobile && <VolumetricBeams />}
        <CameraRig
          shuttleGroupRef={shuttleRef.current?.groupRef ?? { current: null }}
          introCompleteRef={introCompleteRef}
          onDeceptionTrigger={handleDeception}
        />
        <DeceptionEffect triggerRef={deceptionTriggerRef} />
        {!isMobile && <ScenePostFX />}
      </Canvas>

      {/* Stadium intro sequence — runs once after loading screen */}
      <StadiumIntro
        lightingRef={lightingRef}
        onComplete={handleIntroComplete}
      />
    </>
  );
}
