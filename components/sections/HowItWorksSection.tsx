'use client';

const STEPS = [
  { number: '01', title: 'Join RCC', desc: 'Apply via our website or WhatsApp' },
  { number: '02', title: 'Find Players', desc: 'Get matched by skill level and availability' },
  { number: '03', title: 'Book via Hudle', desc: 'Secure your court through our Hudle partnership' },
  { number: '04', title: 'Play', desc: 'Show up. Rally. Compete.' },
  { number: '05', title: 'Make Friends', desc: 'The community extends beyond badminton' },
  { number: '06', title: 'Become Part of RCC', desc: "You're not just a member. You're RCC." },
];

export default function HowItWorksSection() {
  return (
    <section style={{ background: 'transparent', position: 'relative', padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 120px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 24 }}>
            The RCC Experience
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 56px)', color: '#ffffff', lineHeight: 1.15, maxWidth: 580, margin: 0 }}>
            From first rally to lifelong community.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {STEPS.map((step) => (
            <div
              key={step.number}
              style={{
                position: 'relative',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: 12,
                padding: 'clamp(28px, 3vw, 36px)',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.35)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.12)'}
            >
              <div style={{
                position: 'absolute',
                top: 8,
                right: 16,
                fontFamily: 'var(--font-anton)',
                fontSize: 72,
                color: 'rgba(201,168,76,0.1)',
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
              }}>
                {step.number}
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'rgba(201,168,76,0.6)', letterSpacing: '0.12em', marginBottom: 14, textTransform: 'uppercase' }}>
                  Step {step.number}
                </div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 20, fontWeight: 600, color: '#ffffff', marginBottom: 10 }}>
                  {step.title}
                </div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
