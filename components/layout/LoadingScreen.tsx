'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const crestRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const horizLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set(horizLineRef.current, { scaleX: 0, opacity: 0.6 });
    gsap.set(crestRef.current, { opacity: 0, scale: 0.82 });
    gsap.set(glowRef.current, { opacity: 0, scale: 0.9 });
    gsap.set(taglineRef.current, { opacity: 0, letterSpacing: '0.5em' });

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

    // 0–0.45s: Gold court-line expands
    tl.to(horizLineRef.current, { scaleX: 1, duration: 0.45, ease: 'expo.out' }, 0);
    tl.to(horizLineRef.current, { opacity: 0, duration: 0.3, ease: 'power1.in' }, 0.4);

    // 0.35–1.1s: Glow blooms before crest
    tl.to(glowRef.current, { opacity: 0.35, scale: 1.1, duration: 0.75, ease: 'power2.out' }, 0.35);

    // 0.5–1.1s: Crest scales + fades in
    tl.to(crestRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.3)' }, 0.5);

    // 1.2–1.8s: Tagline letterspace reveal
    tl.to(taglineRef.current, {
      opacity: 1,
      letterSpacing: '0.22em',
      duration: 0.6,
      ease: 'power2.out',
    }, 1.2);

    // 0–2.8s: Progress bar
    tl.to(progressRef.current, { scaleX: 1, duration: 2.8, ease: 'power2.inOut' }, 0);

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

      {/* Radial glow behind crest */}
      <div ref={glowRef} style={{
        position: 'absolute',
        width: 420,
        height: 420,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* RCC Crest image */}
      <div ref={crestRef} style={{ position: 'relative', width: 240, height: 240 }}>
        <Image
          src="/rcc-crest.png"
          alt="Racquets Club Community"
          width={240}
          height={240}
          priority
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 24px rgba(201,168,76,0.45)) drop-shadow(0 0 6px rgba(201,168,76,0.2))',
          }}
        />
      </div>

      {/* Tagline */}
      <div ref={taglineRef} style={{
        marginTop: 32,
        fontFamily: 'var(--font-archivo), Arial, sans-serif',
        fontSize: 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'rgba(201,168,76,0.65)',
        opacity: 0,
      }}>
        Entering the arena
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
