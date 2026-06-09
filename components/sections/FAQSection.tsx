'use client';

import { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

const VENUES = [
  {
    name: 'JLDAV School',
    area: 'Paschim Vihar',
    city: 'West Delhi',
    maps: 'https://maps.google.com/?q=JLDAV+School+Paschim+Vihar+Delhi',
    badge: 'Current Preferred',
    badgeColor: '#D4AF37',
    note: 'Enclosed courts with exhaust ventilation — ideal for summer play',
  },
  {
    name: 'DTEA Senior Secondary School',
    area: 'Janakpuri',
    city: 'West Delhi',
    maps: 'https://maps.google.com/?q=DTEA+School+Janakpuri+Delhi',
    badge: 'Regular Venue',
    badgeColor: 'rgba(255,255,255,0.4)',
    note: 'Spacious courts, great for doubles tournaments',
  },
];

const FAQS = [
  {
    q: 'Where does RCC play?',
    a: 'We primarily play at JLDAV School, Paschim Vihar and DTEA Janakpuri — both in West Delhi. We rotate across multiple courts in the area, but currently favour JLDAV for its enclosed layout and exhaust ventilation, which makes it ideal during hot and humid months.',
  },
  {
    q: 'How do I join RCC?',
    a: 'RCC is invite-only. You can apply for membership through our website and our team will review your application. We evaluate skill level, community fit, and availability. New members are typically onboarded through a guest session first.',
  },
  {
    q: 'What skill levels are welcome?',
    a: 'We welcome Beginner, Intermediate, Advanced, and Elite players. Matches are skill-matched so you always play with people at your level. We believe every player improves fastest when challenged appropriately.',
  },
  {
    q: 'How often do you play, and how are sessions scheduled?',
    a: "Most members play 3–4 times per week. Right now, sessions are scheduled via polls in our WhatsApp community group — we drop a poll, members vote on date and venue, and we confirm within hours. We're building AI-powered matchmaking that will schedule you into games automatically based on your availability, skill level, and partner preferences — no more polls, just a notification saying your game is confirmed.",
  },
  {
    q: 'What is a Community Partner?',
    a: "Community Partners are clubs, academies, or organisations that partner with RCC to bring their members into our events. Partner members play under their club's banner, wear community jerseys, and compete in our tournaments — creating a rich, multi-community competitive environment.",
  },
  {
    q: 'Do you organise tournaments?',
    a: 'Yes. RCC runs the full spectrum — from internal Ladder Leagues and Smash Nights to multi-community tournaments with brand sponsorships, prize pools, and sundowner evenings. Events span 1–3 days and are held at our West Delhi venues.',
  },
  {
    q: 'Is there a membership fee?',
    a: 'Yes, membership fees vary by plan (Monthly, Quarterly, Annual). Fees cover court access, match organisation, coaching sessions, and entry to member-only events. Contact us for the latest pricing.',
  },
  {
    q: 'How do I register for an event?',
    a: "Event registrations open on the website under the Events section. Once an event is published, you'll find a registration button. Registered players receive a confirmation email with their ticket ID. Walk-ins are not accepted for tournaments.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: 16,
        }}
      >
        <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 14, color: open ? '#D4AF37' : '#e8e8ec', letterSpacing: '0.02em', transition: 'color 0.2s' }}>
          {q}
        </span>
        <ChevronDown size={16} color={open ? '#D4AF37' : 'rgba(255,255,255,0.3)'} style={{ flexShrink: 0, transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>
      {open && (
        <div style={{ paddingBottom: 18, paddingRight: 32 }}>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: 0 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section
      id="faq"
      style={{
        background: '#060810',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 6vw, 120px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent)',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── WHERE WE PLAY ── */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <MapPin size={16} color="#D4AF37" />
            <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.2em', color: '#D4AF37', textTransform: 'uppercase' }}>
              West Delhi
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(24px, 3.5vw, 38px)', color: '#fff', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
            Where We Play
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 540, lineHeight: 1.7, marginBottom: 36 }}>
            Multiple courts across West Delhi. Venue is announced 48 hrs before each session — we go where the conditions are best.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {VENUES.map(v => (
              <a
                key={v.name}
                href={v.maps}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: '22px 24px', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,175,55,0.3)';
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(212,175,55,0.04)';
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={16} color="#D4AF37" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', color: v.badgeColor, border: `1px solid ${v.badgeColor}30` }}>
                      {v.badge}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 4, letterSpacing: '0.02em' }}>{v.name}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#D4AF37', marginBottom: 10 }}>{v.area} · {v.city}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{v.note}</div>
                  <div style={{ marginTop: 14, fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', color: 'rgba(212,175,55,0.6)', textTransform: 'uppercase' }}>
                    Open in Maps ↗
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.2em', color: '#C21818', textTransform: 'uppercase' }}>
              Need to Know
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(24px, 3.5vw, 38px)', color: '#fff', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 40 }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '0 60px' }}>
            {[FAQS.slice(0, Math.ceil(FAQS.length / 2)), FAQS.slice(Math.ceil(FAQS.length / 2))].map((col, ci) => (
              <div key={ci}>
                {col.map(item => <FAQItem key={item.q} q={item.q} a={item.a} />)}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
