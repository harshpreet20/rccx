'use client';

const CTA_BUTTONS = [
  { label: 'Join WhatsApp', href: 'https://chat.whatsapp.com/rcc', variant: 'gold' as const },
  { label: 'Book on Hudle', href: 'https://hudle.in', variant: 'ghost-gold' as const },
  { label: 'Follow Instagram', href: 'https://instagram.com/racquetsclubcommunity', variant: 'ghost-white' as const },
];

export default function JoinCTASection() {
  return (
    <section style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(72px, 10vw, 120px) clamp(20px, 6vw, 80px)',
      textAlign: 'center',
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', height: '120%', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(201,168,76,0.2)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'rgba(201,168,76,0.2)' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, width: '100%' }}>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.3em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 24 }}>
          READY TO PLAY?
        </div>
        <h2 style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(40px, 8vw, 72px)', color: '#fff', fontWeight: 400, lineHeight: 1.05, letterSpacing: '0.02em', textTransform: 'uppercase', margin: '0 0 20px 0' }}>
          Join Delhi&apos;s most respected<br />badminton community.
        </h2>
        <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: 18, color: 'rgba(245,240,232,0.45)', lineHeight: 1.7, margin: '0 0 48px 0' }}>
          First session jitters are normal. We&apos;ve got you.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 16 }}>
          {CTA_BUTTONS.map((btn) => {
            const isGold = btn.variant === 'gold';
            const isGhostGold = btn.variant === 'ghost-gold';
            return (
              <a
                key={btn.label}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px 28px',
                  borderRadius: 2,
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s, transform 0.2s',
                  ...(isGold
                    ? { background: '#C9A84C', color: '#000', border: '1px solid #C9A84C' }
                    : isGhostGold
                    ? { background: 'transparent', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.6)' }
                    : { background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }),
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = '0.8'; el.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }}
              >
                {btn.label}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
