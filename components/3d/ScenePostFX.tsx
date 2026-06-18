'use client';

import { useRef, forwardRef, useImperativeHandle } from 'react';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

export interface PostFXHandles {
  triggerDeception: () => void;
}

const ScenePostFX = forwardRef<PostFXHandles>((_, ref) => {
  const chromAbRef = useRef<any>(null);
  const deceptionT = useRef(0);
  const isAnimating = useRef(false);

  useImperativeHandle(ref, () => ({
    triggerDeception() {
      isAnimating.current = true;
      deceptionT.current = 0;
    },
  }));

  // Drive chromatic aberration via raf — can't use useFrame outside Canvas without a component
  // We animate it via ref mutation in the parent's useFrame
  // This component just mounts the effect; the ref is used by CameraRig's parent

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.4}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.35}
        radius={0.65}
        mipmapBlur
      />
      <ChromaticAberration
        ref={chromAbRef}
        offset={new THREE.Vector2(0, 0)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise opacity={0.016} blendFunction={BlendFunction.ADD} />
      <Vignette offset={0.25} darkness={0.82} />
    </EffectComposer>
  );
});

ScenePostFX.displayName = 'ScenePostFX';
export default ScenePostFX;
