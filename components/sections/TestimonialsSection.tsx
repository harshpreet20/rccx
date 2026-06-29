'use client';

const TESTIMONIALS = [
  { id: '1', quote: "My first badminton community where I never felt intimidated. Everyone here genuinely wants you to improve.", name: 'Priya S.', label: 'Member since 2023' },
  { id: '2', quote: "My wife feels comfortable attending alone. That says everything about RCC's culture.", name: 'Rahul M.', label: 'Member' },
  { id: '3', quote: "This became our weekend family. We don't just play together — we celebrate birthdays, grab coffee, show up for each other.", name: 'Ankita D.', label: 'Member' },
  { id: '4', quote: "Skill-based grouping made all the difference. I wasn't getting crushed by pros or bored with beginners.", name: 'Vikram K.', label: 'Member' },
  { id: '5', quote: "RCC introduced me to 30 people I'd never have met otherwise. Best decision I made in Delhi.", name: 'Sahil T.', label: 'Member' },
];

export default function TestimonialsSection() {
  return (
    <section style={{ background: 'transparent', position: 'relative', padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 120px)' }}>
      <style>{`.tm-scroll::-webkit-scrollbar { display: none; }`}</style>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 24 }}>
          What Members Say
        </div>
        <h2 style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 56px)', color: '#ffffff', lineHeight: 1.15, marginBottom: 56, maxWidth: 560 }}>
          The court is just the beginning.
        </h2>

        <div className="tm-scroll" style={{ display: 'flex', overflowX: 'auto', gap: 24, paddingBottom: 16, scrollbarWidth: 'none' }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.id} style={{ minWidth: 320, maxWidth: 360, flexShrink: 0, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 16, padding: '36px 32px 32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -8, left: 20, fontFamily: 'var(--font-playfair)', fontSize: 80, color: 'rgba(201,168,76,0.3)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
                &ldquo;
              </div>
              <blockquote style={{ fontFamily: 'var(--font-montserrat)', fontSize: 18, fontWeight: 300, color: '#ffffff', lineHeight: 1.65, marginBottom: 28, position: 'relative', zIndex: 1, marginTop: 24 }}>
                {t.quote}
              </blockquote>
              <div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 13, color: '#C9A84C', marginBottom: 4, letterSpacing: '0.04em' }}>{t.name}</div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'rgba(201,168,76,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t.label}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
