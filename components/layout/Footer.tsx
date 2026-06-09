'use client';

import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Events', href: '#events' },
  { label: 'Membership', href: '#membership' },
  { label: 'Leaderboard', href: '#leaderboard' },
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: '/contact' },
];

const COMMUNITY_LINKS = [
  { label: 'Member Login', href: '/login' },
  { label: 'Submit Match Result', href: '/submit-result' },
  { label: 'Book a Court', href: '/book' },
  { label: 'Partner With Us', href: '/partner' },
  { label: 'Media Kit', href: '/media-kit' },
];

export default function Footer() {
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleSubscribe(e?: React.FormEvent) {
    e?.preventDefault();
    const email = subEmail.trim();
    if (!email || subStatus === 'loading') return;
    setSubStatus('loading');
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({ email, source: 'footer' });
      if (error) {
        setSubStatus(error.code === '23505' ? 'done' : 'error');
      } else {
        setSubStatus('done');
      }
    } catch {
      setSubStatus('error');
    }
  }
  return (
    <footer
      style={{
        background: '#080810',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .footer-link {
          font-family: var(--font-inter);
          font-size: 14px;
          color: #888899;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #D4AF37; }
        .footer-social-icon {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #888899;
          text-decoration: none;
          transition: all 0.2s;
        }
        .footer-social-icon:hover {
          color: #D4AF37;
          border-color: rgba(212,175,55,0.3);
          background: rgba(212,175,55,0.08);
        }
        .footer-subscribe-btn {
          padding: 10px 14px;
          min-height: 44px;
          background: #C21818;
          border: none;
          border-radius: 6px;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
        }
        .footer-subscribe-btn:hover { background: #D4AF37; }
        .footer-contact-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-inter);
          font-size: 13px;
          color: #888899;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-contact-link:hover { color: #D4AF37; }
        .footer-legal-link {
          font-family: var(--font-inter);
          font-size: 12px;
          color: #888899;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-legal-link:hover { color: #e8e8ec; }
        .footer-hotbot-link {
          font-family: var(--font-inter);
          font-size: 12px;
          color: #888899;
          text-decoration: none;
          transition: color 0.2s;
          letter-spacing: 0.04em;
        }
        .footer-hotbot-link:hover { color: #D4AF37; }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 520px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .footer-newsletter-row { flex-wrap: wrap !important; }
          .footer-newsletter-row .footer-subscribe-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          padding: '64px clamp(16px, 5vw, 120px) 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
          position: 'relative',
        }}
        className="footer-grid"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <img
              src="/rcc-logo.png"
              alt="RCC"
              style={{ height: '40px', width: 'auto' }}
            />
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-bebas)',
                  fontSize: '1.3rem',
                  color: '#D4AF37',
                  lineHeight: 1,
                  letterSpacing: '0.05em',
                }}
              >
                RACQUETS CLUB
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-bebas)',
                  fontSize: '1rem',
                  color: '#e8e8ec',
                  lineHeight: 1,
                  letterSpacing: '0.08em',
                }}
              >
                COMMUNITY
              </div>
            </div>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '13px',
              color: '#888899',
              lineHeight: 1.7,
              marginBottom: '24px',
            }}
          >
            Delhi's elite invite-only badminton community. Where passion meets competition.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="https://www.instagram.com/racquetsclubcommunity/" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://youtube.com/@rccdelhi" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="YouTube">
              <YouTubeIcon />
            </a>
            <a href="https://facebook.com/rccdelhi" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Facebook">
              <FacebookIcon />
            </a>
          </div>
        </div>

        <div>
          <h4
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: '#888899',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="footer-link">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: '#888899',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Community
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {COMMUNITY_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="footer-link">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: '#888899',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Connect
          </h4>

          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '11px',
                color: '#888899',
                marginBottom: '10px',
                letterSpacing: '0.06em',
              }}
            >
              Stay in the loop
            </div>
            {subStatus === 'done' ? (
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#22c55e', padding: '10px 0' }}>
                ✓ You&apos;re subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} noValidate={false}>
                <div className="footer-newsletter-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={subEmail}
                    onChange={e => { setSubEmail(e.target.value); if (subStatus === 'error') setSubStatus('idle'); }}
                    required
                    style={{
                      flex: 1, padding: '10px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${subStatus === 'error' ? 'rgba(194,24,24,0.6)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '6px', color: '#e8e8ec',
                      fontFamily: 'var(--font-inter)', fontSize: '13px',
                      outline: 'none', minWidth: 0,
                    }}
                  />
                  <button className="footer-subscribe-btn" type="submit" aria-label="Subscribe" disabled={subStatus === 'loading'}>
                    {subStatus === 'loading' ? (
                      <span style={{ fontSize: 11 }}>…</span>
                    ) : (
                      <SendIcon />
                    )}
                  </button>
                </div>
                {subStatus === 'error' && (
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#ff6b6b', marginTop: 6 }}>
                    Something went wrong — please try again.
                  </div>
                )}
              </form>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="mailto:rcc@rccdelhi.com" className="footer-contact-link">
              <Mail size={14} />
              rcc@rccdelhi.com
            </a>
            <a href="tel:+919876543210" className="footer-contact-link">
              <Phone size={14} />
              +91 98765 43210
            </a>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 clamp(16px, 5vw, 120px) 32px' }}>
        <div className="divider" style={{ marginBottom: '24px' }} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#888899' }}>
              © 2026 Racquets Club Community
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 4px' }}>|</span>
            <a href="/privacy" className="footer-legal-link">Privacy Policy</a>
            <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 4px' }}>|</span>
            <a href="/terms" className="footer-legal-link">Terms of Service</a>
          </div>

          <a
            href="https://www.hotbotstudios.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-hotbot-link"
          >
            Developed &amp; Marketed by HotBot Studios
          </a>
        </div>
      </div>
    </footer>
  );
}
