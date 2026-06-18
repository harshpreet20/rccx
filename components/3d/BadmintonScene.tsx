'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { useScrollContext } from '@/lib/scrollContext';

/* ─────────────────────────────────────────────────────────────
   Regulation badminton court: 13.4m × 6.1m
   Scale: 1 unit = 0.5m  →  26.8 × 12.2 units
   ───────────────────────────────────────────────────────────── */
const CW = 26.8;
const CH = 12.2;
const SINGLES_HALF = 5.18;
const DOUBLES_HALF = CH / 2;
const SSL = 3.96; // short service line offset
const LSL_D = CW / 2 - 0.76; // doubles long service line
const GOLD = 0xc9a84c;
const GOLD_WARM = 0xe2c97e;
const NAVY = 0x060e1c;
const CRIMSON = 0x9b2335;

/* Camera path — broadcast crane */
const CAM_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 28, 0),
  new THREE.Vector3(0, 20, 10),
  new THREE.Vector3(-2, 14, 18),
  new THREE.Vector3(-3, 8, 14),
  new THREE.Vector3(2, 5, 8),
  new THREE.Vector3(-1, 7, 2),
  new THREE.Vector3(0, 10, -6),
  new THREE.Vector3(3, 12, -14),
  new THREE.Vector3(0, 22, -20),
]);

/* Shuttle deception arc */
const SHUTTLE_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-4, 2.5, -2),
  new THREE.Vector3(-1, 5.5, 1),
  new THREE.Vector3(2, 4.8, 3),
  new THREE.Vector3(4.5, 1.2, 5),
]);

/* Look-at targets per section */
const LOOK_TARGETS = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(2, 3, 4),
  new THREE.Vector3(4, 1.5, 4),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, 2, -2),
  new THREE.Vector3(0, 0, 0),
];

/* ─── Geometry builders ─── */

function buildCourtLines(): THREE.Group {
  const group = new THREE.Group();
  const Y = 0.012;
  const mat = new THREE.MeshStandardMaterial({
    color: GOLD, emissive: GOLD, emissiveIntensity: 3,
    roughness: 0.1, metalness: 0.8,
  });

  const strip = (x: number, z: number, w: number, h: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat.clone());
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, Y, z);
    return m;
  };

  // Doubles boundary
  group.add(strip(0, -DOUBLES_HALF, CW, 0.05));
  group.add(strip(0, DOUBLES_HALF, CW, 0.05));
  group.add(strip(-CW / 2, 0, 0.05, CH));
  group.add(strip(CW / 2, 0, 0.05, CH));
  // Singles side lines
  group.add(strip(0, -SINGLES_HALF, CW, 0.04));
  group.add(strip(0, SINGLES_HALF, CW, 0.04));
  // Net line
  group.add(strip(0, 0, 0.05, CH));
  // Centre line
  group.add(strip(0, 0, CW, 0.04));
  // Short service lines
  group.add(strip(-SSL, 0, 0.04, SINGLES_HALF * 2));
  group.add(strip(SSL, 0, 0.04, SINGLES_HALF * 2));
  // Doubles long service lines
  group.add(strip(-LSL_D, 0, 0.04, CH));
  group.add(strip(LSL_D, 0, 0.04, CH));

  return group;
}

function buildNet(): THREE.Group {
  const group = new THREE.Group();
  group.position.y = 0.775;

  // Net frame wireframe
  const netGeo = new THREE.BoxGeometry(CH, 1.55, 0.04);
  const netMat = new THREE.MeshBasicMaterial({ color: GOLD, wireframe: true, opacity: 0.5, transparent: true });
  group.add(new THREE.Mesh(netGeo, netMat));

  // Posts
  const postMat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.9, roughness: 0.1 });
  const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.55, 8);
  const p1 = new THREE.Mesh(postGeo, postMat);
  p1.position.z = -DOUBLES_HALF;
  const p2 = new THREE.Mesh(postGeo, postMat);
  p2.position.z = DOUBLES_HALF;
  group.add(p1, p2);
  return group;
}

function buildShuttlecock(): THREE.Group {
  const group = new THREE.Group();

  // Cork — gold emissive so it glows even before flood lights
  const cork = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0xf5f0e8, emissive: GOLD, emissiveIntensity: 1.5, roughness: 0.3, metalness: 0.2 })
  );
  group.add(cork);

  // Skirt — soft white emissive
  const skirt = new THREE.Mesh(
    new THREE.ConeGeometry(0.45, 0.8, 16, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
  );
  skirt.position.y = 0.4;
  group.add(skirt);

  // 16 feather fins — warm gold emissive
  const N = 16;
  const verts: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2;
    const rimR = 0.44;
    const rimY = 0.8;
    const bx = Math.cos(angle) * rimR;
    const bz = Math.sin(angle) * rimR;
    const ax = Math.cos(angle) * 0.7;
    const ay = rimY + 0.55;
    const az = Math.sin(angle) * 0.7;
    const sAngle = angle + 0.18;
    const sx = Math.cos(sAngle) * 0.52;
    const sz = Math.sin(sAngle) * 0.52;
    const base = i * 3;
    verts.push(bx, rimY, bz, ax, ay, az, sx, rimY + 0.28, sz);
    indices.push(base, base + 1, base + 2);
  }
  const featherGeo = new THREE.BufferGeometry();
  featherGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  featherGeo.setIndex(indices);
  featherGeo.computeVertexNormals();
  const feathers = new THREE.Mesh(
    featherGeo,
    new THREE.MeshStandardMaterial({ color: 0xf5f0e8, emissive: GOLD_WARM, emissiveIntensity: 0.7, side: THREE.DoubleSide, roughness: 0.5 })
  );
  group.add(feathers);

  return group;
}

function buildPlayerGroup(): THREE.Group {
  const mat = () => new THREE.MeshStandardMaterial({ color: 0x0a1628, roughness: 0.4, metalness: 0.2 });
  const mesh = (geo: THREE.BufferGeometry) => new THREE.Mesh(geo, mat());

  const playerGroup = new THREE.Group();
  playerGroup.position.set(-5, 0.5, -3);
  playerGroup.rotation.y = 0.3;

  // Torso
  const torso = mesh(new THREE.BoxGeometry(0.7, 1.2, 0.35));
  torso.name = 'torso';
  torso.position.set(0, 1.5, 0);
  playerGroup.add(torso);

  // Head
  const head = mesh(new THREE.SphereGeometry(0.26, 8, 6));
  head.name = 'head';
  head.position.set(0.1, 2.55, 0);
  playerGroup.add(head);

  // Racquet arm group — pivot at right shoulder
  const racquetArm = new THREE.Group();
  racquetArm.name = 'racquetArm';
  racquetArm.position.set(0.55, 2.1, 0);

  const upperArm = mesh(new THREE.BoxGeometry(0.22, 0.7, 0.2));
  upperArm.position.set(0, -0.35, 0);
  upperArm.rotation.z = -Math.PI * 0.65;
  racquetArm.add(upperArm);

  const foreArm = mesh(new THREE.BoxGeometry(0.18, 0.65, 0.18));
  foreArm.position.set(0.3, 0.6, 0);
  foreArm.rotation.z = -Math.PI * 0.85;
  racquetArm.add(foreArm);

  const handle = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 6));
  handle.position.set(0.5, 1.2, 0);
  handle.rotation.z = -0.2;
  racquetArm.add(handle);

  const racquetHead = mesh(new THREE.BoxGeometry(0.5, 0.55, 0.04));
  racquetHead.position.set(0.7, 1.65, 0);
  racquetHead.rotation.z = -0.15;
  racquetArm.add(racquetHead);

  playerGroup.add(racquetArm);

  // Off arm (left) — static
  const offArm = new THREE.Group();
  offArm.name = 'offArm';
  offArm.position.set(-0.55, 1.9, 0);
  const offUpper = mesh(new THREE.BoxGeometry(0.22, 0.65, 0.2));
  offUpper.position.set(0, -0.32, 0);
  offUpper.rotation.z = Math.PI * 0.35;
  offArm.add(offUpper);
  const offFore = mesh(new THREE.BoxGeometry(0.18, 0.55, 0.18));
  offFore.position.set(-0.3, -0.55, 0);
  offFore.rotation.z = Math.PI * 0.55;
  offArm.add(offFore);
  playerGroup.add(offArm);

  // Legs
  const legR = mesh(new THREE.BoxGeometry(0.3, 0.85, 0.3));
  legR.position.set(0.22, 0.55, 0.2);
  legR.rotation.x = 0.35;
  playerGroup.add(legR);

  const shinR = mesh(new THREE.BoxGeometry(0.26, 0.7, 0.26));
  shinR.position.set(0.22, -0.1, 0.45);
  shinR.rotation.x = -0.3;
  playerGroup.add(shinR);

  const legL = mesh(new THREE.BoxGeometry(0.3, 0.85, 0.3));
  legL.position.set(-0.22, 0.45, -0.3);
  legL.rotation.x = -0.45;
  playerGroup.add(legL);

  const shinL = mesh(new THREE.BoxGeometry(0.26, 0.75, 0.26));
  shinL.position.set(-0.22, -0.15, -0.55);
  shinL.rotation.x = 0.4;
  playerGroup.add(shinL);

  return playerGroup;
}

function buildDustParticles(origin: THREE.Vector3, count: number): { points: THREE.Points; velocities: Float32Array } {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = Math.random() * 2.5;
    const angle = Math.random() * Math.PI * 2;
    const d = Math.random();
    positions[i * 3] = origin.x + Math.cos(angle) * r * d;
    positions[i * 3 + 1] = origin.y - d * 14;
    positions[i * 3 + 2] = origin.z + Math.sin(angle) * r * d;
    velocities[i] = 0.002 + Math.random() * 0.004;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xfff5e0, size: 0.04, transparent: true, opacity: 0.35,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  return { points: new THREE.Points(geo, mat), velocities };
}

/* ─── Main component ─── */

const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export default function BadmintonScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollProgress } = useScrollContext();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({
      canvas, antialias: !isMobile, alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    /* Scene + camera */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(NAVY);
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(-3, 8, 14);
    camera.lookAt(-2, 2, 0);

    /* Post-processing */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    if (!isMobile) {
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.8, 0.7, 0.45
      );
      composer.addPass(bloom);
    }
    composer.addPass(new OutputPass());

    /* ─── Lights ─── */
    const FLOOD_POSITIONS: [number, number, number][] = [
      [-6, 14, -5], [6, 14, -5], [-6, 14, 5], [6, 14, 5]
    ];
    const floods: THREE.SpotLight[] = FLOOD_POSITIONS.map(([x, y, z]) => {
      const light = new THREE.SpotLight(0xfff5e0, 0, 0, 0.55, 0.3);
      light.position.set(x, y, z);
      light.castShadow = true;
      light.shadow.mapSize.set(512, 512);
      scene.add(light);
      scene.add(light.target);
      return light;
    });

    const goldKey = new THREE.SpotLight(GOLD, 80, 0, 0.4, 0.5);
    goldKey.position.set(8, 12, 8);
    scene.add(goldKey); scene.add(goldKey.target);

    const navyFill = new THREE.DirectionalLight(0x1a3060, 6);
    navyFill.position.set(-10, 6, -5);
    scene.add(navyFill);

    const crimsonRim = new THREE.SpotLight(CRIMSON, 50, 0, 0.55, 0.6);
    crimsonRim.position.set(-6, 3, -12);
    scene.add(crimsonRim); scene.add(crimsonRim.target);

    scene.add(new THREE.AmbientLight(0x0a1628, 0.4));

    /* ─── Court ─── */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(CW, CH),
      new THREE.MeshStandardMaterial({ color: NAVY, roughness: 0.55, metalness: 0.35 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const courtLines = buildCourtLines();
    scene.add(courtLines);
    scene.add(buildNet());

    /* ─── Volumetric beams ─── */
    const dustSystems: { points: THREE.Points; velocities: Float32Array; origin: THREE.Vector3 }[] = [];
    if (!isMobile) {
      FLOOD_POSITIONS.forEach(([x, y, z]) => {
        const origin = new THREE.Vector3(x, y, z);
        // Beam cone
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(3.5, 14, 16, 1, true),
          new THREE.MeshBasicMaterial({
            color: 0xfff5e0, transparent: true, opacity: 0.025,
            side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
          })
        );
        cone.position.set(x, y - 7, z);
        cone.rotation.x = Math.PI;
        scene.add(cone);
        // Dust
        const { points, velocities } = buildDustParticles(origin, 100);
        scene.add(points);
        dustSystems.push({ points, velocities, origin });
      });
    }

    /* ─── Shuttlecock ─── */
    const shuttleGroup = buildShuttlecock();
    shuttleGroup.position.copy(SHUTTLE_CURVE.getPoint(0));
    shuttleGroup.scale.set(2.8, 2.8, 2.8); // scale up for screen visibility
    scene.add(shuttleGroup);

    /* Dedicated shuttle highlight — moves with shuttle */
    const shuttleLight = new THREE.PointLight(GOLD_WARM, 40, 12);
    shuttleLight.position.copy(shuttleGroup.position);
    scene.add(shuttleLight);

    /* Trail — pre-populate with arc points so it's visible immediately */
    const TRAIL_LEN = 24;
    const trailPositions = new Float32Array(TRAIL_LEN * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({
      color: GOLD_WARM, transparent: true, opacity: 0.6, linewidth: 2,
    }));
    scene.add(trail);
    // Pre-fill trail with arc points behind the shuttle so deception arc is visible on load
    const trailBuffer: THREE.Vector3[] = Array.from({ length: TRAIL_LEN }, (_, i) => {
      const t = Math.max(0, (i / TRAIL_LEN) * 0.25);
      return SHUTTLE_CURVE.getPoint(t);
    });

    /* ─── Player ─── */
    const playerGroup = buildPlayerGroup();
    scene.add(playerGroup);
    const racquetArm = playerGroup.getObjectByName('racquetArm') as THREE.Group;
    const torsoMesh = playerGroup.getObjectByName('torso') as THREE.Mesh;

    /* ─── Camera state ─── */
    let smoothT = 0;
    const currentLookAt = new THREE.Vector3(-2, 2, 0);
    let introComplete = false;
    let deceptionTriggered = false;
    let chromAbStrength = 0;
    let shakeFrames = 0;

    /* ─── Stadium intro sequence ─── */
    const flickerOn = (light: THREE.SpotLight, targetIntensity: number, delay: number) => {
      const proxy = { intensity: 0 };
      const tl = gsap.timeline({ delay });
      tl.to(proxy, { intensity: targetIntensity * 0.3, duration: 0.05, onUpdate: () => { light.intensity = proxy.intensity; } })
        .to(proxy, { intensity: 0, duration: 0.04, onUpdate: () => { light.intensity = proxy.intensity; } })
        .to(proxy, { intensity: targetIntensity * 0.7, duration: 0.06, onUpdate: () => { light.intensity = proxy.intensity; } })
        .to(proxy, { intensity: 0, duration: 0.03, onUpdate: () => { light.intensity = proxy.intensity; } })
        .to(proxy, { intensity: targetIntensity * 0.5, duration: 0.04, onUpdate: () => { light.intensity = proxy.intensity; } })
        .to(proxy, { intensity: 0, duration: 0.05, onUpdate: () => { light.intensity = proxy.intensity; } })
        .to(proxy, { intensity: targetIntensity, duration: 0.18, ease: 'power2.out', onUpdate: () => { light.intensity = proxy.intensity; } });
      return tl;
    };

    const introTL = gsap.timeline({ delay: 0.6, onComplete: () => { introComplete = true; } });
    introTL.add(flickerOn(floods[0], 180, 0));
    introTL.add(flickerOn(floods[1], 180, 0), '+=0.3');
    introTL.add(flickerOn(floods[2], 180, 0), '+=0.2');
    introTL.add(flickerOn(floods[3], 180, 0), '-=0.3');

    /* ─── Auto-repeating deception shot animation ─── */
    const arcT = { value: 0 };
    let autoDeceptionActive = false;

    const runDeceptionLoop = () => {
      autoDeceptionActive = true;
      arcT.value = 0;
      shuttleGroup.position.copy(SHUTTLE_CURVE.getPoint(0));

      // Smash animation — sync with shuttle arc
      if (!isMobile && racquetArm) {
        gsap.killTweensOf(racquetArm.rotation);
        gsap.killTweensOf(torsoMesh.rotation);
        const smashTL = gsap.timeline();
        smashTL.to(racquetArm.rotation, { z: 1.2, duration: 0.25, ease: 'power2.out' });
        smashTL.to(torsoMesh.rotation,  { z: 0.12, duration: 0.25, ease: 'power2.out' }, '<');
        smashTL.to(racquetArm.rotation, { z: -0.9, duration: 0.3, ease: 'power4.out' });
        smashTL.to(torsoMesh.rotation,  { z: -0.12, duration: 0.3, ease: 'power4.out' }, '<');
        smashTL.to(racquetArm.rotation, { z: 0, duration: 0.8, ease: 'power1.inOut' });
        smashTL.to(torsoMesh.rotation,  { z: 0, duration: 0.8, ease: 'power1.inOut' }, '<');
      }

      // Pulse court lines gold on smash
      courtLines.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        gsap.to(mat, { emissiveIntensity: 9, duration: 0.12, yoyo: true, repeat: 3 });
      });
      // Boost shuttle light intensity on smash
      gsap.fromTo(shuttleLight, { intensity: 40 }, { intensity: 120, duration: 0.3, yoyo: true, repeat: 1 });

      gsap.to(arcT, {
        value: 1,
        duration: 1.1,
        ease: 'power2.in',
        onUpdate: () => {
          // Only drive auto-arc when scroll hasn't moved past 10%
          if (scrollProgress.current < 0.1) {
            const pos = SHUTTLE_CURVE.getPoint(Math.min(arcT.value, 1));
            shuttleGroup.position.set(pos.x, pos.y, pos.z);
          }
        },
        onComplete: () => {
          autoDeceptionActive = false;
          // Return shuttle to start with a smooth reset, then repeat after pause
          gsap.to(shuttleGroup.position, {
            x: SHUTTLE_CURVE.getPoint(0).x,
            y: SHUTTLE_CURVE.getPoint(0).y,
            z: SHUTTLE_CURVE.getPoint(0).z,
            duration: 0.6,
            ease: 'power1.inOut',
            onComplete: () => {
              setTimeout(runDeceptionLoop, 2200);
            },
          });
        },
      });
    };

    // Start first deception shot 2.5s after load (after intro lights flicker on)
    const deceptionTimer = setTimeout(runDeceptionLoop, 2500);

    /* ─── Animation loop ─── */
    let frameId: number;
    let t2 = 0;

    const prevShuttlePos = new THREE.Vector3().copy(shuttleGroup.position);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t2 += 0.008;

      if (introComplete) {
        const targetT = scrollProgress.current;
        smoothT += (targetT - smoothT) * 0.055;
        const t = Math.max(0, Math.min(1, smoothT));

        // Camera crane path
        const camPos = CAM_CURVE.getPoint(t);
        camera.position.lerp(camPos, 0.05);

        // Shuttle arc — only drive via scroll when user has scrolled past 10%
        if (!autoDeceptionActive && t > 0.1) {
          const st = Math.min((t - 0.1) / 0.4, 1);
          const shuttlePos = SHUTTLE_CURVE.getPoint(st);
          shuttleGroup.position.lerp(shuttlePos, 0.08);
        }

        // Deception trigger at 30%
        if (!deceptionTriggered && t > 0.28) {
          deceptionTriggered = true;
          chromAbStrength = 0.006;
          shakeFrames = 12;
          // Pulse court lines
          courtLines.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            gsap.to(mat, { emissiveIntensity: 9, duration: 0.1, yoyo: true, repeat: 3 });
          });
        }

        // Look-at
        const lookIdx = t * (LOOK_TARGETS.length - 1);
        const lf = Math.floor(lookIdx);
        const lfrac = lookIdx - lf;
        const from = LOOK_TARGETS[Math.min(lf, LOOK_TARGETS.length - 1)];
        const to = LOOK_TARGETS[Math.min(lf + 1, LOOK_TARGETS.length - 1)];
        currentLookAt.lerp(from.clone().lerp(to, lfrac), 0.05);
      }

      // Shuttle idle spin + trail
      shuttleGroup.rotation.y += 0.08;
      // Continuous hover bob — visible even before scroll
      shuttleGroup.position.y += Math.sin(t2 * 1.8) * 0.005;

      // Shuttle light follows shuttle
      shuttleLight.position.copy(shuttleGroup.position);
      shuttleLight.position.y += 1;

      const moved = shuttleGroup.position.distanceTo(prevShuttlePos) > 0.001;
      if (moved) {
        trailBuffer.unshift(shuttleGroup.position.clone());
        trailBuffer.length = TRAIL_LEN;
        prevShuttlePos.copy(shuttleGroup.position);
      }
      for (let i = 0; i < TRAIL_LEN; i++) {
        const p = trailBuffer[i] ?? shuttleGroup.position;
        trailPositions[i * 3] = p.x;
        trailPositions[i * 3 + 1] = p.y;
        trailPositions[i * 3 + 2] = p.z;
      }
      trailGeo.attributes.position.needsUpdate = true;

      // Camera screen shake
      if (shakeFrames > 0) {
        shakeFrames--;
        const s = (shakeFrames / 12) * 0.08;
        camera.position.x += (Math.random() - 0.5) * s;
        camera.position.y += (Math.random() - 0.5) * s * 0.5;
      }

      // Court line pulse
      courtLines.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (!deceptionTriggered) {
          mat.emissiveIntensity = 2.5 + Math.sin(t2 * 0.7) * 1.5;
        }
      });

      // Dust particles
      dustSystems.forEach(({ points, velocities, origin }) => {
        const arr = points.geometry.attributes.position.array as Float32Array;
        const count = arr.length / 3;
        for (let i = 0; i < count; i++) {
          arr[i * 3 + 1] += velocities[i];
          if (arr[i * 3 + 1] > origin.y) {
            const r = Math.random() * 2.5;
            const angle = Math.random() * Math.PI * 2;
            arr[i * 3] = origin.x + Math.cos(angle) * r;
            arr[i * 3 + 1] = origin.y - 14;
            arr[i * 3 + 2] = origin.z + Math.sin(angle) * r;
          }
        }
        points.geometry.attributes.position.needsUpdate = true;
      });

      camera.lookAt(currentLookAt);
      composer.render();
    };
    animate();

    /* Resize */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      introTL.kill();
      gsap.killTweensOf(arcT);
      gsap.killTweensOf(shuttleGroup.position);
      clearTimeout(deceptionTimer);
      if (racquetArm) gsap.killTweensOf(racquetArm.rotation);
      if (torsoMesh) gsap.killTweensOf(torsoMesh.rotation);
      renderer.dispose();
    };
  }, [scrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  );
}
