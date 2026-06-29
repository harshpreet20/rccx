'use client';

import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const GOLD = '#C9A84C';

const VENUES = [
  { name: 'Paschim Vihar', label: 'PRIMARY HUB', timing: 'Morning & Evening sessions' },
  { name: 'Rajouri Garden', label: 'CENTRAL DELHI', timing: 'Weekend sessions' },
  { name: 'Pitampura', label: 'NORTH DELHI', timing: 'Morning sessions' },
  { name: 'Janakpuri', label: 'WEST DELHI', timing: 'Evening sessions' },
  { name: 'Tilak Nagar', label: 'WEST DELHI CONNECT', timing: 'Weekend sessions' },
];

export default function VenuesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const items = section.querySelectorAll<HTMLElement>('.venue-reveal');
    items.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.65s ease ${i * 0.08}s, transform 0.65s ease ${i * 0.08}s`;
    });
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          items.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} style={{ width: '100%', padding: '120px 0', background: 'transparent' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
        <div className="venue-reveal" style={{ marginBottom: '64px' }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', letterSpacing: '0.2em', color: GOLD, textTransform: 'uppercase', margin: '0 0 20px 0' }}>
            WHERE WE PLAY
          </p>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(32px, 4vw, 52px)', color: '#fff', fontWeight: 400, margin: 0, lineHeight: 1.15 }}>
            Courts across Delhi NCR.
          </h2>
        </div>

        <div className="venues-grid">
          {VENUES.map((venue) => (
            <div
              key={venue.name}
              className="venue-reveal venue-card"
              style={{ padding: '32px 28px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(201,168,76,0.15)', backdropFilter: 'blur(12px)', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '12px' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.5)'; el.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(201,168,76,0.15)'; el.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color={GOLD} />
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', letterSpacing: '0.18em', color: GOLD, textTransform: 'uppercase' }}>
                  {venue.label}
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', color: '#fff', fontWeight: 600, margin: 0, lineHeight: 1.2 }}>
                {venue.name}
              </h3>
              <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '5px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px' }}>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', color: 'rgba(245,240,232,0.6)' }}>
                  {venue.timing}
                </span>
              </div>
              <a
                href="https://hudle.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', color: GOLD, textDecoration: 'none', letterSpacing: '0.05em', marginTop: '4px', transition: 'opacity 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                View on Hudle →
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .venues-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .venue-card { transition: border-color 0.25s ease, transform 0.25s ease !important; }
        @media (max-width: 900px) {
          .venues-grid { display: flex !important; overflow-x: auto; gap: 16px !important; padding-bottom: 16px; scrollbar-width: none; }
          .venues-grid::-webkit-scrollbar { display: none; }
          .venues-grid > div { min-width: 260px; }
        }
      `}</style>
    </section>
  );
}
