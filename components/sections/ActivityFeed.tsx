'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FEED_ITEMS = [
  {
    date: '2025-06-10',
    title: 'RCC Doubles Championship — Group A',
    players: 'Arjun Mehta / Priya Sharma vs Rohit Kapoor / Ananya Singh',
    score: '21-15  21-18',
    result: 'Mehta/Sharma Win',
    type: 'match',
  },
  {
    date: '2025-06-09',
    title: 'Morning Practice Session — Court 3',
    players: 'Open to Gold & Champion Tier',
    score: '6:00 AM — 8:30 AM',
    result: '14 Players',
    type: 'session',
  },
  {
    date: '2025-06-08',
    title: 'RCC Open Registration Opens',
    players: 'Delhi · July 2025',
    score: '500+ Expected',
    result: 'Apply Now',
    type: 'event',
  },
  {
    date: '2025-06-07',
    title: 'Mixed Doubles — Saturday League R4',
    players: 'Vikram Bose / Sneha Nair vs Rahul Dev / Meera Iyer',
    score: '21-19  19-21  21-14',
    result: 'Bose/Nair Win',
    type: 'match',
  },
];

const TYPE_ACCENT: Record<string, string> = {
  match: '#C9A84C',
  session: 'rgba(201,168,76,0.4)',
  event: '#9B2335',
};

export default function ActivityFeed() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll('.feed-item');
    if (items) {
      gsap.fromTo(items,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
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
      className="relative z-10"
      style={{
        background: 'transparent',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="text-label" style={{ color: 'rgba(201,168,76,0.6)', marginBottom: 16 }}>
            The Chronicle
          </div>
          <h2 className="text-h2" style={{
            fontFamily: 'var(--font-archivo), Arial, sans-serif',
            color: '#F5F0E8',
            marginBottom: 16,
          }}>
            Club Activity
          </h2>
          <div className="gold-rule" style={{ maxWidth: 200, margin: '0 auto' }} />
        </div>

        {/* Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {FEED_ITEMS.map((item, i) => (
            <div
              key={i}
              className="feed-item"
              style={{
                background: 'rgba(15,32,64,0.5)',
                borderLeft: `2px solid ${TYPE_ACCENT[item.type]}`,
                padding: '24px 28px',
                position: 'relative',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(15,32,64,0.8)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(15,32,64,0.5)';
              }}
            >
              {/* Date */}
              <div style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: 11,
                color: 'rgba(200,191,168,0.5)',
                marginBottom: 8,
                letterSpacing: '0.08em',
              }}>
                {item.date}
              </div>

              {/* Title */}
              <div style={{
                fontFamily: 'var(--font-archivo), Arial, sans-serif',
                fontSize: 22,
                color: '#F5F0E8',
                fontWeight: 500,
                marginBottom: 6,
                lineHeight: 1.3,
              }}>
                {item.title}
              </div>

              {/* Players */}
              <div style={{
                fontFamily: 'var(--font-archivo), Arial, sans-serif',
                fontVariant: 'small-caps',
                fontSize: 13,
                color: '#C9A84C',
                letterSpacing: '0.04em',
                marginBottom: 12,
              }}>
                {item.players}
              </div>

              {/* Gold rule */}
              <div className="gold-rule" style={{ marginBottom: 12, opacity: 0.2 }} />

              {/* Score / Result row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: 22,
                  color: '#F5F0E8',
                  letterSpacing: '0.04em',
                }}>
                  {item.score}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  padding: '3px 10px',
                  background: 'rgba(201,168,76,0.06)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: 2,
                  color: '#C9A84C',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  {item.result}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <a href="/community" className="btn-ghost">
            Full Activity Log
          </a>
        </div>
      </div>
    </section>
  );
}
