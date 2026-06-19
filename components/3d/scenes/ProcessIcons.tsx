'use client';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SceneContext } from '../ThreeCanvas';

gsap.registerPlugin(ScrollTrigger);

function makeCourtTexture(): THREE.CanvasTexture {
  const cvs = document.createElement('canvas');
  cvs.width = 256; cvs.height = 128;
  const ctx = cvs.getContext('2d')!;
  ctx.fillStyle = '#1a3c2a'; ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, 240, 112);
  ctx.beginPath(); ctx.moveTo(128, 8); ctx.lineTo(128, 120); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(8, 64); ctx.lineTo(248, 64); ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeRect(68, 8, 120, 56);
  ctx.strokeRect(68, 64, 120, 56);
  return new THREE.CanvasTexture(cvs);
}

function makeRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}

function setup({ scene, camera, renderer, container, reducedMotion }: SceneContext) {
  camera.position.set(0, 0, 7);
  camera.lookAt(0, 0, 0);
  renderer.setClearColor(0x000000, 0);

  scene.add(new THREE.AmbientLight(0x333333, 0.7));
  const dir = new THREE.DirectionalLight(0xfff8f0, 1.2);
  dir.position.set(3, 5, 6);
  scene.add(dir);

  const groups: THREE.Group[] = [];
  const tweens: gsap.core.Tween[] = [];
  const xPos = [-2.4, 0, 2.4];

  // ── Icon A: Frosted bubble + gold trajectory ──
  const gA = new THREE.Group();
  gA.position.x = xPos[0];
  scene.add(gA); groups.push(gA);

  const bubbleGeo = new THREE.ExtrudeGeometry(makeRoundedRectShape(0.9, 0.7, 0.1), {
    depth: 0.22,
    bevelEnabled: true,
    bevelSize: 0.04,
    bevelThickness: 0.04,
    bevelSegments: 4,
  });
  bubbleGeo.translate(-0.0, 0, -0.11);
  const bubbleMesh = new THREE.Mesh(bubbleGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xf5f0e6,
      roughness: 0.05,
      metalness: 0,
      transmission: 0.65,
      thickness: 0.4,
      transparent: true,
      opacity: 0.85,
    })
  );
  gA.add(bubbleMesh);

  const trajCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.5, -0.25, 0.12),
    new THREE.Vector3(0, 0.15, 0.12),
    new THREE.Vector3(0.5, 0.22, 0.12),
  ]);
  gA.add(new THREE.Mesh(
    new THREE.TubeGeometry(trajCurve, 24, 0.018, 8, false),
    new THREE.MeshStandardMaterial({ color: 0xc9a961, metalness: 1, roughness: 0.15 })
  ));

  // ── Icon B: Court plane + poll bars ──
  const gB = new THREE.Group();
  gB.position.x = xPos[1];
  scene.add(gB); groups.push(gB);

  const court = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 0.85),
    new THREE.MeshStandardMaterial({ map: makeCourtTexture(), roughness: 0.85 })
  );
  court.rotation.x = -0.3;
  gB.add(court);

  const barMats = [
    new THREE.MeshPhysicalMaterial({ color: 0x722f37, transmission: 0.45, roughness: 0.1, transparent: true, opacity: 0.9 }),
    new THREE.MeshPhysicalMaterial({ color: 0xf5f0e6, transmission: 0.45, roughness: 0.1, transparent: true, opacity: 0.9 }),
  ];
  [[- 0.28, 0.52, 0.13], [0.28, 0.38, 0.13]].forEach(([bx, bh, bw], bi) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.14), barMats[bi]);
    bar.position.set(bx, 0.5 + bh / 2, 0.07);
    gB.add(bar);
  });

  // ── Icon C: Neural shuttlecock ──
  const gC = new THREE.Group();
  gC.position.x = xPos[2];
  scene.add(gC); groups.push(gC);

  const nodeMat = new THREE.MeshStandardMaterial({ color: 0xc9a961, metalness: 0.8, roughness: 0.2 });
  const lineMat = new THREE.LineBasicMaterial({ color: 0x666666, transparent: true, opacity: 0.55 });

  const nodePos: [number, number][] = [
    [0, -0.38], [0.1, -0.28], [-0.1, -0.28],
    [0, -0.1], [0.18, -0.05], [-0.18, -0.05],
    [0.12, 0.12], [-0.12, 0.12],
    [0, 0.32], [0.14, 0.26], [-0.14, 0.26],
    [0.09, 0.42], [-0.09, 0.42], [0, 0.52],
  ];

  const nodeGeo = new THREE.SphereGeometry(0.035, 14, 14);
  const nodes: THREE.Mesh[] = nodePos.map(([nx, ny]) => {
    const n = new THREE.Mesh(nodeGeo, nodeMat);
    n.position.set(nx, ny, 0);
    gC.add(n);
    return n;
  });

  const conns: [number, number][] = [
    [0,1],[0,2],[0,3],[1,3],[2,3],[3,4],[3,5],
    [4,6],[5,7],[6,8],[7,8],[4,9],[5,10],
    [8,9],[8,10],[9,11],[10,12],[11,13],[12,13],[8,11],[8,12],
  ];
  conns.forEach(([a, b]) => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...nodePos[a], 0),
      new THREE.Vector3(...nodePos[b], 0),
    ]);
    gC.add(new THREE.Line(geo, lineMat));
  });

  // Node pulse
  if (!reducedMotion) {
    tweens.push(gsap.to(nodes.map((n) => n.scale), {
      x: 1.4, y: 1.4, z: 1.4,
      duration: 0.7,
      stagger: { each: 0.04, repeat: -1, yoyo: true },
      ease: 'sine.inOut',
    }));
  }

  // Float all groups
  if (!reducedMotion) {
    groups.forEach((g, i) => {
      tweens.push(gsap.to(g.position, {
        y: '+=0.07',
        duration: 3 + i * 0.6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: i * 0.4,
      }));
    });
  }

  // Scroll reveal staggered
  groups.forEach((g, i) => {
    g.scale.set(0.8, 0.8, 0.8);
    ScrollTrigger.create({
      trigger: container,
      start: `top ${80 - i * 5}%`,
      once: true,
      onEnter: () => {
        gsap.to(g.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: 'power2.out', delay: i * 0.18 });
      },
    });
  });

  return () => {
    tweens.forEach((t) => t.kill());
    ScrollTrigger.getAll().forEach((s) => s.kill());
  };
}

const ThreeCanvas = dynamic(() => import('../ThreeCanvas'), { ssr: false });

export default function ProcessIcons() {
  return (
    <div className="w-full h-[280px] md:h-[340px]">
      <ThreeCanvas setup={setup} />
    </div>
  );
}
