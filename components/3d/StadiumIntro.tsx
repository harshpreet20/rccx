'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import type { LightingHandles } from './Lighting';

interface StadiumIntroProps {
  lightingRef: React.MutableRefObject<LightingHandles | null>;
  onComplete: () => void;
}

// Drives the stadium floodlight flicker-on sequence after loading screen
export default function StadiumIntro({ lightingRef, onComplete }: StadiumIntroProps) {
  useEffect(() => {
    const lights = lightingRef.current;
    if (!lights) return;

    const { flood1, flood2, flood3, flood4 } = lights;

    const flickerOn = (lightRef: React.MutableRefObject<THREE.SpotLight | null>, targetIntensity: number) => {
      return new Promise<void>((resolve) => {
        const light = lightRef.current;
        if (!light) { resolve(); return; }

        // Start dark
        light.intensity = 0;

        // Quick flicker sequence
        const tl = gsap.timeline({ onComplete: resolve });
        tl.to(light, { intensity: targetIntensity * 0.3, duration: 0.05 })
          .to(light, { intensity: 0, duration: 0.04 })
          .to(light, { intensity: targetIntensity * 0.7, duration: 0.06 })
          .to(light, { intensity: 0, duration: 0.03 })
          .to(light, { intensity: targetIntensity * 0.5, duration: 0.04 })
          .to(light, { intensity: 0, duration: 0.05 })
          .to(light, { intensity: targetIntensity, duration: 0.18, ease: 'power2.out' });
      });
    };

    const runSequence = async () => {
      await new Promise((r) => setTimeout(r, 600));
      await flickerOn(flood1, 200);
      await new Promise((r) => setTimeout(r, 300));
      await flickerOn(flood2, 200);
      await new Promise((r) => setTimeout(r, 200));
      await Promise.all([flickerOn(flood3, 200), flickerOn(flood4, 200)]);
      await new Promise((r) => setTimeout(r, 400));
      onComplete();
    };

    runSequence();
  }, [lightingRef, onComplete]);

  return null; // pure side-effect component
}
