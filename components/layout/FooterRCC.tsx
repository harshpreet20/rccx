'use client';

import { MessageCircle } from 'lucide-react';

function InstagramIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

const NAV_COLUMNS = [
  {
    heading: 'Club',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Our Story', href: '/about#story' },
      { label: 'Women First', href: '/about#women-first' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    heading: 'Play',
    links: [
      { label: 'Join RCC', href: '/join' },
      { label: 'Courts', href: '/courts' },
      { label: 'Events', href: '/events' },
      { label: 'Tournaments', href: '/tournaments' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { label: 'Instagram', href: 'https://instagram.com', target: '_blank' },
      { label: 'WhatsApp', href: 'https://wa.me/', target: '_blank' },
      { label: 'Leaderboard', href: '/community' },
      { label: 'Gallery', href: '/gallery' },
    ],
  },
  {
    heading: 'Partners',
    links: [
      { label: 'Hudle', href: 'https://hudle.in', target: '_blank' },
      { label: 'Agarwal Sports', href: '#' },
      { label: 'Become a Partner', href: '/contact' },
    ],
  },
];

export default function FooterRCC() {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #030810 0%, #000000 100%)',
        borderTop: '2px solid rgba(201,168,76,0.15)',
        padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@300;400;600&family=DM+Mono:wght@400;500&display=swap');

        .footer-link {
          font-family: "Montserrat", sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.2s ease;
          display: block;
        }
        .footer-link:hover {
          color: #C9A84C;
        }
      `}</style>

      {/* Watermark wordmark */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: '"Anton", "Impact", sans-serif',
          fontSize: 'clamp(80px, 15vw, 180px)',
          color: 'rgba(201,168,76,0.06)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.02em',
          zIndex: 0,
        }}
      >
        RCC
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Tagline */}
        <div style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '0.2em',
          color: '#C9A84C',
          textTransform: 'uppercase',
          marginBottom: 56,
        }}>
          Safe. Respected. Enriching.
        </div>

        {/* 4-column nav grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 48,
          paddingBottom: 56,
          borderBottom: '1px solid rgba(201,168,76,0.1)',
          marginBottom: 48,
        }}>
          {NAV_COLUMNS.map((col) => (
            <div key={col.heading}>
              <div style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.6)',
                marginBottom: 20,
              }}>
                {col.heading}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={'target' in link ? link.target : undefined}
                    rel={'target' in link ? 'noopener noreferrer' : undefined}
                    className="footer-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Social row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 32,
        }}>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '50%',
              color: 'rgba(255,255,255,0.5)',
              transition: 'border-color 0.2s, color 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = '#C9A84C';
              (e.currentTarget as HTMLAnchorElement).style.color = '#C9A84C';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,168,76,0.2)';
              (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)';
            }}
          >
            <InstagramIcon size={17} />
          </a>

          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '50%',
              color: 'rgba(255,255,255,0.5)',
              transition: 'border-color 0.2s, color 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = '#C9A84C';
              (e.currentTarget as HTMLAnchorElement).style.color = '#C9A84C';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,168,76,0.2)';
              (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)';
            }}
          >
            <MessageCircle size={17} />
          </a>
        </div>

        {/* Partner logos row */}
        <div style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 12,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.25)',
          marginBottom: 48,
          textTransform: 'uppercase',
        }}>
          Hudle &bull; Agarwal Sports &bull; Gravy &amp; Grains
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          paddingBottom: 40,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 24,
        }}>
          <div style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: 11,
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.06em',
          }}>
            &copy; 2025 Racquets Club Community. All rights reserved.
          </div>

          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.25)',
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(201,168,76,0.7)'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.25)'}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
