'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

export default function HeroRCC() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const rule1Ref = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Three.js particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Feather particles — thin elongated ovals
    const COUNT = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      velocities[i * 3]     = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 1] = 0.004 + Math.random() * 0.006;
      velocities[i * 3 + 2] = 0;
      phases[i] = Math.random() * Math.PI * 2;
      sizes[i] = 2 + Math.random() * 6;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: 0xC9A84C,
      transparent: true,
      opacity: 0.06,
      sizeAttenuation: true,
      size: 0.04,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse repulsion
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
        const phase = phases[i];
        // Sinusoidal sway
        pos[i * 3] += velocities[i * 3] + Math.sin(t + phase) * 0.001;
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        // Mouse repulsion
        const dx = pos[i * 3] - mouseX;
        const dy = pos[i * 3 + 1] - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1.5) {
          pos[i * 3] += (dx / dist) * 0.01;
          pos[i * 3 + 1] += (dy / dist) * 0.01;
        }
        // Reset when off screen
        if (pos[i * 3 + 1] > 7) {
          pos[i * 3]     = (Math.random() - 0.5) * 20;
          pos[i * 3 + 1] = -7;
        }
      }

      geometry.attributes.position.needsUpdate = true;
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
    };
  }, []);

  // GSAP entrance timeline
  useEffect(() => {
    const tl = gsap.timeline({ delay: 3.2 }); // after loading screen

    // Gold hairline rule draws in
    tl.fromTo(rule1Ref.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }
    );

    // Eyebrow
    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    );

    // Headline — letter by letter stagger
    const headline = headlineRef.current;
    if (headline) {
      const text = headline.textContent || '';
      headline.innerHTML = text.split('').map(c =>
        c === ' ' ? '<span style="display:inline-block;width:0.3em"> </span>'
          : `<span style="display:inline-block;opacity:0">${c}</span>`
      ).join('');
      tl.to(headline.querySelectorAll('span'), {
        opacity: 1,
        duration: 0.03,
        stagger: 0.03,
        ease: 'none',
      }, '-=0.1');
    }

    // Subhead
    tl.fromTo(subheadRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      '-=0.2'
    );

    // CTAs
    tl.fromTo(ctasRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    );

    // Scroll indicator
    tl.fromTo(scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.2'
    );
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
      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Court geometry */}
      <div className="court-geometry" />

      {/* Radial vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, rgba(6,14,28,0.85) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        padding: '0 24px',
        maxWidth: 900,
        margin: '0 auto',
      }}>
        {/* Gold hairline */}
        <div
          ref={rule1Ref}
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            marginBottom: 32,
            transformOrigin: 'center',
          }}
        />

        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="text-label"
          style={{ marginBottom: 28, color: 'rgba(201,168,76,0.7)', opacity: 0 }}
        >
          Racquets Club Community · Delhi · Est. 2024
        </div>

        {/* Primary headline */}
        <h1
          ref={headlineRef}
          className="text-display"
          style={{
            color: '#F5F0E8',
            marginBottom: 24,
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontWeight: 600,
          }}
        >
          Delhi's Game. Elevated.
        </h1>

        {/* Subhead */}
        <p
          ref={subheadRef}
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 2vw, 22px)',
            color: '#C8BFA8',
            lineHeight: 1.7,
            marginBottom: 48,
            opacity: 0,
            maxWidth: 600,
            margin: '0 auto 48px',
          }}
        >
          An invitation-only community for serious players — where craft meets company.
        </p>

        {/* CTAs */}
        <div
          ref={ctasRef}
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
            opacity: 0,
            marginBottom: 80,
          }}
        >
          <a href="/join" className="btn-gold">
            Request Membership
          </a>
          <a href="/community" className="btn-ghost">
            Explore the Club
          </a>
        </div>

        {/* Gold hairline bottom */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
          margin: '0 auto',
          maxWidth: 300,
        }} />
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          opacity: 0,
        }}
      >
        <div className="text-label" style={{ color: 'rgba(201,168,76,0.5)' }}>Scroll</div>
        <div style={{
          width: 1,
          height: 40,
          background: 'linear-gradient(180deg, rgba(201,168,76,0.4), transparent)',
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
