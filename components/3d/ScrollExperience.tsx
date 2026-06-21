'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from './hooks/useReducedMotion';

export default function ScrollExperience() {
  const mountRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!mountRef.current) return;

    let animFrameId: number;
    let resizeObserver: ResizeObserver;
    let cleanupGsap: (() => void) | null = null;

    async function init() {
      const THREE = await import('three');
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      if (typeof window !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }

      const container = mountRef.current!;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.6;
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);

      // Scene & Camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 8);

      // Resize observer
      resizeObserver = new ResizeObserver(() => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      });
      resizeObserver.observe(container);

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambient);

      const spot = new THREE.SpotLight(0xffd700, 3, 20, Math.PI / 5, 0.4, 1.2);
      spot.position.set(4, 6, 4);
      spot.target.position.set(0, 0, 0);
      spot.castShadow = true;
      scene.add(spot);
      scene.add(spot.target);

      const fill = new THREE.DirectionalLight(0x4466aa, 0.8);
      fill.position.set(-4, 2, -2);
      scene.add(fill);

      // ──────────────────────────────────────────
      // ACT 1: Shuttlecock
      // ──────────────────────────────────────────
      const act1 = new THREE.Group();
      scene.add(act1);
      act1.scale.set(0, 0, 0);

      // Cork body
      const corkGeo = new THREE.CylinderGeometry(0.24, 0.20, 0.36, 48);
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xb8860b, metalness: 0.88, roughness: 0.25 });
      const cork = new THREE.Mesh(corkGeo, brassMat);
      cork.position.set(0, 0, 0);
      act1.add(cork);

      // Cap
      const capGeo = new THREE.SphereGeometry(0.24, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const cap = new THREE.Mesh(capGeo, brassMat);
      cap.position.set(0, 0.18, 0);
      act1.add(cap);

      // Ferrule ring
      const ferruleGeo = new THREE.TorusGeometry(0.255, 0.03, 16, 48);
      const ferruleMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.95, roughness: 0.15 });
      const ferrule = new THREE.Mesh(ferruleGeo, ferruleMat);
      ferrule.rotation.x = Math.PI / 2;
      ferrule.position.set(0, -0.18, 0);
      act1.add(ferrule);

      // Feathers (16)
      const featherMat = new THREE.MeshStandardMaterial({ color: 0xf8f4e8, side: THREE.DoubleSide, roughness: 0.8 });
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const lathePoints = [];
        for (let j = 0; j < 12; j++) {
          const t = j / 11;
          lathePoints.push(new THREE.Vector2(t * 0.08, t * 0.9));
        }
        const featherGeo = new THREE.LatheGeometry(lathePoints, 6);
        const feather = new THREE.Mesh(featherGeo, featherMat);
        feather.position.set(Math.cos(angle) * 0.22, -0.2, Math.sin(angle) * 0.22);
        feather.rotation.set(-0.35, angle, 0);
        act1.add(feather);
      }

      // ──────────────────────────────────────────
      // ACT 2: Trophy (rackets in circle + column)
      // ──────────────────────────────────────────
      const act2 = new THREE.Group();
      scene.add(act2);
      act2.scale.set(0, 0, 0);

      // 6 rackets arranged in circle
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const racketGroup = new THREE.Group();
        // Head oval
        const headGeo = new THREE.TorusGeometry(0.3, 0.04, 8, 32);
        const racketMat = new THREE.MeshStandardMaterial({ color: 0xc9a84c, metalness: 0.6, roughness: 0.4 });
        const head = new THREE.Mesh(headGeo, racketMat);
        head.scale.set(1, 1.4, 1);
        racketGroup.add(head);
        // Shaft
        const shaftGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8);
        const shaft = new THREE.Mesh(shaftGeo, racketMat);
        shaft.position.set(0, -0.65, 0);
        racketGroup.add(shaft);
        // Handle
        const handleMat = new THREE.MeshStandardMaterial({ color: 0x2a1f0e, roughness: 0.9 });
        const handleGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.4, 8);
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.set(0, -1.1, 0);
        racketGroup.add(handle);

        racketGroup.position.set(Math.cos(angle) * 1.6, 0, Math.sin(angle) * 1.6);
        racketGroup.rotation.y = -angle;
        racketGroup.rotation.z = 0.3;
        act2.add(racketGroup);
      }

      // Central column
      const colGeo = new THREE.CylinderGeometry(0.12, 0.18, 2.4, 16);
      const colMat = new THREE.MeshStandardMaterial({ color: 0x8a7a5a, metalness: 0.5, roughness: 0.5 });
      act2.add(new THREE.Mesh(colGeo, colMat));

      // Top gold orb
      const orbGeo = new THREE.SphereGeometry(0.28, 32, 16);
      const orbMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(0, 1.45, 0);
      act2.add(orb);

      // Marble base
      const baseGeo = new THREE.CylinderGeometry(0.9, 1.0, 0.3, 32);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0xd4cfc4, roughness: 0.6, metalness: 0.1 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.set(0, -1.35, 0);
      act2.add(base);

      // ──────────────────────────────────────────
      // ACT 3: Medallions
      // ──────────────────────────────────────────
      const act3 = new THREE.Group();
      scene.add(act3);
      act3.scale.set(0, 0, 0);

      const medalColors = [0xffd700, 0xb8c0cc, 0xcd7f32];
      const medalOffsets = [-1.8, 0, 1.8];
      const medalYOffsets = [0.3, 0, -0.2];

      for (let i = 0; i < 3; i++) {
        const medalGroup = new THREE.Group();
        const discGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.12, 48);
        const discMat = new THREE.MeshStandardMaterial({ color: medalColors[i], metalness: 0.9, roughness: 0.15 });
        const disc = new THREE.Mesh(discGeo, discMat);
        disc.rotation.x = Math.PI / 2;
        medalGroup.add(disc);

        // Rank number texture
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 128;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'transparent';
        ctx.clearRect(0, 0, 128, 128);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(i + 1), 64, 64);
        const tex = new THREE.CanvasTexture(canvas);
        const numGeo = new THREE.PlaneGeometry(0.6, 0.6);
        const numMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
        const numPlane = new THREE.Mesh(numGeo, numMat);
        numPlane.position.set(0, 0, 0.07);
        numPlane.rotation.x = -Math.PI / 2;
        medalGroup.add(numPlane);

        medalGroup.position.set(medalOffsets[i], medalYOffsets[i], 0);
        act3.add(medalGroup);
      }

      // ──────────────────────────────────────────
      // ACT 4: Process Icons
      // ──────────────────────────────────────────
      const act4 = new THREE.Group();
      scene.add(act4);
      act4.scale.set(0, 0, 0);

      const iconPositions = [-2.5, 0, 2.5];

      // Icon A: Frosted glass bubble + gold arc
      const iconA = new THREE.Group();
      const bubbleGeo = new THREE.SphereGeometry(0.6, 32, 16);
      const bubbleMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: 0, roughness: 0,
        transmission: 0.85, thickness: 0.5, opacity: 0.4, transparent: true,
      });
      iconA.add(new THREE.Mesh(bubbleGeo, bubbleMat));

      // Arc trajectory
      const arcCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.5, -0.3, 0),
        new THREE.Vector3(0, 0.5, 0.2),
        new THREE.Vector3(0.5, -0.3, 0),
      ]);
      const arcGeo = new THREE.TubeGeometry(arcCurve, 20, 0.02, 8, false);
      const arcMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
      iconA.add(new THREE.Mesh(arcGeo, arcMat));
      iconA.position.set(iconPositions[0], 0, 0);
      act4.add(iconA);

      // Icon B: Mini court box + bar chart
      const iconB = new THREE.Group();
      const courtGeo = new THREE.BoxGeometry(1.0, 0.08, 0.7);
      const courtCanvas = document.createElement('canvas');
      courtCanvas.width = 256; courtCanvas.height = 128;
      const courtCtx = courtCanvas.getContext('2d')!;
      courtCtx.fillStyle = '#1a3a2a';
      courtCtx.fillRect(0, 0, 256, 128);
      courtCtx.strokeStyle = '#ffffff';
      courtCtx.lineWidth = 2;
      courtCtx.strokeRect(8, 8, 240, 112);
      courtCtx.beginPath(); courtCtx.moveTo(128, 8); courtCtx.lineTo(128, 120); courtCtx.stroke();
      const courtTex = new THREE.CanvasTexture(courtCanvas);
      const courtMat = new THREE.MeshStandardMaterial({ map: courtTex });
      iconB.add(new THREE.Mesh(courtGeo, courtMat));

      // Bar chart
      const barHeights = [0.3, 0.5, 0.4, 0.6, 0.45];
      for (let b = 0; b < 5; b++) {
        const barGeo = new THREE.BoxGeometry(0.08, barHeights[b], 0.08);
        const barMat = new THREE.MeshStandardMaterial({
          color: 0xffd700, transparent: true, opacity: 0.6,
        });
        const bar = new THREE.Mesh(barGeo, barMat);
        bar.position.set(-0.24 + b * 0.12, barHeights[b] / 2 + 0.04, 0);
        iconB.add(bar);
      }
      iconB.position.set(iconPositions[1], 0, 0);
      act4.add(iconB);

      // Icon C: Neural graph (nodes + connections)
      const iconC = new THREE.Group();
      const nodePositions: [number, number][] = [
        [0, 0.5], [-0.5, 0], [0.5, 0], [-0.3, -0.5], [0.3, -0.5],
      ];
      const nodeMeshes: THREE.Mesh[] = [];
      const nodeMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.7, roughness: 0.2 });
      for (const pos of nodePositions) {
        const nodeGeo = new THREE.SphereGeometry(0.08, 16, 8);
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(pos[0], pos[1], 0);
        iconC.add(node);
        nodeMeshes.push(node);
      }

      // Connections
      const connections = [[0,1],[0,2],[1,3],[2,4],[1,2],[3,4]];
      for (const [a, b] of connections) {
        const aPos = nodePositions[a];
        const bPos = nodePositions[b];
        const lineCurve = new THREE.LineCurve3(
          new THREE.Vector3(aPos[0], aPos[1], 0),
          new THREE.Vector3(bPos[0], bPos[1], 0)
        );
        const lineGeo = new THREE.TubeGeometry(lineCurve, 1, 0.015, 4, false);
        const lineMat = new THREE.MeshStandardMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.5 });
        iconC.add(new THREE.Mesh(lineGeo, lineMat));
      }
      iconC.position.set(iconPositions[2], 0, 0);
      act4.add(iconC);

      // ──────────────────────────────────────────
      // ACT 5: Ambient particles
      // ──────────────────────────────────────────
      const act5 = new THREE.Group();
      scene.add(act5);
      act5.scale.set(0, 0, 0);

      const particleCount = 800;
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 8;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
        velocities[i * 3] = (Math.random() - 0.5) * 0.002;
        velocities[i * 3 + 1] = Math.random() * 0.004 + 0.001;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({ color: 0xffd700, size: 0.04, transparent: true, opacity: 0.75 });
      const particles = new THREE.Points(particleGeo, particleMat);
      act5.add(particles);

      // ──────────────────────────────────────────
      // ACT 6: Court fragment
      // ──────────────────────────────────────────
      const act6 = new THREE.Group();
      scene.add(act6);
      act6.scale.set(0, 0, 0);

      // Court plane
      const courtFCanvas = document.createElement('canvas');
      courtFCanvas.width = 512; courtFCanvas.height = 256;
      const cfCtx = courtFCanvas.getContext('2d')!;
      cfCtx.fillStyle = '#0a2a1a';
      cfCtx.fillRect(0, 0, 512, 256);
      cfCtx.strokeStyle = '#ffffff';
      cfCtx.lineWidth = 3;
      cfCtx.strokeRect(16, 16, 480, 224);
      cfCtx.beginPath(); cfCtx.moveTo(256, 16); cfCtx.lineTo(256, 240); cfCtx.stroke();
      cfCtx.beginPath(); cfCtx.moveTo(16, 128); cfCtx.lineTo(496, 128); cfCtx.stroke();
      const courtFTex = new THREE.CanvasTexture(courtFCanvas);
      const courtFGeo = new THREE.PlaneGeometry(4, 2);
      const courtFMat = new THREE.MeshStandardMaterial({ map: courtFTex, roughness: 0.7 });
      const courtPlane = new THREE.Mesh(courtFGeo, courtFMat);
      courtPlane.rotation.set(-0.6, 0.2, 0.1);
      act6.add(courtPlane);

      // Net (thin cylinders)
      const netMat = new THREE.MeshStandardMaterial({ color: 0xffffff, opacity: 0.7, transparent: true });
      const netGeo = new THREE.CylinderGeometry(0.015, 0.015, 4.2, 8);
      const net = new THREE.Mesh(netGeo, netMat);
      net.rotation.z = Math.PI / 2;
      net.position.set(0, 0.05, 0.05);
      act6.add(net);

      // ──────────────────────────────────────────
      // GSAP Master Timeline
      // ──────────────────────────────────────────
      const currentActRef = { value: 0 };

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });

      const totalDur = 100;

      // Act 1: 0.14–0.28
      master.to(act1.scale, { x: 1, y: 1, z: 1, duration: totalDur * 0.05 }, totalDur * 0.14);
      master.to({}, { duration: totalDur * 0.08, onUpdate() { currentActRef.value = 1; } }, totalDur * 0.14);
      master.to(act1.scale, { x: 0, y: 0, z: 0, duration: totalDur * 0.04 }, totalDur * 0.24);

      // Act 2: 0.28–0.42
      master.to(act2.scale, { x: 1, y: 1, z: 1, duration: totalDur * 0.05 }, totalDur * 0.28);
      master.to({}, { duration: totalDur * 0.08, onUpdate() { currentActRef.value = 2; } }, totalDur * 0.28);
      master.to(act2.scale, { x: 0, y: 0, z: 0, duration: totalDur * 0.04 }, totalDur * 0.38);

      // Act 3: 0.42–0.56
      master.to(act3.scale, { x: 1, y: 1, z: 1, duration: totalDur * 0.05 }, totalDur * 0.42);
      master.to({}, { duration: totalDur * 0.08, onUpdate() { currentActRef.value = 3; } }, totalDur * 0.42);
      master.to(act3.scale, { x: 0, y: 0, z: 0, duration: totalDur * 0.04 }, totalDur * 0.52);

      // Act 4: 0.56–0.70
      master.to(act4.scale, { x: 1, y: 1, z: 1, duration: totalDur * 0.05 }, totalDur * 0.56);
      master.to({}, { duration: totalDur * 0.08, onUpdate() { currentActRef.value = 4; } }, totalDur * 0.56);
      master.to(act4.scale, { x: 0, y: 0, z: 0, duration: totalDur * 0.04 }, totalDur * 0.66);

      // Act 5: 0.70–0.84
      master.to(act5.scale, { x: 1, y: 1, z: 1, duration: totalDur * 0.05 }, totalDur * 0.70);
      master.to({}, { duration: totalDur * 0.08, onUpdate() { currentActRef.value = 5; } }, totalDur * 0.70);
      master.to(act5.scale, { x: 0, y: 0, z: 0, duration: totalDur * 0.04 }, totalDur * 0.80);

      // Act 6: 0.84–0.98
      master.to(act6.scale, { x: 1, y: 1, z: 1, duration: totalDur * 0.05 }, totalDur * 0.84);
      master.to({}, { duration: totalDur * 0.08, onUpdate() { currentActRef.value = 6; } }, totalDur * 0.84);
      master.to(act6.scale, { x: 0, y: 0, z: 0, duration: totalDur * 0.04 }, totalDur * 0.94);

      // ──────────────────────────────────────────
      // RAF animation loop
      // ──────────────────────────────────────────
      let t = 0;
      renderer.setAnimationLoop(() => {
        t += 0.016;
        const act = currentActRef.value;

        // Act 1 idle: float shuttlecock
        if (act === 1 && !reducedMotion) {
          act1.position.y = Math.sin(t * 0.8) * 0.15;
          act1.rotation.y += 0.005;
        }

        // Act 2 idle: auto-rotate trophy
        if (act === 2 && !reducedMotion) {
          act2.rotation.y += 0.004;
          act2.position.y = Math.sin(t * 0.5) * 0.08;
        }

        // Act 3 idle: float + rotate medallions
        if (act === 3 && !reducedMotion) {
          act3.children.forEach((child, i) => {
            child.position.y = (i === 0 ? 0.3 : i === 1 ? 0 : -0.2) + Math.sin(t * 0.7 + i) * 0.1;
            child.rotation.y += 0.008 - i * 0.002;
          });
        }

        // Act 4 idle: gentle float
        if (act === 4 && !reducedMotion) {
          act4.children.forEach((child, i) => {
            child.position.y = Math.sin(t * 0.6 + i * 1.2) * 0.12;
          });
        }

        // Act 5 idle: drift particles upward
        if (act === 5 && !reducedMotion) {
          const posAttr = particleGeo.getAttribute('position') as THREE.BufferAttribute;
          for (let i = 0; i < particleCount; i++) {
            posAttr.setY(i, posAttr.getY(i) + velocities[i * 3 + 1]);
            posAttr.setX(i, posAttr.getX(i) + velocities[i * 3]);
            if (posAttr.getY(i) > 3) posAttr.setY(i, -3);
          }
          posAttr.needsUpdate = true;
        }

        // Act 6 idle: slight tilt
        if (act === 6 && !reducedMotion) {
          act6.rotation.z = Math.sin(t * 0.4) * 0.03;
        }

        renderer.render(scene, camera);
      });

      cleanupGsap = () => {
        ScrollTrigger.getAll().forEach(st => st.kill());
        master.kill();
      };

      return () => {
        renderer.setAnimationLoop(null);
        resizeObserver?.disconnect();
        cleanupGsap?.();

        scene.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(m => m.dispose());
          }
        });

        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }

    let cleanup: (() => void) | undefined;
    init().then(fn => { cleanup = fn; });

    return () => {
      cleanup?.();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
