'use client';

import NavbarRCC from '@/components/layout/NavbarRCC';
import FooterRCC from '@/components/layout/FooterRCC';
import { SoftAurora } from '@/components/ui/SoftAurora';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

const admins = [
  {
    name: 'Priya Sharma',
    role: 'Women\'s Lead Admin',
    initials: 'PS',
    whatsapp: '+91 98xxx xxxxx',
  },
  {
    name: 'Ankita Verma',
    role: 'Community Admin',
    initials: 'AV',
    whatsapp: '+91 97xxx xxxxx',
  },
  {
    name: 'Riya Kapoor',
    role: 'Safety Lead',
    initials: 'RK',
    whatsapp: '+91 96xxx xxxxx',
  },
];

const commitments = [
  {
    title: 'Safe Spaces',
    body: 'Every RCC session has at least one designated women\'s admin present. Sessions can be halted if any member is uncomfortable.',
  },
  {
    title: 'Named Admins',
    body: 'Our women admins are not anonymous. They are contactable directly. Their names and contact details are listed below.',
  },
  {
    title: 'Zero Tolerance',
    body: 'Any report of discomfort, harassment, or inappropriate behaviour is acted upon immediately. No exceptions.',
  },
];

export default function WomenFirstPage() {
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
        <SoftAurora />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
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
            Women First
          </p>
          <h1
            ref={(el) => addRef(el, 1)}
            style={{
              ...fadeStyle,
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontSize: 'clamp(40px, 6vw, 64px)',
              color: '#F5F0E8',
              lineHeight: 1.15,
              marginBottom: 28,
            }}
          >
            Every woman deserves to feel safe on court.
          </h1>
          <p
            ref={(el) => addRef(el, 2)}
            style={{
              ...fadeStyle,
              fontFamily: '"Montserrat", sans-serif',
              fontSize: 18,
              color: 'rgba(245,240,232,0.6)',
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            This isn't a section of our website. It's how we operate.
          </p>
        </div>
      </section>

      {/* Our Commitment */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <p
          ref={(el) => addRef(el, 3)}
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
          Our Commitment
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {commitments.map((c, i) => (
            <div
              key={c.title}
              ref={(el) => addRef(el, 4 + i)}
              style={{
                ...fadeStyle,
                transitionDelay: `${i * 0.1}s`,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: 12,
                padding: '36px 28px',
              }}
            >
              <h3
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 22,
                  color: '#F5F0E8',
                  marginBottom: 16,
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontSize: 15,
                  color: 'rgba(245,240,232,0.65)',
                  lineHeight: 1.7,
                }}
              >
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Women Admins */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <p
          ref={(el) => addRef(el, 7)}
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
          Women Admins
        </p>
        <h2
          ref={(el) => addRef(el, 8)}
          style={{
            ...fadeStyle,
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(28px, 4vw, 42px)',
            color: '#F5F0E8',
            textAlign: 'center',
            marginBottom: 48,
          }}
        >
          These are your contacts.
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}
        >
          {admins.map((admin, i) => (
            <div
              key={admin.name}
              ref={(el) => addRef(el, 9 + i)}
              style={{
                ...fadeStyle,
                transitionDelay: `${i * 0.12}s`,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: 12,
                padding: '36px 28px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(201,168,76,0.15)',
                  border: '2px solid rgba(201,168,76,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 20,
                  color: '#C9A84C',
                  fontWeight: 700,
                }}
              >
                {admin.initials}
              </div>
              <h3
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 20,
                  color: '#F5F0E8',
                  marginBottom: 6,
                }}
              >
                {admin.name}
              </h3>
              <p
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: 11,
                  color: '#C9A84C',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: 20,
                }}
              >
                {admin.role}
              </p>
              <a
                href={`https://wa.me/${admin.whatsapp.replace(/[^0-9]/g, '')}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(37,211,102,0.12)',
                  border: '1px solid rgba(37,211,102,0.3)',
                  color: '#25D366',
                  fontFamily: '"Montserrat", sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '10px 20px',
                  borderRadius: 8,
                  textDecoration: 'none',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {admin.whatsapp}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Promise */}
      <section style={{ position: 'relative', padding: '80px 24px', overflow: 'hidden' }}>
        <div
          style={{
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderLeft: '4px solid #C9A84C',
            borderRadius: 12,
            padding: '60px 48px',
            maxWidth: 860,
            margin: '0 auto',
          }}
          ref={(el) => addRef(el, 12)}
        >
          <p
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontSize: 'clamp(18px, 3vw, 24px)',
              color: '#F5F0E8',
              lineHeight: 1.8,
              textAlign: 'center',
            }}
          >
            "If you ever feel uncomfortable at an RCC session, you have the right to leave immediately. No explanations needed. Reach out to any admin listed above or DM us on Instagram{' '}
            <a
              href="https://instagram.com/racquetsclubcommunity"
              style={{ color: '#C9A84C', textDecoration: 'none' }}
            >
              @racquetsclubcommunity
            </a>
            . Your safety is non-negotiable."
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px 120px', textAlign: 'center' }}>
        <Link
          href="/join"
          style={{
            display: 'inline-block',
            background: '#C9A84C',
            color: '#050810',
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '0.08em',
            padding: '18px 48px',
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          Join a session →
        </Link>
      </section>

      <FooterRCC />
    </main>
  );
}
