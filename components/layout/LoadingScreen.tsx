'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<SVGCircleElement>(null);
  const innerRingRef = useRef<SVGCircleElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const shuttlecockRef = useRef<HTMLDivElement>(null);
  const arcTextRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const estRef = useRef<HTMLDivElement>(null);
  const horizLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set(horizLineRef.current, { scaleX: 0, opacity: 0.5 });
    gsap.set(glowRef.current, { opacity: 0, scale: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(overlayRef.current, {
          yPercent: -105,
          duration: 0.65,
          ease: 'power3.in',
          onComplete,
        });
      },
    });

    // 0–0.5s: Gold court line expands from center
    tl.to(horizLineRef.current, { scaleX: 1, duration: 0.45, ease: 'expo.out' }, 0);
    tl.to(horizLineRef.current, { opacity: 0, duration: 0.3, ease: 'power1.in' }, 0.4);

    // 0.3–1.1s: Outer ring draws in
    const outerCirc = outerRingRef.current;
    if (outerCirc) {
      const len = 2 * Math.PI * 120;
      outerCirc.style.strokeDasharray = `${len}`;
      outerCirc.style.strokeDashoffset = `${len}`;
      tl.to(outerCirc, { strokeDashoffset: 0, duration: 0.7, ease: 'expo.out' }, 0.3);
    }

    // 0.9–1.5s: Inner ring
    const innerCirc = innerRingRef.current;
    if (innerCirc) {
      const len2 = 2 * Math.PI * 108;
      innerCirc.style.strokeDasharray = `${len2}`;
      innerCirc.style.strokeDashoffset = `${len2}`;
      tl.to(innerCirc, { strokeDashoffset: 0, duration: 0.6, ease: 'expo.out' }, 0.9);
    }

    // 1.2–1.6s: Radial glow blooms
    tl.to(glowRef.current, { opacity: 0.5, scale: 1.05, duration: 0.4, ease: 'power2.out' }, 1.2);

    // 1.2–1.6s: RCC monogram
    tl.fromTo(monogramRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.4)' },
      1.2
    );

    // 1.5–1.8s: Shuttlecock drops in
    tl.fromTo(shuttlecockRef.current,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' },
      1.5
    );

    // 1.8–2.4s: Arc text letterspace reveal
    tl.fromTo(arcTextRef.current,
      { opacity: 0, letterSpacing: '0.5em' },
      { opacity: 1, letterSpacing: '0.18em', duration: 0.6, ease: 'power2.out' },
      1.8
    );

    // 2.4–2.7s: EST/DELHI
    tl.fromTo(estRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
      2.4
    );

    // 0–2.9s: Progress bar
    tl.to(progressRef.current, { scaleX: 1, duration: 2.9, ease: 'power2.inOut' }, 0);

  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #0A1628 0%, #060E1C 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Ambient vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Gold court-line reveal */}
      <div ref={horizLineRef} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #C9A84C 30%, #E2C97E 50%, #C9A84C 70%, transparent)',
        transformOrigin: 'center',
        pointerEvents: 'none',
      }} />

      {/* Crest */}
      <div style={{ position: 'relative', width: 280, height: 280 }}>
        {/* Glow */}
        <div ref={glowRef} style={{
          position: 'absolute',
          inset: -20,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)',
          opacity: 0,
        }} />

        {/* SVG rings */}
        <svg
          width="280"
          height="280"
          viewBox="0 0 280 280"
          style={{ position: 'absolute', inset: 0 }}
        >
          <circle
            ref={outerRingRef}
            cx="140" cy="140" r="120"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="1.5"
            transform="rotate(-90 140 140)"
          />
          <circle
            ref={innerRingRef}
            cx="140" cy="140" r="108"
            fill="none"
            stroke="rgba(201,168,76,0.4)"
            strokeWidth="0.8"
            transform="rotate(-90 140 140)"
          />
          {/* Crimson rules */}
          <line x1="60" y1="72" x2="118" y2="72" stroke="#9B2335" strokeWidth="0.8" />
          <line x1="162" y1="72" x2="220" y2="72" stroke="#9B2335" strokeWidth="0.8" />
          <line x1="70" y1="210" x2="210" y2="210" stroke="#9B2335" strokeWidth="0.6" />
        </svg>

        {/* Shuttlecock */}
        <div ref={shuttlecockRef} style={{
          position: 'absolute',
          top: 38,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 34,
          opacity: 0,
          filter: 'drop-shadow(0 0 10px rgba(201,168,76,0.7))',
        }}>
          🏸
        </div>

        {/* RCC Monogram */}
        <div ref={monogramRef} style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          marginTop: 8,
        }}>
          <span style={{
            fontFamily: 'var(--font-anton), Impact, sans-serif',
            fontSize: 76,
            fontWeight: 600,
            color: '#C9A84C',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            textShadow: '0 0 40px rgba(201,168,76,0.35)',
          }}>
            RCC
          </span>
        </div>

        {/* Arc text */}
        <div ref={arcTextRef} style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          textAlign: 'center',
          fontFamily: 'var(--font-archivo), Arial, sans-serif',
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.7)',
          opacity: 0,
        }}>
          Racquets Club Community
        </div>

        {/* EST / DELHI */}
        <div ref={estRef} style={{
          position: 'absolute',
          bottom: 44,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: 0,
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            fontFamily: 'var(--font-archivo), Arial, sans-serif',
            fontSize: 15,
            letterSpacing: '0.3em',
            color: '#9B2335',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}>
            · DELHI ·
          </div>
          <div style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: 10,
            color: 'rgba(201,168,76,0.55)',
            marginTop: 5,
            letterSpacing: '0.12em',
          }}>
            EST. 2024
          </div>
        </div>
      </div>

      {/* Progress line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'rgba(201,168,76,0.12)',
        overflow: 'hidden',
      }}>
        <div ref={progressRef} style={{
          height: '100%',
          background: 'linear-gradient(90deg, transparent, #C9A84C 50%, transparent)',
          transformOrigin: 'left',
          transform: 'scaleX(0)',
        }} />
      </div>
    </div>
  );
}
