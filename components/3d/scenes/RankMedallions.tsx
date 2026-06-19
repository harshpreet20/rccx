'use client';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SceneContext } from '../ThreeCanvas';

gsap.registerPlugin(ScrollTrigger);

const MEDALS = [
  { x: -2.4, color: 0xd4a820, emissive: 0x2a1800, metalness: 0.92, roughness: 0.08, light: 0xc9a84c, rimLight: 0xffe08a, label: '01' },
  { x: 0,    color: 0xd8dde0, emissive: 0x080c10, metalness: 0.95, roughness: 0.05, light: 0xb8c8d0, rimLight: 0xe8f0f8, label: '02' },
  { x: 2.4,  color: 0x8b5e3c, emissive: 0x180a00, metalness: 0.82, roughness: 0.22, light: 0xa07050, rimLight: 0xc49060, label: '03' },
];

function buildEnv(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const env = pmrem.fromScene(new RoomEnvironment()).texture;
  pmrem.dispose();
  return env;
}

function makeNumberTexture(num: string, color: number): THREE.CanvasTexture {
  const cvs = document.createElement('canvas');
  cvs.width = 256; cvs.height = 256;
  const ctx = cvs.getContext('2d')!;
  ctx.clearRect(0, 0, 256, 256);
  const c = `#${color.toString(16).padStart(6, '0')}`;
  ctx.fillStyle = c;
  ctx.font = 'bold 100px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = 0.35;
  ctx.fillText(num, 128, 128);
  return new THREE.CanvasTexture(cvs);
}

function setup({ scene, camera, renderer, container, reducedMotion }: SceneContext) {
  camera.position.set(0, 0.5, 10);
  camera.lookAt(0, 0, 0);

  const env = buildEnv(renderer);
  scene.environment = env;

  scene.add(new THREE.AmbientLight(0x080510, 0.8));

  const groups: THREE.Group[] = [];
  const tweens: gsap.core.Tween[] = [];

  // Shuttlecock emboss shape
  const embossShape = new THREE.Shape();
  embossShape.absellipse(0, -0.1, 0.09, 0.09, 0, Math.PI * 2, false, 0);
  // Feather silhouette lines radiating up
  const embossGeo = new THREE.ExtrudeGeometry(embossShape, { depth: 0.018, bevelEnabled: false });

  MEDALS.forEach((cfg, i) => {
    const group = new THREE.Group();
    group.position.x = cfg.x;
    group.scale.set(0, 0, 0);
    scene.add(group);
    groups.push(group);

    // Disc — flat cylinder
    const discMat = new THREE.MeshStandardMaterial({
      color: cfg.color,
      emissive: cfg.emissive,
      emissiveIntensity: 0.18,
      metalness: cfg.metalness,
      roughness: cfg.roughness,
      envMapIntensity: 2.5,
    });
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.08, 80), discMat);
    disc.rotation.x = Math.PI / 2;
    disc.castShadow = true;
    group.add(disc);

    // Bevelled rim — slightly brighter
    const rimMat = new THREE.MeshStandardMaterial({
      color: cfg.color,
      emissive: cfg.emissive,
      emissiveIntensity: 0.3,
      metalness: 1.0,
      roughness: Math.max(0.03, cfg.roughness - 0.05),
      envMapIntensity: 3.5,
    });
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.048, 20, 80), rimMat);
    group.add(rim);

    // Inner circle etching
    const inner = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.015, 12, 64), rimMat);
    group.add(inner);

    // Rank number etched on face
    const numTex = makeNumberTexture(cfg.label, cfg.color);
    const numMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 0.9),
      new THREE.MeshStandardMaterial({ map: numTex, transparent: true, depthWrite: false, metalness: 0.5, roughness: 0.5 })
    );
    numMesh.position.z = 0.05;
    group.add(numMesh);

    // Embossed shuttlecock
    const emboss = new THREE.Mesh(embossGeo, new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      metalness: 0.3,
      roughness: 0.7,
    }));
    emboss.position.set(-0.09, -0.22, 0.045);
    group.add(emboss);

    // Ribbon — black silk
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.68, 0),
      new THREE.Vector3(0.08, 0.98, 0.01),
      new THREE.Vector3(-0.04, 1.5, 0.02),
    ]);
    const ribbon = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 24, 0.022, 10, false),
      new THREE.MeshStandardMaterial({ color: 0x0f0f0f, roughness: 0.92, metalness: 0.0 })
    );
    group.add(ribbon);

    // Ribbon loop top
    const loop = new THREE.Mesh(
      new THREE.TorusGeometry(0.07, 0.016, 10, 24),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85 })
    );
    loop.position.set(-0.02, 1.56, 0.02);
    group.add(loop);

    // Dramatic side key light per medal
    const keyL = new THREE.SpotLight(0xfff5e0, 8, 14, 0.4, 0.7);
    keyL.position.set(cfg.x - 1.2, 4, 3);
    keyL.target.position.set(cfg.x, 0, 0);
    keyL.castShadow = true;
    scene.add(keyL, keyL.target);

    // Coloured bounce per medal
    const bounceL = new THREE.PointLight(cfg.light, 3, 5);
    bounceL.position.set(cfg.x, -1, 1.5);
    scene.add(bounceL);

    // Rim light from behind
    const rimL = new THREE.DirectionalLight(cfg.rimLight, 0.8);
    rimL.position.set(cfg.x + 0.5, 2, -3);
    scene.add(rimL);

    // Bobbing
    if (!reducedMotion) {
      tweens.push(gsap.to(group.position, {
        y: '+=0.1',
        duration: 4 + i * 0.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: i * 1.5,
      }));
      // Gentle tilt oscillation
      tweens.push(gsap.to(group.rotation, {
        x: 0.08,
        duration: 6 + i * 0.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: i * 0.8,
      }));
    }
  });

  // Scroll reveal
  const st = ScrollTrigger.create({
    trigger: container,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      groups.forEach((g, i) => {
        gsap.to(g.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: 'back.out(1.8)', delay: i * 0.25 });
      });
    },
  });

  return () => {
    tweens.forEach((t) => t.kill());
    st.kill();
    env.dispose();
  };
}

const ThreeCanvas = dynamic(() => import('../ThreeCanvas'), { ssr: false });

export default function RankMedallions() {
  return (
    <div className="w-full h-[280px] md:h-[320px]">
      <ThreeCanvas setup={setup} />
    </div>
  );
}
