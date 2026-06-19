'use client';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { gsap } from 'gsap';
import type { SceneContext } from '../ThreeCanvas';

function makeMarbleTexture(): THREE.CanvasTexture {
  const cvs = document.createElement('canvas');
  cvs.width = 512; cvs.height = 512;
  const ctx = cvs.getContext('2d')!;
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 12; i++) {
    ctx.strokeStyle = `rgba(60,60,60,${0.3 + Math.random() * 0.4})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, Math.random() * 512);
    ctx.bezierCurveTo(
      Math.random() * 512, Math.random() * 512,
      Math.random() * 512, Math.random() * 512,
      Math.random() * 512, Math.random() * 512
    );
    ctx.stroke();
  }
  return new THREE.CanvasTexture(cvs);
}

function setup({ scene, camera, renderer, container, reducedMotion }: SceneContext) {
  camera.position.set(0, 2, 7);
  camera.lookAt(0, 1.5, 0);
  renderer.setClearColor(0x000000, 0);

  // Lights
  const spot = new THREE.SpotLight(0xfff8f0, 4, 25, 0.35, 0.7);
  spot.position.set(0, 8, 4);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  scene.add(spot);
  scene.add(new THREE.AmbientLight(0x111122, 0.5));
  const rim = new THREE.DirectionalLight(0x722f37, 0.5);
  rim.position.set(-3, 2, -2);
  scene.add(rim);

  // Base — dark marble
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.18, 2.2),
    new THREE.MeshStandardMaterial({ map: makeMarbleTexture(), roughness: 0.08, metalness: 0.15 })
  );
  base.receiveShadow = true;
  scene.add(base);

  // Trophy group
  const trophy = new THREE.Group();
  trophy.position.y = 0.09;
  scene.add(trophy);

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x5a5a5a, roughness: 0.25, metalness: 0.75 });
  const handleMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85, metalness: 0.1 });
  const stringMat = new THREE.MeshBasicMaterial({ color: 0x777777, wireframe: true, transparent: true, opacity: 0.25 });

  for (let i = 0; i < 6; i++) {
    const racket = new THREE.Group();
    const angle = (i / 6) * Math.PI * 2;

    // Head
    const head = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.05, 12, 28), frameMat);
    head.scale.set(1, 1.35, 0.6);
    head.castShadow = true;
    racket.add(head);

    // String bed
    const strings = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 1.1), stringMat);
    racket.add(strings);

    // Handle
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 1.3, 12), handleMat);
    handle.position.y = -1.1;
    racket.add(handle);

    // Grip wrap
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.5, 12),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.95 }));
    grip.position.y = -1.5;
    racket.add(grip);

    racket.rotation.y = angle;
    racket.rotation.z = 0.28;
    racket.position.set(Math.sin(angle) * 0.3, 1.6, Math.cos(angle) * 0.3);
    trophy.add(racket);
  }

  // Central column connecting rackets
  const column = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 2.8, 16),
    new THREE.MeshStandardMaterial({ color: 0x4a4a4a, metalness: 0.8, roughness: 0.2 })
  );
  column.position.y = 1.4;
  trophy.add(column);

  // Auto-rotate
  let rotateTween: gsap.core.Tween | null = null;
  if (!reducedMotion) {
    rotateTween = gsap.to(trophy.rotation, {
      y: Math.PI * 2,
      duration: 40,
      repeat: -1,
      ease: 'none',
    });
  } else {
    trophy.rotation.y = Math.PI / 6;
  }

  // Mouse tilt
  const targetTilt = { x: 0 };
  const onMove = (e: MouseEvent) => {
    if (reducedMotion) return;
    const rect = container.getBoundingClientRect();
    const ny = (e.clientY - rect.top) / rect.height * 2 - 1;
    targetTilt.x = ny * 0.15;
  };
  container.addEventListener('mousemove', onMove);

  const tickFn = () => {
    trophy.rotation.x += (targetTilt.x - trophy.rotation.x) * 0.04;
  };
  gsap.ticker.add(tickFn);

  // Hover scale
  const onEnter = () => { if (!reducedMotion) gsap.to(trophy.scale, { x: 1.03, y: 1.03, z: 1.03, duration: 0.6, ease: 'power2.out' }); };
  const onLeave = () => { if (!reducedMotion) gsap.to(trophy.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'power2.out' }); };
  container.addEventListener('mouseenter', onEnter);
  container.addEventListener('mouseleave', onLeave);

  return () => {
    rotateTween?.kill();
    gsap.ticker.remove(tickFn);
    container.removeEventListener('mousemove', onMove);
    container.removeEventListener('mouseenter', onEnter);
    container.removeEventListener('mouseleave', onLeave);
  };
}

const ThreeCanvas = dynamic(() => import('../ThreeCanvas'), { ssr: false });

export default function LatticeTrophy() {
  return (
    <div className="w-full h-[420px] md:h-[520px]">
      <ThreeCanvas setup={setup} />
    </div>
  );
}
