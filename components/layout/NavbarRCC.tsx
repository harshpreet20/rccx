'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Community', href: '/community' },
  { label: 'Tournaments', href: '/tournaments' },
  { label: 'Courts', href: '/courts' },
  { label: 'Events', href: '/events' },
];

export default function NavbarRCC() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: 64,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          padding: '0 clamp(16px, 4vw, 60px)',
          justifyContent: 'space-between',
          transition: 'background 0.4s ease, border-color 0.4s ease',
          background: scrolled ? 'rgba(10,22,40,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.12)' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <a
          href="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.filter = 'drop-shadow(0 0 8px rgba(201,168,76,0.45))'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.filter = 'none'; }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="RCC — Racquets Club Community"
            style={{ flexShrink: 0 }}
          >
            <circle cx="22" cy="22" r="20" stroke="#C9A84C" strokeWidth="1" />
            <circle cx="22" cy="22" r="17.5" stroke="rgba(201,168,76,0.3)" strokeWidth="0.6" />
            <line x1="7.5" y1="9.5" x2="16" y2="9.5" stroke="#9B2335" strokeWidth="0.7" />
            <line x1="28" y1="9.5" x2="36.5" y2="9.5" stroke="#9B2335" strokeWidth="0.7" />
            <circle cx="22" cy="8" r="1.4" fill="#C9A84C" />
            <line x1="19" y1="11" x2="22" y2="9.3" stroke="#C9A84C" strokeWidth="0.8" />
            <line x1="25" y1="11" x2="22" y2="9.3" stroke="#C9A84C" strokeWidth="0.8" />
            <line x1="20" y1="12" x2="22" y2="9.3" stroke="#C9A84C" strokeWidth="0.65" />
            <line x1="24" y1="12" x2="22" y2="9.3" stroke="#C9A84C" strokeWidth="0.65" />
            <line x1="22" y1="12.2" x2="22" y2="9.3" stroke="#C9A84C" strokeWidth="0.65" />
            <text
              x="22"
              y="26.5"
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="13"
              fontWeight="600"
              fill="#C9A84C"
              letterSpacing="-0.5"
            >
              RCC
            </text>
            <text x="8.5" y="29.5" fontFamily="Arial, sans-serif" fontSize="4" fill="rgba(201,168,76,0.5)" letterSpacing="0.2">EST</text>
            <text x="28.5" y="29.5" fontFamily="Arial, sans-serif" fontSize="4" fill="rgba(201,168,76,0.5)" letterSpacing="0.2">2024</text>
            <line x1="10" y1="34" x2="34" y2="34" stroke="#9B2335" strokeWidth="0.5" />
            <text
              x="22"
              y="38.5"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize="4.8"
              fontWeight="700"
              fill="#9B2335"
              letterSpacing="1.2"
            >
              DELHI
            </text>
            <text x="22" y="43" textAnchor="middle" fontSize="3.5" fill="#C9A84C">&#9733;</text>
          </svg>

          <div className="hidden sm:block">
            <div style={{
              fontFamily: 'var(--font-archivo), Arial, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: '#F5F0E8',
              letterSpacing: '0.1em',
              lineHeight: 1.2,
            }}>
              RACQUETS CLUB
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 9,
              color: 'rgba(201,168,76,0.6)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}>
              COMMUNITY · DELHI
            </div>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex" style={{ gap: 36, alignItems: 'center' }}>
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'var(--font-archivo), Arial, sans-serif',
                fontSize: 14,
                letterSpacing: '0.12em',
                color: pathname === link.href ? '#C9A84C' : 'rgba(245,240,232,0.7)',
                textDecoration: 'none',
                position: 'relative',
                paddingBottom: 4,
                transition: 'color 0.2s ease',
                fontVariant: 'small-caps',
                textTransform: 'uppercase',
              }}
              onMouseEnter={e => {
                if (pathname !== link.href) {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#E2C97E';
                }
              }}
              onMouseLeave={e => {
                if (pathname !== link.href) {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(245,240,232,0.7)';
                }
              }}
            >
              {link.label}
              {pathname === link.href && (
                <div style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
                }} />
              )}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href="/join"
            className="btn-gold hidden lg:inline-flex"
            style={{ padding: '9px 20px', fontSize: 10 }}
          >
            Request Membership
          </a>
          <a
            href="/join"
            className="btn-gold lg:hidden"
            style={{ padding: '8px 16px', fontSize: 10 }}
          >
            Join
          </a>
        </div>
      </nav>
    </>
  );
}
