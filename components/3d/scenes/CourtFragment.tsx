'use client';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SceneContext } from '../ThreeCanvas';

gsap.registerPlugin(ScrollTrigger);

function makeCourtTexture(): THREE.CanvasTexture {
  const cvs = document.createElement('canvas');
  cvs.width = 512; cvs.height = 512;
  const ctx = cvs.getContext('2d')!;
  ctx.fillStyle = '#1a3c2a'; ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5;
  ctx.strokeRect(16, 16, 480, 480);
  ctx.beginPath(); ctx.moveTo(256, 16); ctx.lineTo(256, 496); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(16, 256); ctx.lineTo(496, 256); ctx.stroke();
  ctx.lineWidth = 3;
  ctx.strokeRect(140, 140, 232, 232);
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath(); ctx.moveTo(16, 128); ctx.lineTo(496, 128); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(16, 384); ctx.lineTo(496, 384); ctx.stroke();
  ctx.setLineDash([]);
  return new THREE.CanvasTexture(cvs);
}

function setup({ scene, camera, renderer, container, reducedMotion }: SceneContext) {
  camera.position.set(2.5, 3, 5);
  camera.lookAt(0, 0, 0);
  renderer.setClearColor(0x000000, 0);

  scene.add(new THREE.AmbientLight(0x334455, 0.7));
  const spot = new THREE.SpotLight(0xfff8f0, 2, 20, 0.5, 0.6);
  spot.position.set(3, 6, 5);
  scene.add(spot);

  const group = new THREE.Group();
  scene.add(group);

  // Court surface
  const court = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5, 1, 1),
    new THREE.MeshStandardMaterial({ map: makeCourtTexture(), roughness: 0.88 })
  );
  court.rotation.x = -Math.PI / 2;
  court.rotation.z = Math.PI / 10;
  court.receiveShadow = true;
  group.add(court);

  // Net line
  const net = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.06, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })
  );
  net.position.set(0, 0.03, 0);
  net.rotation.y = Math.PI / 10;
  group.add(net);

  // Dust particles
  const DUST = 240;
  const posArr = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST * 3; i++) posArr[i] = (Math.random() - 0.5) * 6;
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  const dust = new THREE.Points(dustGeo,
    new THREE.PointsMaterial({
      color: 0xc9a961,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  group.add(dust);

  // Entrance slide
  group.position.x = reducedMotion ? 0 : -4;
  if (!reducedMotion) {
    gsap.to(group.position, {
      x: 0,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 82%',
        once: true,
      },
    });
  }

  // Dust drift
  const positions = dustGeo.attributes.position.array as Float32Array;
  const ticker = () => {
    for (let i = 1; i < DUST * 3; i += 3) {
      positions[i] += 0.0012;
      if (positions[i] > 3) positions[i] = -3;
    }
    dustGeo.attributes.position.needsUpdate = true;
  };
  gsap.ticker.add(ticker);

  return () => {
    gsap.ticker.remove(ticker);
    ScrollTrigger.getAll().forEach((s) => s.kill());
  };
}

const ThreeCanvas = dynamic(() => import('../ThreeCanvas'), { ssr: false });

export default function CourtFragment() {
  return (
    <div className="w-full h-[320px] md:h-[420px]">
      <ThreeCanvas setup={setup} />
    </div>
  );
}
