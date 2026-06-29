'use client';

const STATS = [
  { display: '300+', label: 'Active Members' },
  { display: '1,000+', label: 'Games Played' },
  { display: 'Fastest', label: 'Growing Community in Delhi NCR' },
];

const PILLARS = ['Women-First', 'Beginner-Friendly', 'Hudle Partnered'];

export default function AboutRCC() {
  return (
    <section
      style={{
        background: 'transparent',
        position: 'relative',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 120px)',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          marginBottom: 32,
        }}>
          What is RCC
        </div>

        <h2 style={{
          fontFamily: 'var(--font-playfair)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 'clamp(48px, 6vw, 80px)',
          color: '#ffffff',
          lineHeight: 1.1,
          marginBottom: 28,
          maxWidth: 700,
        }}>
          More than<br />badminton.
        </h2>

        <p style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: 20,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.6,
          marginBottom: 20,
          maxWidth: 620,
        }}>
          A community built around respect, safety and meaningful competition.
        </p>

        <p style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: 16,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.8,
          marginBottom: 48,
          maxWidth: 560,
        }}>
          RCC is Delhi&apos;s invite-only badminton community. We organise curated sessions, skill-balanced matches, and tournaments for players who want real community — not just court time.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 72 }}>
          {PILLARS.map((pillar) => (
            <div key={pillar} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
              }}>
                {pillar}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)',
          marginBottom: 64,
          maxWidth: 400,
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 48,
          maxWidth: 680,
        }}>
          {STATS.map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-anton)',
                fontSize: 'clamp(48px, 6vw, 72px)',
                color: '#C9A84C',
                lineHeight: 1,
                marginBottom: 8,
              }}>
                {stat.display}
              </div>
              <div style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.4,
                maxWidth: 140,
                margin: '0 auto',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
