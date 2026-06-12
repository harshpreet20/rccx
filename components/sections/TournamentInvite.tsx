'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TournamentInvite() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 75%',
        },
      }
    );

    // Particle density increase in this section
    const items = cardRef.current.querySelectorAll('.invite-item');
    gsap.fromTo(items,
      { opacity: 0, y: 16 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 70%',
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#060E1C',
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Enhanced particle density background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div
        ref={cardRef}
        style={{
          maxWidth: 860,
          margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(15,32,64,0.9) 0%, rgba(10,22,40,0.95) 100%)',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: 4,
          padding: 'clamp(48px, 6vw, 80px)',
          textAlign: 'center',
          position: 'relative',
          boxShadow: '0 0 80px rgba(201,168,76,0.06), 0 0 0 1px rgba(201,168,76,0.08) inset',
        }}
      >
        {/* Corner ornaments */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => {
          const [v, h] = pos.split('-');
          return (
            <div key={pos} style={{
              position: 'absolute',
              [v]: 16, [h]: 16,
              width: 20, height: 20,
              borderTop: v === 'top' ? '1px solid rgba(201,168,76,0.5)' : 'none',
              borderBottom: v === 'bottom' ? '1px solid rgba(201,168,76,0.5)' : 'none',
              borderLeft: h === 'left' ? '1px solid rgba(201,168,76,0.5)' : 'none',
              borderRight: h === 'right' ? '1px solid rgba(201,168,76,0.5)' : 'none',
            }} />
          );
        })}

        {/* Outer decorative ring */}
        <div style={{
          position: 'absolute',
          top: -1,
          left: -1,
          right: -1,
          bottom: -1,
          border: '1px solid rgba(201,168,76,0.08)',
          borderRadius: 4,
          pointerEvents: 'none',
        }} />

        {/* YOU ARE INVITED */}
        <div className="invite-item" style={{
          fontFamily: 'var(--font-archivo), Arial, sans-serif',
          fontStyle: 'italic',
          fontSize: 13,
          letterSpacing: '0.3em',
          color: '#9B2335',
          textTransform: 'uppercase',
          marginBottom: 24,
        }}>
          You Are Invited
        </div>

        {/* Gold rule */}
        <div className="gold-rule invite-item" style={{ marginBottom: 32, opacity: 0.4 }} />

        {/* Main title */}
        <h2 className="invite-item" style={{
          fontFamily: 'var(--font-anton), Impact, sans-serif',
          fontSize: 'clamp(48px, 8vw, 88px)',
          fontWeight: 600,
          lineHeight: 1.0,
          letterSpacing: '0.04em',
          color: '#C9A84C',
          marginBottom: 12,
          textShadow: '0 0 60px rgba(201,168,76,0.2)',
        }}>
          THE RCC OPEN
        </h2>

        {/* Subtitle */}
        <div className="invite-item" style={{
          fontFamily: 'var(--font-archivo), Arial, sans-serif',
          fontSize: 18,
          letterSpacing: '0.18em',
          color: '#C8BFA8',
          textTransform: 'uppercase',
          marginBottom: 40,
          fontVariant: 'small-caps',
        }}>
          Delhi · July 2025
        </div>

        {/* Tagline */}
        <p className="invite-item" style={{
          fontFamily: 'var(--font-archivo), Arial, sans-serif',
          fontStyle: 'italic',
          fontSize: 'clamp(18px, 2.5vw, 26px)',
          color: '#F5F0E8',
          lineHeight: 1.5,
          marginBottom: 20,
          opacity: 0.9,
        }}>
          500+ Players. One Stage. No Casual Entries.
        </p>

        {/* Stats row */}
        <div className="invite-item" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
          marginBottom: 48,
          flexWrap: 'wrap',
        }}>
          {[
            { value: '500+', label: 'Players' },
            { value: 'July', label: 'Month' },
            { value: '2025', label: 'Season' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: 28,
                color: '#E2C97E',
                fontWeight: 400,
                marginBottom: 4,
              }}>
                {item.value}
              </div>
              <div className="text-label">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Gold rule */}
        <div className="gold-rule invite-item" style={{ marginBottom: 40, opacity: 0.4 }} />

        {/* CTA */}
        <a
          href="/events"
          className="btn-gold invite-item"
          style={{ display: 'inline-flex', fontSize: 11, letterSpacing: '0.22em' }}
        >
          Register Your Interest
        </a>

        <div className="invite-item" style={{
          marginTop: 24,
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'rgba(200,191,168,0.5)',
          letterSpacing: '0.05em',
        }}>
          By invitation and merit. Registration subject to committee review.
        </div>
      </div>
    </section>
  );
}
