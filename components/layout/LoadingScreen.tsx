'use client';

import { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(overlayRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete,
        });
      },
    });

    // Progress bar
    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 2.6,
      ease: 'power2.inOut',
    }, 0);

    // Outer ring draws via stroke-dashoffset
    const outerCirc = outerRingRef.current;
    if (outerCirc) {
      const len = 2 * Math.PI * 120;
      outerCirc.style.strokeDasharray = `${len}`;
      outerCirc.style.strokeDashoffset = `${len}`;
      tl.to(outerCirc, {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: 'expo.out',
      }, 0.3);
    }

    // Inner ring
    const innerCirc = innerRingRef.current;
    if (innerCirc) {
      const len2 = 2 * Math.PI * 108;
      innerCirc.style.strokeDasharray = `${len2}`;
      innerCirc.style.strokeDashoffset = `${len2}`;
      tl.to(innerCirc, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: 'expo.out',
      }, 0.9);
    }

    // Monogram
    tl.fromTo(monogramRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' },
      1.2
    );

    // Shuttlecock
    tl.fromTo(shuttlecockRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
      1.5
    );

    // Arc text
    tl.fromTo(arcTextRef.current,
      { opacity: 0, letterSpacing: '0.3em' },
      { opacity: 1, letterSpacing: '0.18em', duration: 0.6, ease: 'power2.out' },
      1.8
    );

    // Glow pulse
    tl.to(glowRef.current, {
      opacity: 0.6,
      scale: 1.15,
      duration: 0.4,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    }, 2.4);

    tl.fromTo(glowRef.current,
      { opacity: 0 },
      { opacity: 0 },
      2.4
    );

    // EST / DELHI
    tl.fromTo(estRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      2.6
    );
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

      {/* Crest SVG */}
      <div style={{ position: 'relative', width: 280, height: 280 }}>
        {/* Glow */}
        <div ref={glowRef} style={{
          position: 'absolute',
          inset: -20,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
          opacity: 0,
        }} />

        {/* SVG Rings */}
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
        </svg>

        {/* Shuttlecock crown */}
        <div ref={shuttlecockRef} style={{
          position: 'absolute',
          top: 42,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 32,
          opacity: 0,
          filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.6))',
        }}>
          🏸
        </div>

        {/* RC Monogram */}
        <div ref={monogramRef} style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-anton), Impact, sans-serif',
            fontSize: 88,
            fontWeight: 600,
            color: '#C9A84C',
            lineHeight: 1,
            letterSpacing: '-0.05em',
            textShadow: '0 0 40px rgba(201,168,76,0.3)',
          }}>
            RC
          </span>
        </div>

        {/* Arc text */}
        <div ref={arcTextRef} style={{
          position: 'absolute',
          top: 12,
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
          RACQUETS CLUB COMMUNITY
        </div>

        {/* EST / DELHI */}
        <div ref={estRef} style={{
          position: 'absolute',
          bottom: 52,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: 0,
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            fontFamily: 'var(--font-archivo), Arial, sans-serif',
            fontSize: 14,
            letterSpacing: '0.25em',
            color: '#9B2335',
            textTransform: 'uppercase',
          }}>
            DELHI
          </div>
          <div style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: 10,
            color: 'rgba(201,168,76,0.5)',
            marginTop: 4,
            letterSpacing: '0.1em',
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
        background: 'rgba(201,168,76,0.15)',
        overflow: 'hidden',
      }}>
        <div ref={progressRef} style={{
          height: '100%',
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          transformOrigin: 'left',
          transform: 'scaleX(0)',
        }} />
      </div>
    </div>
  );
}
