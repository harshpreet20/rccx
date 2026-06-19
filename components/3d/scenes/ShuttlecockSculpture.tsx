'use client';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SceneContext } from '../ThreeCanvas';

gsap.registerPlugin(ScrollTrigger);

function buildEnv(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const scene = new THREE.Scene();
  const dl1 = new THREE.DirectionalLight(0xfff5e0, 3); dl1.position.set(2, 5, 3); scene.add(dl1);
  const dl2 = new THREE.DirectionalLight(0x722f37, 1.5); dl2.position.set(-3, -2, 2); scene.add(dl2);
  const dl3 = new THREE.DirectionalLight(0x3a4a6a, 0.8); dl3.position.set(0, 3, -5); scene.add(dl3);
  const env = pmrem.fromScene(new RoomEnvironment()).texture;
  pmrem.dispose();
  return env;
}

function setup({ scene, camera, renderer, container, reducedMotion }: SceneContext) {
  camera.position.set(0.5, 1.2, 4.5);
  camera.lookAt(0, 0.6, 0);

  // Environment for metallic reflections
  const env = buildEnv(renderer);
  scene.environment = env;

  // Lighting rig — 3-point studio
  const key = new THREE.SpotLight(0xfff5e0, 8, 18, 0.42, 0.65);
  key.position.set(3, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.001;
  scene.add(key);

  const fill = new THREE.PointLight(0x3a4a8a, 2.5, 12);
  fill.position.set(-3, 2, 3);
  scene.add(fill);

  const bounce = new THREE.PointLight(0x8b1a2a, 3.5, 10);
  bounce.position.set(0.5, -1.5, 2);
  scene.add(bounce);

  const rim = new THREE.DirectionalLight(0xffd89b, 1.2);
  rim.position.set(-1, 4, -4);
  scene.add(rim);

  scene.add(new THREE.AmbientLight(0x0a0510, 0.8));

  const group = new THREE.Group();
  scene.add(group);

  // ── Cork base — aged brass with patina ──
  const corkMat = new THREE.MeshStandardMaterial({
    color: 0xb8860b,
    emissive: 0x3a2800,
    emissiveIntensity: 0.15,
    metalness: 0.88,
    roughness: 0.28,
    envMapIntensity: 1.4,
  });
  const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.20, 0.36, 48), corkMat);
  cork.position.y = -0.18;
  cork.castShadow = true;
  group.add(cork);

  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    corkMat
  );
  cap.rotation.x = Math.PI;
  cap.castShadow = true;
  group.add(cap);

  // Ferrule ring — bright gold
  const feruleMat = new THREE.MeshStandardMaterial({
    color: 0xe8c840,
    emissive: 0x201000,
    emissiveIntensity: 0.1,
    metalness: 1.0,
    roughness: 0.08,
    envMapIntensity: 2.0,
  });
  const ferrule = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.028, 24, 64), feruleMat);
  ferrule.rotation.x = Math.PI / 2;
  ferrule.position.y = 0.02;
  group.add(ferrule);

  // ── 16 feathers — matte cream ceramic ──
  const featherMat = new THREE.MeshStandardMaterial({
    color: 0xf8f3e8,
    emissive: 0x1a1005,
    emissiveIntensity: 0.04,
    roughness: 0.82,
    metalness: 0.0,
    side: THREE.DoubleSide,
    envMapIntensity: 0.3,
  });

  // More detailed feather — tapered quill shape
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const r = Math.sin(t * Math.PI) * 0.06 + 0.008 + (1 - t) * 0.02;
    pts.push(new THREE.Vector2(r, t * 1.2));
  }
  const featherGeo = new THREE.LatheGeometry(pts, 10);

  for (let i = 0; i < 16; i++) {
    const feather = new THREE.Mesh(featherGeo, featherMat);
    const angle = (i / 16) * Math.PI * 2;
    feather.rotation.y = angle;
    feather.rotation.x = 0.22;
    // Exploded drift outward
    feather.position.x = Math.sin(angle) * 0.16;
    feather.position.z = Math.cos(angle) * 0.16;
    feather.position.y = 0.1;
    feather.castShadow = true;
    group.add(feather);

    // Quill vane — thin plane on each feather for detail
    const vaneMat = new THREE.MeshStandardMaterial({
      color: 0xefe8d8,
      roughness: 0.92,
      metalness: 0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const vane = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.9), vaneMat);
    vane.rotation.y = angle + Math.PI / 2;
    vane.rotation.x = 0.22;
    vane.position.x = Math.sin(angle) * 0.16;
    vane.position.z = Math.cos(angle) * 0.16;
    vane.position.y = 0.55;
    group.add(vane);
  }

  // Shadow catcher
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.ShadowMaterial({ opacity: 0.25 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.5;
  shadow.receiveShadow = true;
  scene.add(shadow);

  // Float
  let floatY: gsap.core.Tween | null = null;
  let floatR: gsap.core.Tween | null = null;
  if (!reducedMotion) {
    floatY = gsap.to(group.position, { y: '+=0.14', duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    floatR = gsap.to(group.rotation, { y: Math.PI * 2, duration: 24, repeat: -1, ease: 'none' });
  }

  // Scroll parallax
  const st = ScrollTrigger.create({
    trigger: container,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 0.8,
    onUpdate: (self) => {
      if (!reducedMotion) group.rotation.x = self.progress * 0.25;
    },
  });

  return () => {
    floatY?.kill(); floatR?.kill(); st.kill();
    env.dispose();
  };
}

const ThreeCanvas = dynamic(() => import('../ThreeCanvas'), { ssr: false });

export default function ShuttlecockSculpture() {
  return (
    <div className="w-full h-[440px] md:h-[580px]">
      <ThreeCanvas setup={setup} />
    </div>
  );
}
