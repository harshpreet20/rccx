'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

const HERO_STATS = [
  { value: '300+', label: 'Players' },
  { value: '12', label: 'Tournaments' },
  { value: '4', label: 'Courts' },
  { value: '2024', label: 'Established' },
];

export default function HeroRCC() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const rule1Ref = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Three.js — ambient feathers + smash streaks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Layer 1: drifting gold feathers
    const COUNT = 240;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      velocities[i * 3]     = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 1] = 0.004 + Math.random() * 0.007;
      velocities[i * 3 + 2] = 0;
      phases[i] = Math.random() * Math.PI * 2;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xC9A84C, transparent: true, opacity: 0.14, sizeAttenuation: true, size: 0.045,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    scene.add(new THREE.Points(geometry, material));

    // Layer 2: fast diagonal smash streaks
    const SCOUNT = 26;
    const sGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(SCOUNT * 3);
    const sVel = new Float32Array(SCOUNT * 2);
    for (let i = 0; i < SCOUNT; i++) {
      sPos[i * 3]     = (Math.random() - 0.5) * 24;
      sPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      sPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      sVel[i * 2]     = 0.06 + Math.random() * 0.08;   // x speed
      sVel[i * 2 + 1] = -(0.02 + Math.random() * 0.03); // y dip
    }
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const sMat = new THREE.PointsMaterial({
      color: 0xE2C97E, transparent: true, opacity: 0.4, sizeAttenuation: true, size: 0.07,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    scene.add(new THREE.Points(sGeo, sMat));

    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 10;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 6;
    };
    window.addEventListener('mousemove', onMouseMove);

    let frameId: number;
    let t = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.008;

      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3] += velocities[i * 3] + Math.sin(t + phases[i]) * 0.0012;
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        const dx = pos[i * 3] - mouseX;
        const dy = pos[i * 3 + 1] - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1.6) {
          pos[i * 3] += (dx / dist) * 0.014;
          pos[i * 3 + 1] += (dy / dist) * 0.014;
        }
        if (pos[i * 3 + 1] > 7) {
          pos[i * 3] = (Math.random() - 0.5) * 20;
          pos[i * 3 + 1] = -7;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      const sp = sGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < SCOUNT; i++) {
        sp[i * 3] += sVel[i * 2];
        sp[i * 3 + 1] += sVel[i * 2 + 1];
        if (sp[i * 3] > 13) {
          sp[i * 3] = -13 - Math.random() * 6;
          sp[i * 3 + 1] = Math.random() * 10 - 2;
        }
      }
      sGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      sGeo.dispose();
      sMat.dispose();
    };
  }, []);

  // Entrance — words slam in like smashes
  useEffect(() => {
    const tl = gsap.timeline({ delay: 3.2 });

    tl.fromTo(rule1Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' });
    tl.fromTo(eyebrowRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.15');

    const words = headlineRef.current?.querySelectorAll('.slam-word');
    if (words) {
      tl.fromTo(words,
        { yPercent: 130, rotate: 5, opacity: 0 },
        { yPercent: 0, rotate: 0, opacity: 1, duration: 0.55, stagger: 0.14, ease: 'back.out(1.6)' },
        '-=0.1'
      );
    }

    tl.fromTo(subheadRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.15');
    tl.fromTo(ctasRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25');

    const statEls = statsRef.current?.children;
    if (statEls) {
      tl.fromTo(statEls,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' },
        '-=0.2'
      );
    }
    tl.fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.1');
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #0A1628 0%, #060E1C 60%, #0A1628 100%)',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />

      {/* Badminton court floor in perspective */}
      <div className="court-floor" />

      {/* Diagonal smash speed lines */}
      <div className="speed-lines" />

      {/* Flying shuttle with trail */}
      <div className="shuttle-flyer">🏸</div>

      {/* Radial vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 70% at 50% 42%, transparent 0%, rgba(6,14,28,0.88) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '110px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div ref={rule1Ref} style={{
          height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          marginBottom: 28, transformOrigin: 'center',
        }} />

        <div ref={eyebrowRef} className="text-label" style={{ marginBottom: 30, color: 'rgba(201,168,76,0.75)', opacity: 0 }}>
          Racquets Club Community · Delhi's Most Competitive Badminton League
        </div>

        <h1 ref={headlineRef} className="text-display" style={{ color: '#F5F0E8', marginBottom: 28 }}>
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', padding: '0 0.12em' }}>
            <span className="slam-word">SMASH<span style={{ color: '#9B2335' }}>.</span></span>
          </span>{' '}
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', padding: '0 0.12em' }}>
            <span className="slam-word">CONNECT<span style={{ color: '#9B2335' }}>.</span></span>
          </span>{' '}
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', padding: '0 0.12em' }}>
            <span className="slam-word gold-shimmer-text">COMPETE<span style={{ color: '#9B2335', WebkitTextFillColor: '#9B2335' }}>.</span></span>
          </span>
        </h1>

        <p ref={subheadRef} style={{
          fontFamily: 'var(--font-head)',
          fontWeight: 500,
          fontSize: 'clamp(15px, 1.8vw, 20px)',
          letterSpacing: '0.04em',
          color: '#C8BFA8',
          lineHeight: 1.7,
          opacity: 0,
          maxWidth: 640,
          margin: '0 auto 44px',
        }}>
          Invite-only. Skill-matched. Every rally counted.
          <br />
          <span style={{ color: 'rgba(201,168,76,0.85)', fontWeight: 700 }}>If you play to win, you play here.</span>
        </p>

        <div ref={ctasRef} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', opacity: 0, marginBottom: 56 }}>
          <a href="/join" className="btn-gold">Claim Your Spot</a>
          <a href="/community" className="btn-ghost">See the Rankings</a>
        </div>

        {/* Competitive stat strip */}
        <div ref={statsRef} style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 0,
          borderTop: '1px solid rgba(201,168,76,0.18)',
          borderBottom: '1px solid rgba(201,168,76,0.18)',
          maxWidth: 760,
          margin: '0 auto',
        }}>
          {HERO_STATS.map((s, i) => (
            <div key={s.label} style={{
              flex: '1 1 150px',
              padding: '18px 12px',
              borderLeft: i > 0 ? '1px solid rgba(201,168,76,0.12)' : 'none',
              opacity: 0,
            }}>
              <div style={{
                fontFamily: 'var(--font-anton), Impact, sans-serif',
                fontSize: 'clamp(26px, 3vw, 38px)',
                color: '#E2C97E',
                letterSpacing: '0.02em',
                lineHeight: 1,
                marginBottom: 6,
              }}>{s.value}</div>
              <div className="text-label" style={{ fontSize: 9 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0, zIndex: 2,
      }}>
        <div className="text-label" style={{ color: 'rgba(201,168,76,0.5)', fontSize: 9 }}>Scroll</div>
        <div style={{
          width: 1, height: 36,
          background: 'linear-gradient(180deg, rgba(201,168,76,0.5), transparent)',
          animation: 'scroll-pulse 2s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes scroll-pulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(0.8); }
        }
      `}</style>
    </section>
  );
}
