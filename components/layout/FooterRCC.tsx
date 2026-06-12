'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NAV_COLUMNS = [
  {
    heading: 'Club',
    links: [
      { label: 'About RCC', href: '/about' },
      { label: 'Membership', href: '/membership' },
      { label: 'Community', href: '/community' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Play',
    links: [
      { label: 'Book a Court', href: '/courts' },
      { label: 'Tournaments', href: '/tournaments' },
      { label: 'Ranked Play', href: '/events' },
      { label: 'July 2025 Open', href: '/events' },
    ],
  },
  {
    heading: 'Members',
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'My Profile', href: '/profile' },
      { label: 'Rankings', href: '/community' },
      { label: 'Admin', href: '/admin' },
    ],
  },
];

export default function FooterRCC() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(sectionRef.current,
      { opacity: 0 },
      {
        opacity: 1, duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
        },
      }
    );
  }, []);

  return (
    <footer
      ref={sectionRef}
      style={{
        background: 'linear-gradient(180deg, #060E1C 0%, #030A14 100%)',
        borderTop: '1px solid rgba(201,168,76,0.12)',
        padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Portal ring above crest */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.25)',
          boxShadow: '0 0 0 6px rgba(201,168,76,0.04), inset 0 0 0 1px rgba(201,168,76,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '1px solid rgba(201,168,76,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Crest monogram */}
            <span style={{
              fontFamily: 'var(--font-archivo), Arial, sans-serif',
              fontSize: 36,
              fontWeight: 600,
              color: '#C9A84C',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}>
              RC
            </span>
          </div>
        </div>
      </div>

      {/* Nav grid */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 48,
        paddingBottom: 60,
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        marginBottom: 40,
      }}>
        {NAV_COLUMNS.map(col => (
          <div key={col.heading}>
            <div className="text-label" style={{ color: 'rgba(201,168,76,0.6)', marginBottom: 20 }}>
              {col.heading}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {col.links.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{
                    fontFamily: 'var(--font-archivo), Arial, sans-serif',
                    fontSize: 16,
                    color: '#C8BFA8',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    letterSpacing: '0.02em',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#C9A84C';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#C8BFA8';
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        paddingBottom: 40,
      }}>
        <div style={{
          fontFamily: 'var(--font-dm-mono), monospace',
          fontSize: 11,
          color: 'rgba(200,191,168,0.4)',
          letterSpacing: '0.06em',
        }}>
          © 2025 Racquets Club Community. All rights reserved.
        </div>

        <div style={{
          fontFamily: 'var(--font-archivo), Arial, sans-serif',
          fontSize: 14,
          color: '#9B2335',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontVariant: 'small-caps',
        }}>
          Delhi · Est. 2024
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms'].map(item => (
            <a key={item} href="#" style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'rgba(200,191,168,0.4)',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(201,168,76,0.6)'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(200,191,168,0.4)'}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
