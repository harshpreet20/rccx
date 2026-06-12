'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 300, suffix: '+', label: 'Members' },
  { value: 2024, suffix: '', label: 'Established' },
  { value: 4, suffix: '', label: 'Courts' },
  { value: 12, suffix: '+', label: 'Tournaments' },
];

export default function AboutRCC() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const editorialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const counters = document.querySelectorAll('[data-counter]');

    counters.forEach(counter => {
      const el = counter as HTMLElement;
      const target = parseFloat(el.dataset.counter || '0');
      const suffix = el.dataset.suffix || '';

      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: function() {
              el.textContent = Math.round(this.targets()[0].val).toLocaleString() + suffix;
            },
          });
        },
      });
    });

    // Section reveal
    const elements = sectionRef.current?.querySelectorAll('.reveal-item');
    if (elements) {
      gsap.fromTo(elements,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'linear-gradient(180deg, #060E1C 0%, #0A1628 100%)',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 120px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle court geometry */}
      <div className="court-geometry" style={{ opacity: 0.02 }} />

      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 80,
        alignItems: 'center',
      }}>
        {/* Stats card */}
        <div
          ref={cardRef}
          className="glass-panel reveal-item"
          style={{
            padding: 48,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 40,
          }}
        >
          {STATS.map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div
                data-counter={stat.value}
                data-suffix={stat.suffix}
                className="text-stat gold-shimmer-text"
                style={{ fontSize: 'clamp(36px, 4vw, 52px)', marginBottom: 8 }}
              >
                0{stat.suffix}
              </div>
              <div className="text-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Editorial text */}
        <div ref={editorialRef}>
          {/* Laurel divider */}
          <div className="laurel-divider reveal-item" style={{ justifyContent: 'flex-start', marginBottom: 32 }}>
            <div style={{
              width: 40,
              height: 1,
              background: 'linear-gradient(90deg, var(--gold-rich), transparent)',
            }} />
            <span className="text-label" style={{ color: 'rgba(201,168,76,0.6)' }}>
              The Institution
            </span>
          </div>

          <h2 className="text-h2 reveal-item" style={{
            color: '#F5F0E8',
            marginBottom: 28,
            fontFamily: 'var(--font-cormorant), Georgia, serif',
          }}>
            Not Just a Community.
            <br />
            <span className="gold-shimmer-text">An Institution.</span>
          </h2>

          <p className="reveal-item" style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            lineHeight: 1.8,
            color: '#C8BFA8',
            fontWeight: 300,
            marginBottom: 24,
          }}>
            RCC was founded in Delhi in 2024 — not as another sports group, but as a home
            for players who take their game and their community seriously.
          </p>

          <p className="reveal-item" style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 20,
            lineHeight: 1.6,
            color: 'rgba(201,168,76,0.8)',
            marginBottom: 40,
            borderLeft: '1px solid rgba(201,168,76,0.3)',
            paddingLeft: 20,
          }}>
            "We are 300+ members. We are growing.
            <br />We are selective by intent."
          </p>

          <a href="/join" className="btn-gold reveal-item" style={{ display: 'inline-flex' }}>
            Join the Community
          </a>
        </div>
      </div>

      {/* Gold rule bottom */}
      <div className="gold-rule reveal-item" style={{ maxWidth: 600, margin: '80px auto 0' }} />
    </section>
  );
}
