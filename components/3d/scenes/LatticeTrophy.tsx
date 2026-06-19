'use client';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import type { SceneContext } from '../ThreeCanvas';

function buildEnv(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const env = pmrem.fromScene(new RoomEnvironment()).texture;
  pmrem.dispose();
  return env;
}

function makeMarbleTexture(): THREE.CanvasTexture {
  const cvs = document.createElement('canvas');
  cvs.width = 512; cvs.height = 512;
  const ctx = cvs.getContext('2d')!;
  // Dark marble base
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#0c0c0c');
  grad.addColorStop(0.4, '#141414');
  grad.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  // Marble veins
  for (let i = 0; i < 20; i++) {
    const alpha = 0.06 + Math.random() * 0.12;
    ctx.strokeStyle = `rgba(${120 + Math.random() * 80},${100 + Math.random() * 60},${60 + Math.random() * 40},${alpha})`;
    ctx.lineWidth = 0.5 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, Math.random() * 512);
    ctx.bezierCurveTo(
      Math.random() * 512, Math.random() * 512,
      Math.random() * 512, Math.random() * 512,
      Math.random() * 512, Math.random() * 512
    );
    ctx.stroke();
  }
  // Gold dust flecks
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(201,168,76,${0.05 + Math.random() * 0.1})`;
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(cvs);
}

function setup({ scene, camera, renderer, container, reducedMotion }: SceneContext) {
  camera.position.set(0, 3, 8);
  camera.lookAt(0, 2, 0);

  const env = buildEnv(renderer);
  scene.environment = env;

  // 3-point lighting rig — dramatic top-down key
  const key = new THREE.SpotLight(0xfff5e0, 12, 30, 0.32, 0.55);
  key.position.set(1, 10, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.001;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x3a4a6a, 1.5);
  fill.position.set(-4, 3, 3);
  scene.add(fill);

  const rim = new THREE.SpotLight(0xc9a84c, 3, 20, 0.6, 0.8);
  rim.position.set(-3, 4, -4);
  scene.add(rim);

  const base_pl = new THREE.PointLight(0x722f37, 2.5, 8);
  base_pl.position.set(0, 0.5, 2);
  scene.add(base_pl);

  scene.add(new THREE.AmbientLight(0x050308, 1.0));

  // ── Marble base ──
  const marbleTex = makeMarbleTexture();
  const baseMesh = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.22, 2.4),
    new THREE.MeshStandardMaterial({
      map: marbleTex,
      roughness: 0.06,
      metalness: 0.12,
      envMapIntensity: 1.2,
    })
  );
  baseMesh.receiveShadow = true;
  scene.add(baseMesh);

  // Base bevelled edge strips
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0xc9a84c, metalness: 1.0, roughness: 0.12, envMapIntensity: 2 });
  [[-1.2, 0], [1.2, 0], [0, -1.2], [0, 1.2]].forEach(([ex, ez], i) => {
    const edge = new THREE.Mesh(
      i < 2 ? new THREE.BoxGeometry(0.04, 0.24, 2.4) : new THREE.BoxGeometry(2.4, 0.24, 0.04),
      edgeMat
    );
    edge.position.set(ex, 0, ez);
    scene.add(edge);
  });

  // ── Trophy group ──
  const trophy = new THREE.Group();
  trophy.position.y = 0.11;
  scene.add(trophy);

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x5a5a5a,
    emissive: 0x080808,
    emissiveIntensity: 0.05,
    roughness: 0.18,
    metalness: 0.88,
    envMapIntensity: 1.6,
  });
  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    emissive: 0x000000,
    roughness: 0.75,
    metalness: 0.3,
    envMapIntensity: 0.6,
  });
  const gripMat = new THREE.MeshStandardMaterial({
    color: 0x282828,
    roughness: 0.92,
    metalness: 0.05,
  });
  const stringMat = new THREE.MeshStandardMaterial({
    color: 0x888888,
    emissive: 0x111111,
    roughness: 0.4,
    metalness: 0.2,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });

  for (let i = 0; i < 6; i++) {
    const racket = new THREE.Group();
    const angle = (i / 6) * Math.PI * 2;

    // Oval head
    const head = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.055, 18, 36), frameMat);
    head.scale.set(1, 1.38, 0.55);
    head.castShadow = true;
    racket.add(head);

    // String bed
    racket.add(new THREE.Mesh(new THREE.PlaneGeometry(0.82, 1.18, 6, 8), stringMat));

    // T-junction
    const junction = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 16), frameMat);
    junction.position.y = -0.72;
    racket.add(junction);

    // Shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.058, 0.8, 16), handleMat);
    shaft.position.y = -1.18;
    racket.add(shaft);

    // Handle
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.068, 0.6, 16), gripMat);
    handle.position.y = -1.7;
    racket.add(handle);

    // Grip cap
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.068, 0.06, 16), edgeMat);
    cap.position.y = -2.03;
    racket.add(cap);

    racket.rotation.y = angle;
    racket.rotation.z = 0.26;
    racket.position.set(Math.sin(angle) * 0.32, 1.8, Math.cos(angle) * 0.32);
    trophy.add(racket);
  }

  // Central column
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 3.2, 24), frameMat);
  column.position.set(0, 1.6, 0);
  trophy.add(column);

  // Top orb
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xc9a84c, metalness: 1, roughness: 0.05, envMapIntensity: 3 }));
  orb.position.y = 3.28;
  trophy.add(orb);

  // Shadow catcher
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.ShadowMaterial({ opacity: 0.35 }));
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -0.12;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  // Auto-rotate
  let rotateTween: gsap.core.Tween | null = null;
  if (!reducedMotion) {
    rotateTween = gsap.to(trophy.rotation, { y: Math.PI * 2, duration: 40, repeat: -1, ease: 'none' });
  } else {
    trophy.rotation.y = Math.PI / 6;
  }

  const targetTilt = { x: 0 };
  const onMove = (e: MouseEvent) => {
    if (reducedMotion) return;
    const rect = container.getBoundingClientRect();
    targetTilt.x = ((e.clientY - rect.top) / rect.height * 2 - 1) * 0.12;
  };
  container.addEventListener('mousemove', onMove);
  const onEnter = () => { if (!reducedMotion) gsap.to(trophy.scale, { x: 1.04, y: 1.04, z: 1.04, duration: 0.7, ease: 'power2.out' }); };
  const onLeave = () => { if (!reducedMotion) gsap.to(trophy.scale, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'power2.out' }); };
  container.addEventListener('mouseenter', onEnter);
  container.addEventListener('mouseleave', onLeave);

  const tick = () => { trophy.rotation.x += (targetTilt.x - trophy.rotation.x) * 0.04; };
  gsap.ticker.add(tick);

  return () => {
    rotateTween?.kill();
    gsap.ticker.remove(tick);
    container.removeEventListener('mousemove', onMove);
    container.removeEventListener('mouseenter', onEnter);
    container.removeEventListener('mouseleave', onLeave);
    env.dispose();
  };
}

const ThreeCanvas = dynamic(() => import('../ThreeCanvas'), { ssr: false });

export default function LatticeTrophy() {
  return (
    <div className="w-full h-[440px] md:h-[540px]">
      <ThreeCanvas setup={setup} />
    </div>
  );
}
