'use client';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SceneContext } from '../ThreeCanvas';

gsap.registerPlugin(ScrollTrigger);

function buildShuttlecock(scene: THREE.Scene) {
  const group = new THREE.Group();

  // Cork base — aged brass
  const corkMat = new THREE.MeshStandardMaterial({ color: 0xc9a961, metalness: 0.8, roughness: 0.35 });
  const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.32, 32), corkMat);
  cork.position.y = -0.16;
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    corkMat
  );
  cap.rotation.x = Math.PI;
  cap.position.y = 0;
  group.add(cork, cap);

  // Ferrule ring
  const ferrule = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.025, 16, 32),
    new THREE.MeshStandardMaterial({ color: 0x9a7b2a, metalness: 1, roughness: 0.2 })
  );
  ferrule.rotation.x = Math.PI / 2;
  ferrule.position.y = 0.02;
  group.add(ferrule);

  // 16 feathers — LatheGeometry cream ceramic
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const x = 0.03 + Math.sin(t * Math.PI) * 0.07 + t * 0.04;
    const y = t * 1.1;
    pts.push(new THREE.Vector2(x, y));
  }
  const featherGeo = new THREE.LatheGeometry(pts, 8);
  const featherMat = new THREE.MeshStandardMaterial({
    color: 0xf5f0e6,
    roughness: 0.88,
    metalness: 0,
    side: THREE.DoubleSide,
  });

  for (let i = 0; i < 16; i++) {
    const feather = new THREE.Mesh(featherGeo, featherMat);
    const angle = (i / 16) * Math.PI * 2;
    feather.rotation.y = angle;
    feather.rotation.x = 0.18;
    // Drift slightly apart for exploded look
    feather.position.x = Math.sin(angle) * 0.12;
    feather.position.z = Math.cos(angle) * 0.12;
    feather.position.y = 0.08;
    feather.castShadow = true;
    group.add(feather);
  }

  scene.add(group);
  return group;
}

function setup({ scene, camera, renderer, container, reducedMotion }: SceneContext) {
  camera.position.set(0, 1, 5);
  camera.lookAt(0, 0.4, 0);
  renderer.setClearColor(0x000000, 0);

  // Lighting
  const spot = new THREE.SpotLight(0xfff8f0, 2.5, 20, 0.45, 0.6);
  spot.position.set(2, 6, 4);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  scene.add(spot);

  const bounce = new THREE.PointLight(0x722f37, 1.2, 8);
  bounce.position.set(0, -2.5, 1.5);
  scene.add(bounce);

  scene.add(new THREE.AmbientLight(0x1a1a2e, 0.6));

  const group = buildShuttlecock(scene);

  // Float animation
  let floatTween: gsap.core.Tween | null = null;
  let rotateTween: gsap.core.Tween | null = null;
  if (!reducedMotion) {
    floatTween = gsap.to(group.position, {
      y: '+=0.12',
      duration: 3.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
    rotateTween = gsap.to(group.rotation, {
      y: Math.PI * 2,
      duration: 22,
      repeat: -1,
      ease: 'none',
    });
  }

  // Scroll parallax
  const st = ScrollTrigger.create({
    trigger: container,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 0.8,
    onUpdate: (self) => {
      if (reducedMotion) return;
      group.rotation.x = self.progress * 0.3;
      group.position.y += (self.progress * -0.4 - group.position.y) * 0.05;
    },
  });

  return () => {
    floatTween?.kill();
    rotateTween?.kill();
    st.kill();
  };
}

const ThreeCanvas = dynamic(() => import('../ThreeCanvas'), { ssr: false });

export default function ShuttlecockSculpture() {
  return (
    <div className="w-full h-[420px] md:h-[560px]">
      <ThreeCanvas setup={setup} />
    </div>
  );
}
