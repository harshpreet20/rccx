'use client';

const ShuttlecockSVG = () => (
  <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <ellipse cx="60" cy="120" rx="22" ry="12" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.7" />
    <ellipse cx="60" cy="120" rx="12" ry="6" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.4" />
    <line x1="60" y1="108" x2="60" y2="20" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.8" />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const r = 38;
      const x2 = 60 + r * Math.sin(rad);
      const y2 = 20 + r * (1 - Math.cos(rad)) * 0.2;
      return <line key={i} x1="60" y1="20" x2={x2} y2={y2} stroke="#C9A84C" strokeWidth="1" strokeOpacity={0.3 + (i % 3) * 0.1} />;
    })}
    <circle cx="60" cy="20" r="14" stroke="#C9A84C" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
    <circle cx="60" cy="20" r="6" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.8" fill="rgba(201,168,76,0.08)" />
  </svg>
);

const GridSVG = () => (
  <svg width="140" height="120" viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    {[0, 1, 2, 3, 4, 5, 6].map(i => (
      <line key={`v${i}`} x1={i * 23 + 1} y1="0" x2={i * 23 + 1} y2="120" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity={0.12 + (i % 2) * 0.08} />
    ))}
    {[0, 1, 2, 3, 4, 5].map(i => (
      <line key={`h${i}`} x1="0" y1={i * 24 + 1} x2="140" y2={i * 24 + 1} stroke="#C9A84C" strokeWidth="0.8" strokeOpacity={0.12 + (i % 2) * 0.08} />
    ))}
    <rect x="20" y="20" width="100" height="80" stroke="#C9A84C" strokeWidth="1.2" strokeOpacity="0.3" fill="none" />
    <line x1="20" y1="60" x2="120" y2="60" stroke="#C9A84C" strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="4 4" />
    <line x1="70" y1="20" x2="70" y2="100" stroke="#C9A84C" strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="4 4" />
  </svg>
);

const PILLS = [
  { label: 'Safe' },
  { label: 'Skill-Balanced' },
  { label: 'Welcoming' },
  { label: 'Curated' },
];

export default function WhyRCCSection() {
  return (
    <section style={{ padding: 'clamp(72px, 10vw, 120px) clamp(20px, 6vw, 120px)', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.25em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 20 }}>
            WHY WE EXIST
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: 'clamp(36px, 5vw, 64px)', color: '#fff', lineHeight: 1.2, maxWidth: 700, margin: 0, fontWeight: 400 }}>
            Most badminton groups are just WhatsApp chats. We wanted something better.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'center', marginBottom: 'clamp(48px, 7vw, 96px)', paddingBottom: 'clamp(48px, 7vw, 96px)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <div>
            <div style={{ width: 40, height: 4, background: '#C9A84C', marginBottom: 24 }} />
            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 3vw, 40px)', color: '#fff', fontWeight: 700, margin: '0 0 16px 0' }}>Safe by design.</h3>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: 16, color: 'rgba(245,240,232,0.65)', lineHeight: 1.8, margin: 0 }}>
              Every RCC session is moderated. Women-first policies, named admins, and a zero-tolerance culture aren&apos;t marketing — they&apos;re how we operate.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.85 }}>
            <ShuttlecockSVG />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'center', marginBottom: 'clamp(56px, 8vw, 88px)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.85 }}>
            <GridSVG />
          </div>
          <div>
            <div style={{ width: 40, height: 4, background: '#C9A84C', marginBottom: 24 }} />
            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 3vw, 40px)', color: '#fff', fontWeight: 700, margin: '0 0 16px 0' }}>Skill-balanced. Always.</h3>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: 16, color: 'rgba(245,240,232,0.65)', lineHeight: 1.8, margin: 0 }}>
              We don&apos;t throw beginners into competitive games. Sessions are curated by skill level. You play people at your level, improve faster, and actually enjoy it.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {PILLS.map((pill) => (
            <div key={pill.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px', border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.04)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(245,240,232,0.85)' }}>
                {pill.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
