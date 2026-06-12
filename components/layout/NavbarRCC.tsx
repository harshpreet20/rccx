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
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

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
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(201,168,76,0.35)',
            boxShadow: '0 0 0 3px rgba(201,168,76,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 16,
              fontWeight: 600,
              color: '#C9A84C',
              letterSpacing: '-0.02em',
            }}>RC</span>
          </div>
          <div className="hidden sm:block">
            <div style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
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
                fontFamily: 'var(--font-cormorant), Georgia, serif',
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
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              width: 36, height: 36,
              background: 'none', border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 2,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 5, cursor: 'pointer', padding: 8,
            }}
          >
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 16, height: 1,
                background: '#C9A84C',
                transition: 'all 0.2s ease',
                opacity: menuOpen && i === 1 ? 0 : 1,
                transform: menuOpen
                  ? i === 0 ? 'rotate(45deg) translate(4px, 4px)'
                  : i === 2 ? 'rotate(-45deg) translate(4px, -4px)' : 'none'
                  : 'none',
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: 'min(300px, 85vw)',
        zIndex: 999,
        background: 'rgba(10,22,40,0.98)',
        backdropFilter: 'blur(24px)',
        borderLeft: '1px solid rgba(201,168,76,0.15)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '80px 32px 40px',
        gap: 4,
      }}>
        {NAV_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 22,
              color: pathname === link.href ? '#C9A84C' : 'rgba(245,240,232,0.7)',
              textDecoration: 'none',
              padding: '14px 0',
              borderBottom: '1px solid rgba(201,168,76,0.08)',
              fontVariant: 'small-caps',
              letterSpacing: '0.12em',
            }}
          >
            {link.label}
          </a>
        ))}
        <a
          href="/join"
          className="btn-gold"
          style={{ marginTop: 24, textAlign: 'center', justifyContent: 'center' }}
          onClick={() => setMenuOpen(false)}
        >
          Request Membership
        </a>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 998,
            background: 'rgba(0,0,0,0.6)',
          }}
        />
      )}
    </>
  );
}
