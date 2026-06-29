'use client';

// Detailed, recognisable shuttlecock — cork dome + feathered skirt with cross-lacing
const ShuttlecockSVG = () => {
  const feathers = 12;
  const topY = 18;        // cork apex region
  const skirtTopR = 12;   // radius where feathers meet cork
  const skirtBotY = 150;  // bottom of feather skirt
  const skirtBotR = 52;   // radius at feather tips
  const cx = 90;
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Feather blades */}
      {Array.from({ length: feathers }).map((_, i) => {
        const t = (i / (feathers - 1)) - 0.5; // -0.5..0.5 across the fan
        const tipX = cx + t * skirtBotR * 2;
        const baseLX = cx + (t - 0.018) * skirtTopR * 2;
        const baseRX = cx + (t + 0.018) * skirtTopR * 2;
        const tipLX = cx + (t - 0.04) * skirtBotR * 2;
        const tipRX = cx + (t + 0.04) * skirtBotR * 2;
        return (
          <g key={i}>
            <path
              d={`M ${baseLX} ${topY + 8} L ${tipLX} ${skirtBotY} L ${tipRX} ${skirtBotY} L ${baseRX} ${topY + 8} Z`}
              stroke="#C9A84C" strokeWidth="1.1" strokeOpacity="0.55" fill="rgba(201,168,76,0.03)"
            />
            <line x1={cx + t * skirtTopR * 1.6} y1={topY + 10} x2={tipX} y2={skirtBotY - 2}
              stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.4" />
          </g>
        );
      })}
      {/* Cross-lacing — two threads binding the feathers */}
      <path d={`M ${cx - 30} 64 Q ${cx} 78 ${cx + 30} 64`} stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.5" fill="none" />
      <path d={`M ${cx - 40} 96 Q ${cx} 112 ${cx + 40} 96`} stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.45" fill="none" />
      {/* Cork dome */}
      <path d={`M ${cx - skirtTopR} ${topY + 10} Q ${cx - skirtTopR} ${topY - 14} ${cx} ${topY - 14} Q ${cx + skirtTopR} ${topY - 14} ${cx + skirtTopR} ${topY + 10} Z`}
        stroke="#C9A84C" strokeWidth="1.4" strokeOpacity="0.85" fill="rgba(201,168,76,0.06)" />
      <line x1={cx - skirtTopR} y1={topY + 10} x2={cx + skirtTopR} y2={topY + 10} stroke="#C9A84C" strokeWidth="1.2" strokeOpacity="0.7" />
    </svg>
  );
};

// Proper badminton court diagram — outer tramlines, service boxes, centre & net lines
const CourtSVG = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    {/* Court outer boundary (doubles) */}
    <rect x="30" y="14" width="120" height="152" stroke="#C9A84C" strokeWidth="1.4" strokeOpacity="0.75" fill="rgba(201,168,76,0.02)" />
    {/* Singles side lines */}
    <line x1="44" y1="14" x2="44" y2="166" stroke="#C9A84C" strokeWidth="0.9" strokeOpacity="0.45" />
    <line x1="136" y1="14" x2="136" y2="166" stroke="#C9A84C" strokeWidth="0.9" strokeOpacity="0.45" />
    {/* Net line (centre) */}
    <line x1="30" y1="90" x2="150" y2="90" stroke="#C9A84C" strokeWidth="1.6" strokeOpacity="0.85" strokeDasharray="3 3" />
    {/* Short service lines */}
    <line x1="30" y1="66" x2="150" y2="66" stroke="#C9A84C" strokeWidth="0.9" strokeOpacity="0.5" />
    <line x1="30" y1="114" x2="150" y2="114" stroke="#C9A84C" strokeWidth="0.9" strokeOpacity="0.5" />
    {/* Long service lines (doubles) */}
    <line x1="30" y1="26" x2="150" y2="26" stroke="#C9A84C" strokeWidth="0.9" strokeOpacity="0.5" />
    <line x1="30" y1="154" x2="150" y2="154" stroke="#C9A84C" strokeWidth="0.9" strokeOpacity="0.5" />
    {/* Centre line through service courts */}
    <line x1="90" y1="14" x2="90" y2="66" stroke="#C9A84C" strokeWidth="0.9" strokeOpacity="0.5" />
    <line x1="90" y1="114" x2="90" y2="166" stroke="#C9A84C" strokeWidth="0.9" strokeOpacity="0.5" />
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
            <CourtSVG />
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
