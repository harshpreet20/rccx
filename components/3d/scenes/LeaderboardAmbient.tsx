'use client';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SceneContext } from '../ThreeCanvas';

gsap.registerPlugin(ScrollTrigger);

const INSTANCE_COUNT = 8;

function setup({ scene, camera, renderer, container, reducedMotion }: SceneContext) {
  camera.position.set(0, 0, 12);
  camera.lookAt(0, 0, 0);
  renderer.setClearColor(0x000000, 0);

  // Simplified shuttlecock cone (instanced for performance)
  const coneGeo = new THREE.ConeGeometry(0.12, 0.45, 6);

  const makeMesh = (color: number) =>
    new THREE.InstancedMesh(
      coneGeo,
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.07, depthWrite: false }),
      INSTANCE_COUNT
    );

  const cream = makeMesh(0xf5f0e6);
  const burg = makeMesh(0x722f37);
  scene.add(cream, burg);

  const dummy = new THREE.Object3D();
  const baseData: { x: number; y: number; z: number; baseY: number; speed: number }[] = [];

  [cream, burg].forEach((mesh, mi) => {
    for (let i = 0; i < INSTANCE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 10;
      const z = -4 - Math.random() * 10;
      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (mi === 0) baseData.push({ x, y, z, baseY: y, speed: 0.3 + Math.random() * 0.5 });
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  const st = ScrollTrigger.create({
    trigger: container,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      if (reducedMotion) return;
      const p = self.progress;
      [cream, burg].forEach((mesh, mi) => {
        for (let i = 0; i < INSTANCE_COUNT; i++) {
          const d = baseData[i];
          dummy.position.set(d.x, d.baseY + p * d.speed * (mi === 0 ? 1.2 : -0.8), d.z);
          dummy.rotation.y = p * Math.PI * 2 + i * 0.5;
          dummy.rotation.z = p * 0.5;
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      });
    },
  });

  return () => { st.kill(); };
}

const ThreeCanvas = dynamic(() => import('../ThreeCanvas'), { ssr: false });

export default function LeaderboardAmbient() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    >
      <ThreeCanvas setup={setup} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
