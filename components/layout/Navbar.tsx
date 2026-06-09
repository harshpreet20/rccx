'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, User, Menu, X } from 'lucide-react';

/* ─── RCC Badge (real logo image) ───────────────────────────────── */
function RccBadge({ size = 70 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/rcc-logo.png"
      alt="Racquets Club Community"
      width={size}
      height={size}
      style={{ flexShrink: 0, objectFit: 'contain' }}
    />
  );
}

/* ─── Nav links ──────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'EVENTS', href: '/events' },
  { label: 'MEMBERSHIP', href: '/membership' },
  { label: 'CONTACT', href: '/contact' },
];

/* ─── Navbar ─────────────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(16px, 3vw, 48px)',
          transition: 'background 0.35s ease, box-shadow 0.35s ease',
          background: scrolled ? 'rgba(10,10,15,0.90)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        {/* ── LEFT: Logo ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <RccBadge size={62} />
          {/* Brand text: hidden on small screens via media query inline workaround */}
          <div className="hidden sm:block" style={{ lineHeight: 1.1 }}>
            <div
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 900,
                fontSize: '15px',
                color: '#ffffff',
                letterSpacing: '0.08em',
              }}
            >
              RACQUETS
            </div>
            <div
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 600,
                fontSize: '9px',
                color: '#D4AF37',
                letterSpacing: '0.15em',
              }}
            >
              CLUB COMMUNITY
            </div>
          </div>
        </div>

        {/* ── CENTER: Nav links (desktop) ── */}
        <div
          className="hidden lg:flex"
          style={{ gap: '28px', alignItems: 'center' }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: pathname === link.href ? '#D4AF37' : 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                position: 'relative',
                paddingBottom: '4px',
                transition: 'color 0.2s',
              }}
            >
              {link.label}
              {pathname === link.href && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#D4AF37',
                    borderRadius: '1px',
                  }}
                />
              )}
            </a>
          ))}
        </div>

        {/* ── RIGHT: Icon row ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            className="hidden lg:inline-flex"
            onClick={() => window.dispatchEvent(new CustomEvent('open-support-modal'))}
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#fff',
              background: '#C21818',
              padding: '8px 16px',
              borderRadius: '6px',
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#a81414')}
            onMouseOut={e => (e.currentTarget.style.background = '#C21818')}
          >
            RAISE A TICKET
          </button>
          <button
            aria-label="Search"
            style={{ background: 'none', border: 'none', padding: '4px', color: 'rgba(255,255,255,0.5)', display: 'flex' }}
          >
            <Search size={18} />
          </button>
          <button
            aria-label="Account"
            style={{ background: 'none', border: 'none', padding: '4px', color: 'rgba(255,255,255,0.7)', display: 'flex' }}
          >
            <User size={18} />
          </button>
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
            style={{ background: 'none', border: 'none', padding: '4px', color: 'rgba(255,255,255,0.9)', display: 'flex' }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 200,
          width: 'min(320px, 85vw)',
          background: 'rgba(10,10,15,0.97)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderLeft: '1px solid rgba(212,175,55,0.12)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '88px 32px 40px',
          gap: '8px',
        }}
      >
        <button
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '6px',
            color: 'rgba(255,255,255,0.7)',
            padding: '6px',
            display: 'flex',
          }}
        >
          <X size={18} />
        </button>

        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.16em',
              color: pathname === link.href ? '#D4AF37' : 'rgba(255,255,255,0.65)',
              textDecoration: 'none',
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              transition: 'color 0.2s',
            }}
          >
            {link.label}
          </a>
        ))}
        <button
          onClick={() => { setMenuOpen(false); window.dispatchEvent(new CustomEvent('open-support-modal')); }}
          style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.12em',
            color: '#fff',
            background: '#C21818',
            padding: '14px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          🎫 RAISE A TICKET
        </button>
      </div>

      {/* Overlay when drawer open */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 150,
            background: 'rgba(0,0,0,0.5)',
          }}
        />
      )}
    </>
  );
}
