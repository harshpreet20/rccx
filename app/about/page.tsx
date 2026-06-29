'use client';

import NavbarRCC from '@/components/layout/NavbarRCC';
import FooterRCC from '@/components/layout/FooterRCC';
import { useEffect, useRef } from 'react';

const timeline = [
  { year: '2023', text: 'Founded. First 20 members.' },
  { year: 'Early 2024', text: '100+ members. Hudle partnership signed.' },
  { year: 'Late 2024', text: '200+ members. First RCC Rise Cup tournament.' },
  { year: '2025', text: '353+ members. 11 venue partners. Delhi NCR\'s fastest growing badminton community.' },
];

const comparison = [
  ['Random games', 'Curated sessions'],
  ['No moderation', 'Women-first culture'],
  ['Skill mismatch', 'Skill-balanced grouping'],
  ['Anonymous players', 'Named community'],
  ['No accountability', 'Zero-tolerance policy'],
  ['Disorganised', 'Hudle-powered bookings'],
];

export default function AboutPage() {
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const fadeStyle: React.CSSProperties = {
    opacity: 0,
    transform: 'translateY(32px)',
    transition: 'opacity 0.7s ease, transform 0.7s ease',
  };

  const addRef = (el: HTMLElement | null, i: number) => {
    fadeRefs.current[i] = el;
  };

  return (
    <main style={{ background: '#050810', minHeight: '100vh', paddingTop: 69 }}>
      <NavbarRCC />

      {/* Hero */}
      <section style={{ position: 'relative', padding: '100px 24px 80px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto' }}>
          <p
            ref={(el) => addRef(el, 0)}
            style={{
              ...fadeStyle,
              fontFamily: '"DM Mono", monospace',
              fontSize: 13,
              letterSpacing: '0.2em',
              color: '#C9A84C',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            Our Story
          </p>
          <h1
            ref={(el) => addRef(el, 1)}
            style={{
              ...fadeStyle,
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(34px, 5vw, 56px)',
              color: '#F5F0E8',
              lineHeight: 1.15,
              marginBottom: 32,
            }}
          >
            Built for people who wanted more than a WhatsApp group.
          </h1>
          <p
            ref={(el) => addRef(el, 2)}
            style={{
              ...fadeStyle,
              fontFamily: '"Montserrat", sans-serif',
              fontSize: 17,
              color: 'rgba(245,240,232,0.65)',
              lineHeight: 1.8,
              maxWidth: 680,
              margin: '0 auto',
            }}
          >
            RCC was founded in 2023 by a group of Delhi badminton players frustrated by disorganised, unsafe, and skill-mismatched pickup games. We set out to build India's most respected community badminton club. Today, with 353+ members and a 90.9% retention rate, we're just getting started.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            { label: 'Mission', text: 'Create India\'s most respected badminton community.' },
            { label: 'Vision', text: 'A city where anyone can find safe, skill-balanced badminton regardless of gender or experience.' },
          ].map((item, i) => (
            <div
              key={item.label}
              ref={(el) => addRef(el, 3 + i)}
              style={{
                ...fadeStyle,
                transitionDelay: `${i * 0.12}s`,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.25)',
                backdropFilter: 'blur(12px)',
                borderRadius: 12,
                padding: '48px 36px',
              }}
            >
              <p
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  color: '#C9A84C',
                  textTransform: 'uppercase',
                  marginBottom: 20,
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 22,
                  color: '#F5F0E8',
                  lineHeight: 1.5,
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section style={{ padding: '80px 24px', maxWidth: 860, margin: '0 auto' }}>
        <p
          ref={(el) => addRef(el, 5)}
          style={{
            ...fadeStyle,
            fontFamily: '"DM Mono", monospace',
            fontSize: 12,
            letterSpacing: '0.2em',
            color: '#C9A84C',
            textTransform: 'uppercase',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          Why RCC
        </p>
        <h2
          ref={(el) => addRef(el, 6)}
          style={{
            ...fadeStyle,
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(26px, 4vw, 40px)',
            color: '#F5F0E8',
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          This is the difference.
        </h2>
        <div
          ref={(el) => addRef(el, 7)}
          style={{ ...fadeStyle, border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, overflow: 'hidden' }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: 'rgba(201,168,76,0.12)',
              padding: '16px 24px',
              borderBottom: '1px solid rgba(201,168,76,0.2)',
            }}
          >
            <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 13, fontWeight: 700, color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Typical WhatsApp Group</span>
            <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 13, fontWeight: 700, color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase' }}>RCC</span>
          </div>
          {comparison.map(([left, right], i) => (
            <div
              key={left}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                padding: '16px 24px',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                borderBottom: i < comparison.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 14, color: 'rgba(245,240,232,0.45)' }}>{left}</span>
              <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 14, color: '#F5F0E8', fontWeight: 600 }}>{right}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section style={{ padding: '80px 24px', maxWidth: 700, margin: '0 auto' }}>
        <p
          ref={(el) => addRef(el, 8)}
          style={{
            ...fadeStyle,
            fontFamily: '"DM Mono", monospace',
            fontSize: 12,
            letterSpacing: '0.2em',
            color: '#C9A84C',
            textTransform: 'uppercase',
            marginBottom: 32,
            textAlign: 'center',
          }}
        >
          Founder
        </p>
        <div
          ref={(el) => addRef(el, 9)}
          style={{
            ...fadeStyle,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: 12,
            padding: '40px 36px',
            display: 'flex',
            gap: 28,
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(201,168,76,0.15)',
              border: '2px solid rgba(201,168,76,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"Playfair Display", serif',
              fontSize: 20,
              color: '#C9A84C',
              fontWeight: 700,
            }}
          >
            HS
          </div>
          <div>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, color: '#F5F0E8', marginBottom: 4 }}>
              Harshpreet Singh
            </h3>
            <p style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: '#C9A84C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
              Founder, RCC
            </p>
            <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 15, color: 'rgba(245,240,232,0.65)', lineHeight: 1.7 }}>
              Former player turned community builder. Founded RCC in 2023 with a mission to make Delhi's badminton scene safer, more inclusive, and more connected.
            </p>
          </div>
        </div>
      </section>

      {/* Growth Timeline */}
      <section style={{ padding: '80px 24px 120px', maxWidth: 700, margin: '0 auto' }}>
        <p
          ref={(el) => addRef(el, 10)}
          style={{
            ...fadeStyle,
            fontFamily: '"DM Mono", monospace',
            fontSize: 12,
            letterSpacing: '0.2em',
            color: '#C9A84C',
            textTransform: 'uppercase',
            marginBottom: 48,
            textAlign: 'center',
          }}
        >
          Growth
        </p>
        <div style={{ position: 'relative', paddingLeft: 40 }}>
          <div
            style={{
              position: 'absolute',
              left: 10,
              top: 8,
              bottom: 8,
              width: 2,
              background: 'rgba(201,168,76,0.25)',
            }}
          />
          {timeline.map((item, i) => (
            <div
              key={item.year}
              ref={(el) => addRef(el, 11 + i)}
              style={{
                ...fadeStyle,
                transitionDelay: `${i * 0.1}s`,
                position: 'relative',
                marginBottom: i < timeline.length - 1 ? 40 : 0,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: -34,
                  top: 6,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#C9A84C',
                  border: '2px solid #050810',
                  boxShadow: '0 0 0 2px rgba(201,168,76,0.3)',
                }}
              />
              <p style={{ fontFamily: '"DM Mono", monospace', fontSize: 12, color: '#C9A84C', letterSpacing: '0.15em', marginBottom: 6 }}>
                {item.year}
              </p>
              <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 16, color: 'rgba(245,240,232,0.8)', lineHeight: 1.6 }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <FooterRCC />
    </main>
  );
}
