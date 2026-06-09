'use client';

import { useEffect, useRef } from 'react';

export default function ShuttleCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    let mouseX = -200, mouseY = -200;
    let rafId: number;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function loop() {
      if (el) {
        // Cork tip is at top-center (cx=20), offset so it aligns with pointer
        el.style.transform = `translate(${mouseX - 20}px, ${mouseY}px)`;
      }
      rafId = requestAnimationFrame(loop);
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    >
      <svg
        width="40"
        height="64"
        viewBox="0 0 40 64"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Cork gradient — warm amber */}
          <radialGradient id="sc-cork" cx="38%" cy="32%" r="62%">
            <stop offset="0%" stopColor="#f5d98a" />
            <stop offset="55%" stopColor="#d4a040" />
            <stop offset="100%" stopColor="#a06820" />
          </radialGradient>

          {/* Shaft gradient */}
          <linearGradient id="sc-shaft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5e20" />
            <stop offset="40%" stopColor="#c89050" />
            <stop offset="100%" stopColor="#8b5e20" />
          </linearGradient>

          {/* Feather fill — white with gold tint */}
          <linearGradient id="sc-feather" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f0e0b0" stopOpacity="0.75" />
          </linearGradient>

          {/* Ring gradient — crimson accent */}
          <linearGradient id="sc-ring" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C21818" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#C21818" />
          </linearGradient>

          {/* Drop shadow */}
          <filter id="sc-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.8)" />
          </filter>

          {/* Subtle gold glow on ring */}
          <filter id="sc-ring-glow" x="-60%" y="-200%" width="220%" height="500%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#D4AF37" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* ── Cork body ── */}
        <ellipse cx="20" cy="10" rx="9" ry="11"
          fill="url(#sc-cork)"
          stroke="#7a4e10"
          strokeWidth="1.2"
          filter="url(#sc-glow)"
        />

        {/* Cork sheen highlight */}
        <ellipse cx="16.5" cy="6.5" rx="3.5" ry="4"
          fill="rgba(255,255,255,0.38)"
        />

        {/* Cork bottom rim */}
        <ellipse cx="20" cy="18.5" rx="6" ry="2"
          fill="none"
          stroke="#7a4e10"
          strokeWidth="1"
          opacity="0.7"
        />

        {/* ── Shaft ── */}
        <path d="M17,19 L23,19 L21.5,30 L18.5,30 Z"
          fill="url(#sc-shaft)"
          stroke="#6b4010"
          strokeWidth="0.7"
        />

        {/* Shaft detail line */}
        <line x1="20" y1="19.5" x2="20" y2="29.5"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.8"
        />

        {/* ── 16 feather quills ── */}
        {[
          [3,  52], [5,  55], [8,  58], [12, 60],
          [16, 61.5],[20,62],[24, 61.5],[28, 60],
          [32, 58], [35, 55],[37, 52],
          // inner ring feathers (slightly shorter)
          [7,  50], [11, 53],[20, 54],[29, 53],[33, 50],
        ].map(([x2, y2], i) => (
          <line key={i}
            x1="20" y1="29"
            x2={x2} y2={y2}
            stroke="url(#sc-feather)"
            strokeWidth={i >= 11 ? '0.7' : '1.1'}
            strokeLinecap="round"
            opacity={i >= 11 ? 0.4 : 0.88}
          />
        ))}

        {/* ── Feather vane membrane ── */}
        <path d="M3,52 Q11,44 20,29 Q29,44 37,52"
          fill="rgba(255,255,255,0.06)"
          stroke="none"
        />

        {/* ── Gold/crimson ring ── */}
        <ellipse cx="20" cy="57" rx="18" ry="4.5"
          fill="rgba(212,175,55,0.08)"
          stroke="url(#sc-ring)"
          strokeWidth="1.8"
          filter="url(#sc-ring-glow)"
        />

        {/* Ring inner highlight */}
        <ellipse cx="20" cy="57" rx="14" ry="2.5"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
}
