'use client';

import { useEffect, useRef } from 'react';

const STATS = [
  { display: '300+', label: 'Active Members', isText: false },
  { display: '1,000+', label: 'Games Played', isText: false },
  { display: 'Fastest', label: 'Growing Community in Delhi NCR', isText: true },
];

const PILLARS = [
  'Women-First',
  'Beginner-Friendly',
  'Hudle Partnered',
];

function StatCounter({ display, label, isText }: { display: string; label: string; isText: boolean }) {
  const elRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el || isText) return;

    const numericPart = parseFloat(display.replace(/[^0-9.]/g, ''));
    const suffix = display.replace(/[0-9.]/g, '');

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const duration = 1600;

          function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * numericPart);
            el!.textContent = current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [display, isText]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        ref={isText ? undefined : elRef}
        style={{
          fontFamily: '"Anton", "Impact", sans-serif',
          fontSize: 'clamp(48px, 6vw, 72px)',
          color: '#C9A84C',
          lineHeight: 1,
          marginBottom: 8,
          letterSpacing: '-0.01em',
        }}
      >
        {display}
      </div>
      <div style={{
        fontFamily: '"Montserrat", sans-serif',
        fontSize: 13,
        fontWeight: 400,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.4)',
        lineHeight: 1.4,
        maxWidth: 140,
        margin: '0 auto',
      }}>
        {label}
      </div>
    </div>
  );
}

export default function AboutRCC() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasRevealed = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = section.querySelectorAll<HTMLElement>('.fade-up-item');
    items.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasRevealed.current) {
          hasRevealed.current = true;
          items.forEach((el, i) => {
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, i * 80);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{
        background: 'transparent',
        position: 'relative',
        minHeight: '80vh',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 120px)',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,500&family=Montserrat:wght@300;400;600&family=DM+Mono:wght@400;500&display=swap');
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Editorial label */}
        <div className="fade-up-item" style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          marginBottom: 32,
        }}>
          What is RCC
        </div>

        {/* Main headline */}
        <h2 className="fade-up-item" style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 'clamp(48px, 6vw, 80px)',
          color: '#ffffff',
          lineHeight: 1.1,
          marginBottom: 28,
          maxWidth: 700,
        }}>
          More than<br />badminton.
        </h2>

        {/* Subheadline */}
        <p className="fade-up-item" style={{
          fontFamily: '"Montserrat", sans-serif',
          fontSize: 20,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.6,
          marginBottom: 28,
          maxWidth: 620,
        }}>
          A community built around respect, safety and meaningful competition.
        </p>

        {/* Body paragraph */}
        <p className="fade-up-item" style={{
          fontFamily: '"Montserrat", sans-serif',
          fontSize: 16,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.8,
          marginBottom: 48,
          maxWidth: 560,
        }}>
          RCC is Delhi's invite-only badminton community. We organise curated sessions, skill-balanced matches, and tournaments for players who want real community — not just court time.
        </p>

        {/* Value pillars */}
        <div className="fade-up-item" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 24,
          marginBottom: 80,
        }}>
          {PILLARS.map((pillar) => (
            <div key={pillar} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#C9A84C',
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: '"Montserrat", sans-serif',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
              }}>
                {pillar}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="fade-up-item" style={{
          height: 1,
          background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)',
          marginBottom: 72,
          maxWidth: 400,
        }} />

        {/* Stat counters */}
        <div className="fade-up-item" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 48,
          maxWidth: 680,
        }}>
          {STATS.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </div>

      </div>
    </section>
  );
}
