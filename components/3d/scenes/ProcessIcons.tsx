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
  const env = pmrem.fromScene(new RoomEnvironment()).texture;
  pmrem.dispose();
  return env;
}

function makeCourtTexture(): THREE.CanvasTexture {
  const cvs = document.createElement('canvas');
  cvs.width = 512; cvs.height = 256;
  const ctx = cvs.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#1e4a30');
  grad.addColorStop(1, '#122a1c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 4;
  ctx.strokeRect(12, 12, 488, 232);
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(256, 12); ctx.lineTo(256, 244); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(12, 128); ctx.lineTo(500, 128); ctx.stroke();
  ctx.strokeRect(110, 12, 292, 116);
  ctx.strokeRect(110, 128, 292, 116);
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
  camera.position.set(0, 0, 7.5);
  camera.lookAt(0, 0, 0);

  const env = buildEnv(renderer);
  scene.environment = env;

  scene.add(new THREE.AmbientLight(0x0d1020, 0.9));
  const key = new THREE.DirectionalLight(0xfff5e0, 2.5);
  key.position.set(3, 6, 7);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x3a4a8a, 1.0);
  fill.position.set(-4, 2, 3);
  scene.add(fill);
  const top = new THREE.SpotLight(0xffffff, 5, 25, 0.5, 0.7);
  top.position.set(0, 8, 3);
  scene.add(top);

  const groups: THREE.Group[] = [];
  const tweens: gsap.core.Tween[] = [];
  const xPos = [-2.5, 0, 2.5];

  // ── Icon A: Frosted glass bubble + gold trajectory ──
  const gA = new THREE.Group();
  gA.position.x = xPos[0];
  scene.add(gA); groups.push(gA);

  // Frosted glass bubble
  const bubbleGeo = new THREE.ExtrudeGeometry(makeRoundedRectShape(1.0, 0.78, 0.12), {
    depth: 0.28, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 5,
  });
  bubbleGeo.translate(0, 0, -0.14);
  gA.add(new THREE.Mesh(bubbleGeo, new THREE.MeshPhysicalMaterial({
    color: 0xc8d8e8,
    emissive: 0x0a1828,
    emissiveIntensity: 0.08,
    roughness: 0.0,
    metalness: 0.0,
    transmission: 0.82,
    thickness: 0.6,
    ior: 1.45,
    transparent: true,
    opacity: 0.92,
    envMapIntensity: 1.5,
  })));

  // Tail of bubble
  const tailShape = new THREE.Shape();
  tailShape.moveTo(-0.1, -0.38);
  tailShape.lineTo(0.12, -0.38);
  tailShape.lineTo(0.05, -0.58);
  tailShape.lineTo(-0.1, -0.38);
  gA.add(new THREE.Mesh(
    new THREE.ExtrudeGeometry(tailShape, { depth: 0.14, bevelEnabled: false }),
    new THREE.MeshPhysicalMaterial({ color: 0xc8d8e8, transmission: 0.7, roughness: 0.05, opacity: 0.85, transparent: true })
  ));

  // Gold trajectory arc
  const traj = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.58, -0.28, 0.15),
    new THREE.Vector3(-0.1, 0.08, 0.15),
    new THREE.Vector3(0.4, 0.22, 0.15),
    new THREE.Vector3(0.6, -0.1, 0.15),
  ]);
  gA.add(new THREE.Mesh(
    new THREE.TubeGeometry(traj, 32, 0.022, 10, false),
    new THREE.MeshStandardMaterial({ color: 0xd4a820, emissive: 0x3a2800, emissiveIntensity: 0.3, metalness: 1.0, roughness: 0.08, envMapIntensity: 2 })
  ));

  // Mini shuttlecock at end of trajectory
  const miniCork = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.04, 0.08, 16),
    new THREE.MeshStandardMaterial({ color: 0xd4a820, metalness: 0.85, roughness: 0.2 })
  );
  miniCork.position.set(0.6, -0.1, 0.15);
  miniCork.rotation.z = Math.PI / 2;
  gA.add(miniCork);

  // Gold label accent
  const goldRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.015, 12, 48),
    new THREE.MeshStandardMaterial({ color: 0xd4a820, metalness: 1, roughness: 0.08, envMapIntensity: 2 })
  );
  goldRing.position.z = -0.15;
  gA.add(goldRing);

  // ── Icon B: Isometric court + translucent poll bars ──
  const gB = new THREE.Group();
  gB.position.x = xPos[1];
  scene.add(gB); groups.push(gB);

  const courtMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.04, 0.95),
    new THREE.MeshStandardMaterial({
      map: makeCourtTexture(),
      roughness: 0.75,
      metalness: 0.05,
      envMapIntensity: 0.4,
    })
  );
  courtMesh.rotation.x = -0.25;
  courtMesh.position.y = -0.12;
  gB.add(courtMesh);

  // Court line glow
  const lineGlow = new THREE.PointLight(0xffffff, 0.6, 2.5);
  lineGlow.position.set(0, 0.15, 0);
  gB.add(lineGlow);

  // Poll bars
  const barData = [
    { h: 0.72, x: -0.4, color: 0x9b2335, emissive: 0x3a0810 },
    { h: 0.52, x: -0.12, color: 0xc9a84c, emissive: 0x2a1800 },
    { h: 0.88, x: 0.16, color: 0x9b2335, emissive: 0x3a0810 },
    { h: 0.38, x: 0.44, color: 0xc9a84c, emissive: 0x2a1800 },
  ];
  barData.forEach(({ h, x, color, emissive }) => {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, h, 0.18),
      new THREE.MeshPhysicalMaterial({
        color,
        emissive,
        emissiveIntensity: 0.25,
        transmission: 0.55,
        roughness: 0.08,
        metalness: 0.0,
        transparent: true,
        opacity: 0.88,
        thickness: 0.3,
        envMapIntensity: 1.0,
      })
    );
    bar.position.set(x, h / 2 + 0.06, 0);
    gB.add(bar);

    // Top cap on bar
    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.025, 0.2),
      new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.2, envMapIntensity: 1.5 })
    );
    cap.position.set(x, h + 0.075, 0);
    gB.add(cap);
  });

  // ── Icon C: Neural shuttlecock ──
  const gC = new THREE.Group();
  gC.position.x = xPos[2];
  scene.add(gC); groups.push(gC);

  const nodeMat = new THREE.MeshStandardMaterial({
    color: 0xd4a820,
    emissive: 0x2a1800,
    emissiveIntensity: 0.35,
    metalness: 0.85,
    roughness: 0.15,
    envMapIntensity: 2,
  });
  const lineMat = new THREE.LineBasicMaterial({ color: 0x4a5a7a, transparent: true, opacity: 0.65 });
  const activeLineMat = new THREE.LineBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.5 });

  const nodePos: [number, number][] = [
    [0, -0.52], [0.14, -0.38], [-0.14, -0.38],
    [0, -0.14], [0.22, -0.08], [-0.22, -0.08],
    [0.16, 0.16], [-0.16, 0.16],
    [0, 0.42], [0.18, 0.34], [-0.18, 0.34],
    [0.1, 0.56], [-0.1, 0.56], [0, 0.68],
  ];

  const nodeGeo = new THREE.SphereGeometry(0.045, 20, 20);
  const nodes: THREE.Mesh[] = nodePos.map(([nx, ny]) => {
    const n = new THREE.Mesh(nodeGeo, nodeMat.clone());
    n.position.set(nx, ny, 0);
    n.castShadow = true;
    gC.add(n);
    return n;
  });

  const conns: [number, number, boolean][] = [
    [0,1,false],[0,2,false],[0,3,true],[1,3,false],[2,3,false],
    [3,4,true],[3,5,true],[4,6,false],[5,7,false],
    [6,8,true],[7,8,true],[4,9,false],[5,10,false],
    [8,9,false],[8,10,false],[9,11,false],[10,12,false],
    [11,13,true],[12,13,true],[8,11,false],[8,12,false],
  ];
  conns.forEach(([a, b, active]) => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(nodePos[a][0], nodePos[a][1], 0),
      new THREE.Vector3(nodePos[b][0], nodePos[b][1], 0),
    ]);
    gC.add(new THREE.Line(geo, active ? activeLineMat : lineMat));
  });

  // Node pulse stagger
  if (!reducedMotion) {
    nodes.forEach((n, ni) => {
      tweens.push(gsap.to(n.scale, {
        x: 1.6, y: 1.6, z: 1.6,
        duration: 0.65,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: ni * 0.06,
      }));
      const mat = n.material as THREE.MeshStandardMaterial;
      tweens.push(gsap.to(mat, {
        emissiveIntensity: 0.9,
        duration: 0.65,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: ni * 0.06,
      }));
    });
  }

  // Point lights per icon
  const plA = new THREE.PointLight(0xfff5e0, 2, 6); plA.position.set(xPos[0], 0, 2); scene.add(plA);
  const plB = new THREE.PointLight(0x9b2335, 2, 6); plB.position.set(xPos[1], 1, 2); scene.add(plB);
  const plC = new THREE.PointLight(0xc9a84c, 2, 6); plC.position.set(xPos[2], 0, 2); scene.add(plC);

  // Float
  if (!reducedMotion) {
    groups.forEach((g, i) => {
      tweens.push(gsap.to(g.position, {
        y: '+=0.08',
        duration: 3.5 + i * 0.5,
        yoyo: true, repeat: -1,
        ease: 'sine.inOut',
        delay: i * 0.5,
      }));
    });
  }

  // Staggered scroll reveal
  groups.forEach((g, i) => {
    g.scale.set(0.75, 0.75, 0.75);
    g.position.y -= 0.3;
    ScrollTrigger.create({
      trigger: container,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(g.scale, { x: 1, y: 1, z: 1, duration: 1.0, ease: 'back.out(1.6)', delay: i * 0.2 });
        gsap.to(g.position, { y: g.position.y + 0.3, duration: 1.0, ease: 'power2.out', delay: i * 0.2 });
      },
    });
  });

  return () => {
    tweens.forEach((t) => t.kill());
    ScrollTrigger.getAll().forEach((s) => s.kill());
    env.dispose();
  };
}

const ThreeCanvas = dynamic(() => import('../ThreeCanvas'), { ssr: false });

export default function ProcessIcons() {
  return (
    <div className="w-full h-[300px] md:h-[360px]">
      <ThreeCanvas setup={setup} />
    </div>
  );
}
