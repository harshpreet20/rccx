'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { wordImpact } from '@/lib/impactTypography';

const HERO_STATS = [
  { value: '350+', label: 'Players' },
  { value: '10+', label: 'Courts Covered' },
  { value: '2024', label: 'Established' },
];

export default function HeroRCC() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rule1Ref = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Entrance — words slam in with impact
  useEffect(() => {
    const tl = gsap.timeline({ delay: 3.6 });

    tl.fromTo(rule1Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' });
    tl.fromTo(eyebrowRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.15');

    const words = headlineRef.current?.querySelectorAll('.slam-word');
    if (words) {
      tl.fromTo(
        words,
        { yPercent: 130, rotate: 5, opacity: 0 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 0.55,
          stagger: {
            each: 0.14,
            onComplete() {
              // @ts-expect-error — GSAP passes `this` target
              wordImpact(this.targets()[0]);
            },
          },
          ease: 'back.out(1.6)',
        },
        '-=0.1'
      );
    }

    tl.fromTo(subheadRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.15');
    tl.fromTo(ctasRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25');

    const statEls = statsRef.current?.children;
    if (statEls) {
      tl.fromTo(
        statEls,
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
        background: 'transparent', // R3F canvas shows through
      }}
    >
      {/* Falling shuttles — continuous ambient loop */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
        {[
          { left: '8%',  delay: '0s',   dur: '3.8s', size: 18 },
          { left: '22%', delay: '1.2s', dur: '4.5s', size: 14 },
          { left: '38%', delay: '0.5s', dur: '3.2s', size: 20 },
          { left: '55%', delay: '2.1s', dur: '4.9s', size: 16 },
          { left: '71%', delay: '0.9s', dur: '3.6s', size: 12 },
          { left: '85%', delay: '1.7s', dur: '4.1s', size: 18 },
          { left: '93%', delay: '3.0s', dur: '3.4s', size: 14 },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: '-60px',
            left: s.left,
            width: s.size,
            height: s.size * 1.6,
            animation: `shuttle-fall ${s.dur} ${s.delay} linear infinite`,
          }}>
            {/* Cork base */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: s.size * 0.55,
              height: s.size * 0.55,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #E2C97E, #9B6B1A)',
              boxShadow: '0 0 4px rgba(201,168,76,0.4)',
            }} />
            {/* Feathers */}
            {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, fi) => (
              <div key={fi} style={{
                position: 'absolute',
                bottom: s.size * 0.4,
                left: '50%',
                width: 1,
                height: s.size * 0.9,
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) rotate(${deg}deg) perspective(60px) rotateX(12deg)`,
                background: `linear-gradient(to top, rgba(201,168,76,0.7), rgba(245,240,232,0.15))`,
              }} />
            ))}
          </div>
        ))}
      </div>

      {/* Radial vignette to blend content area */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 80% at 50% 40%, rgba(6,14,28,0.1) 0%, rgba(6,14,28,0.55) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        padding: '110px 24px 40px',
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        <div ref={rule1Ref} style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          marginBottom: 28,
          transformOrigin: 'center',
        }} />

        <div ref={eyebrowRef} className="text-label" style={{
          marginBottom: 30,
          color: 'rgba(201,168,76,0.75)',
          opacity: 0,
          letterSpacing: '0.22em',
        }}>
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

        <div ref={ctasRef} style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          flexWrap: 'wrap',
          opacity: 0,
          marginBottom: 56,
        }}>
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
        position: 'absolute',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        opacity: 0,
        zIndex: 2,
      }}>
        <div className="text-label" style={{ color: 'rgba(201,168,76,0.5)', fontSize: 9 }}>Scroll</div>
        <div style={{
          width: 1,
          height: 36,
          background: 'linear-gradient(180deg, rgba(201,168,76,0.5), transparent)',
          animation: 'scroll-pulse 2s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes scroll-pulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(0.8); }
        }
        @keyframes shuttle-fall {
          0%   { transform: translateY(0)    rotate(0deg);   opacity: 0; }
          8%   { opacity: 0.55; }
          85%  { opacity: 0.45; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
