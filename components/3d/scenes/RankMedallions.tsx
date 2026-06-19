'use client';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SceneContext } from '../ThreeCanvas';

gsap.registerPlugin(ScrollTrigger);

const MEDALS = [
  { x: -2.2, color: 0xc9a961, metalness: 0.85, roughness: 0.18, light: 0xc9a961, label: '1' },
  { x: 0,    color: 0xb8c4cc, metalness: 0.92, roughness: 0.12, light: 0xc0c0c0, label: '2' },
  { x: 2.2,  color: 0x7b5e42, metalness: 0.75, roughness: 0.35, light: 0x9b7e62, label: '3' },
];

function makeShuttleShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.absellipse(0, -0.08, 0.11, 0.11, 0, Math.PI * 2, false, 0);
  return shape;
}

function setup({ scene, camera, renderer, container, reducedMotion }: SceneContext) {
  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);
  renderer.setClearColor(0x000000, 0);

  scene.add(new THREE.AmbientLight(0x222222, 0.6));

  const shuttleShape = makeShuttleShape();
  const embossGeo = new THREE.ExtrudeGeometry(shuttleShape, { depth: 0.025, bevelEnabled: false });

  const groups: THREE.Group[] = [];
  const tweens: gsap.core.Tween[] = [];

  MEDALS.forEach((cfg, i) => {
    const group = new THREE.Group();
    group.position.x = cfg.x;
    group.scale.set(0, 0, 0);
    scene.add(group);
    groups.push(group);

    // Disc face
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.58, 0.58, 0.07, 64),
      new THREE.MeshStandardMaterial({ color: cfg.color, metalness: cfg.metalness, roughness: cfg.roughness })
    );
    disc.rotation.x = Math.PI / 2;
    group.add(disc);

    // Rim
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.58, 0.04, 12, 64),
      new THREE.MeshStandardMaterial({ color: cfg.color, metalness: 1, roughness: 0.1 })
    );
    group.add(rim);

    // Embossed shuttlecock
    const emboss = new THREE.Mesh(
      embossGeo,
      new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.4, roughness: 0.6 })
    );
    emboss.position.set(-0.1, -0.2, 0.04);
    group.add(emboss);

    // Ribbon
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.62, 0),
      new THREE.Vector3(0.06, 0.9, 0),
      new THREE.Vector3(-0.03, 1.4, 0),
    ]);
    const ribbon = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 20, 0.018, 6, false),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.95 })
    );
    group.add(ribbon);

    // Per-medal accent light
    const pl = new THREE.PointLight(cfg.light, 1.2, 5);
    pl.position.set(cfg.x, 0.5, 2.5);
    scene.add(pl);

    // Dramatic side light
    const side = new THREE.SpotLight(0xfff8f0, 2, 12, 0.5, 0.8);
    side.position.set(cfg.x - 1.5, 3, 3);
    side.target.position.set(cfg.x, 0, 0);
    scene.add(side, side.target);

    // Bobbing
    if (!reducedMotion) {
      tweens.push(gsap.to(group.position, {
        y: '+=0.09',
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: i * 1.5,
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
        gsap.to(g.scale, { x: 1, y: 1, z: 1, duration: 1.1, ease: 'back.out(1.7)', delay: i * 0.22 });
      });
    },
  });

  return () => {
    tweens.forEach((t) => t.kill());
    st.kill();
  };
}

const ThreeCanvas = dynamic(() => import('../ThreeCanvas'), { ssr: false });

export default function RankMedallions() {
  return (
    <div className="w-full h-[260px] md:h-[310px]">
      <ThreeCanvas setup={setup} />
    </div>
  );
}
