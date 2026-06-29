'use client';

import { useEffect, useRef } from 'react';

const GOLD = '#C9A84C';

const CREDIBILITY_POINTS = [
  { emoji: '🏛', title: 'Verified Venues', desc: 'All our courts are Hudle-verified' },
  { emoji: '📅', title: 'Easy Bookings', desc: 'One tap to confirm your court' },
  { emoji: '🔐', title: 'Trusted Ecosystem', desc: 'Payments and venues you can rely on' },
  { emoji: '🏆', title: 'Premium Experience', desc: 'The best venues in Delhi NCR' },
];

export default function HudlePartnerSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const items = section.querySelectorAll<HTMLElement>('.fade-up-hudle');
    items.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`;
    });
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          items.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100%',
        padding: '120px 0',
        background: 'rgba(201,168,76,0.03)',
        borderTop: '1px solid rgba(201,168,76,0.1)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px' }}>
        <div className="fade-up-hudle" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', letterSpacing: '0.2em', color: GOLD, textTransform: 'uppercase', margin: 0 }}>
            OFFICIAL PARTNERSHIP
          </p>
          <div style={{ padding: '4px 12px', border: `1px solid ${GOLD}`, borderRadius: '100px', fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 700, color: GOLD, letterSpacing: '0.05em' }}>
            hudle
          </div>
        </div>

        <h2 className="fade-up-hudle" style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: 'clamp(32px, 4vw, 52px)', color: '#fff', fontWeight: 400, lineHeight: 1.2, margin: '0 0 24px 0' }}>
          Proud Hudle Partner Community.
        </h2>

        <p className="fade-up-hudle" style={{ fontFamily: 'var(--font-montserrat)', fontSize: '17px', color: 'rgba(245,240,232,0.6)', lineHeight: 1.75, maxWidth: '640px', margin: '0 0 64px 0' }}>
          Every RCC booking happens through Hudle — India&apos;s leading sports venue platform. Verified venues, seamless payments, trusted ecosystem.
        </p>

        <div className="fade-up-hudle" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '56px' }}>
          {CREDIBILITY_POINTS.map((point) => (
            <div
              key={point.title}
              style={{ padding: '28px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.12)', backdropFilter: 'blur(8px)', borderRadius: '2px' }}
            >
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{point.emoji}</div>
              <h3 style={{ fontFamily: 'var(--font-montserrat)', fontSize: '14px', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                {point.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '13px', color: 'rgba(245,240,232,0.55)', margin: 0, lineHeight: 1.6 }}>
                {point.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="fade-up-hudle">
          <a
            href="https://hudle.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: GOLD, color: '#000', fontFamily: 'var(--font-montserrat)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px', transition: 'opacity 0.2s ease' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Book via Hudle →
          </a>
        </div>
      </div>
    </section>
  );
}
