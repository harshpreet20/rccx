'use client';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SceneContext } from '../ThreeCanvas';

gsap.registerPlugin(ScrollTrigger);

function makeCourtTexture(): THREE.CanvasTexture {
  const cvs = document.createElement('canvas');
  cvs.width = 1024; cvs.height = 1024;
  const ctx = cvs.getContext('2d')!;

  // Rich green surface with gradient
  const grad = ctx.createRadialGradient(512, 512, 0, 512, 512, 700);
  grad.addColorStop(0, '#1e5c38');
  grad.addColorStop(0.6, '#163d26');
  grad.addColorStop(1, '#0c2218');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle texture grain
  for (let i = 0; i < 2000; i++) {
    const alpha = Math.random() * 0.04;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }

  // Court lines — crisp white
  ctx.strokeStyle = 'rgba(255,255,255,0.92)';
  ctx.lineWidth = 8;
  ctx.strokeRect(32, 32, 960, 960);
  ctx.lineWidth = 6;
  // Center line
  ctx.beginPath(); ctx.moveTo(512, 32); ctx.lineTo(512, 992); ctx.stroke();
  // Net line
  ctx.beginPath(); ctx.moveTo(32, 512); ctx.lineTo(992, 512); ctx.stroke();
  // Service lines
  ctx.lineWidth = 4;
  ctx.strokeRect(200, 200, 624, 624);
  // Short service line
  ctx.beginPath(); ctx.moveTo(32, 324); ctx.lineTo(992, 324); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(32, 700); ctx.lineTo(992, 700); ctx.stroke();

  // Gold center dot
  ctx.fillStyle = 'rgba(201,168,76,0.6)';
  ctx.beginPath();
  ctx.arc(512, 512, 18, 0, Math.PI * 2);
  ctx.fill();

  // Line glow effect
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 24;
  ctx.strokeRect(32, 32, 960, 960);

  return new THREE.CanvasTexture(cvs);
}

function setup({ scene, camera, renderer, container, reducedMotion }: SceneContext) {
  camera.position.set(2.5, 3.5, 5.5);
  camera.lookAt(0.2, 0, 0);

  scene.add(new THREE.AmbientLight(0x1a2a3a, 0.8));

  // Dramatic court lighting
  const flood = new THREE.SpotLight(0xfff8f0, 6, 20, 0.5, 0.6);
  flood.position.set(2, 8, 5);
  flood.castShadow = true;
  flood.shadow.mapSize.set(2048, 2048);
  flood.shadow.bias = -0.001;
  scene.add(flood);

  const fill = new THREE.DirectionalLight(0x3a5a7a, 1.2);
  fill.position.set(-3, 3, 2);
  scene.add(fill);

  const bounce = new THREE.PointLight(0xc9a84c, 1.8, 8);
  bounce.position.set(0, 0.5, 2);
  scene.add(bounce);

  const group = new THREE.Group();
  scene.add(group);

  // Court surface
  const court = new THREE.Mesh(
    new THREE.BoxGeometry(5.5, 0.06, 5.5),
    new THREE.MeshStandardMaterial({
      map: makeCourtTexture(),
      roughness: 0.72,
      metalness: 0.05,
      envMapIntensity: 0.3,
    })
  );
  court.rotation.y = Math.PI / 9;
  court.receiveShadow = true;
  group.add(court);

  // Court edge trim
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 });
  [[2.75, 0, 0], [-2.75, 0, 0], [0, 0, 2.75], [0, 0, -2.75]].forEach(([ex, ey, ez], i) => {
    const trim = new THREE.Mesh(
      i < 2 ? new THREE.BoxGeometry(0.08, 0.12, 5.5) : new THREE.BoxGeometry(5.5, 0.12, 0.08),
      trimMat
    );
    trim.position.set(ex, ey + 0.09, ez);
    trim.rotation.y = Math.PI / 9;
    scene.add(trim);
  });

  // Net post + net
  const postMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
  [-1.6, 1.6].forEach((px) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 12), postMat);
    post.position.set(px, 0.6, 0);
    post.rotation.y = Math.PI / 9;
    scene.add(post);
  });
  const net = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 0.76, 20, 10),
    new THREE.MeshStandardMaterial({ color: 0x333333, wireframe: true, transparent: true, opacity: 0.55 })
  );
  net.rotation.y = Math.PI / 9;
  net.position.y = 0.5;
  scene.add(net);

  // Dust particles — gold motes
  const DUST = 300;
  const posArr = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST * 3; i++) posArr[i] = (Math.random() - 0.5) * 7;
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0xd4a820,
    size: 0.055,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  group.add(dust);

  // Entrance from left
  group.position.x = reducedMotion ? 0 : -5;
  if (!reducedMotion) {
    gsap.to(group.position, {
      x: 0,
      duration: 1.6,
      ease: 'expo.out',
      scrollTrigger: { trigger: container, start: 'top 80%', once: true },
    });
  }

  // Dust drift + gentle rotation
  const positions = dustGeo.attributes.position.array as Float32Array;
  const ticker = () => {
    for (let i = 1; i < DUST * 3; i += 3) {
      positions[i] += 0.0014;
      if (positions[i] > 3.5) positions[i] = -3.5;
    }
    dustGeo.attributes.position.needsUpdate = true;
    if (!reducedMotion) court.rotation.y += 0.0001;
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
    <div className="w-full h-[340px] md:h-[450px]">
      <ThreeCanvas setup={setup} />
    </div>
  );
}
