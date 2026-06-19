'use client';

import dynamic from 'next/dynamic';
import { MessageCircle, BarChart2, Zap, Brain, CalendarCheck, Shield } from 'lucide-react';

const ProcessIcons = dynamic(
  () => import('@/components/3d/scenes/ProcessIcons'),
  { ssr: false }
);

const STEPS_NOW = [
  {
    icon: <MessageCircle size={22} color="#25D366" />,
    accent: '#25D366',
    label: 'WhatsApp Community',
    desc: 'All active members are part of our WhatsApp community — the heartbeat of RCC between events.',
  },
  {
    icon: <BarChart2 size={22} color="#D4AF37" />,
    accent: '#C9A84C',
    label: 'Session Polls',
    desc: 'We drop polls before every session — date, venue, doubles or singles. You vote, we count, we confirm within hours.',
  },
  {
    icon: <CalendarCheck size={22} color="#C21818" />,
    accent: '#C21818',
    label: 'Show Up & Play',
    desc: 'Venue is announced 48 hrs ahead. Pair up on arrival or get seeded by the organiser. No pre-booking hassle.',
  },
];

const STEPS_FUTURE = [
  {
    icon: <Brain size={22} color="#a78bfa" />,
    accent: '#a78bfa',
    label: 'AI Availability Engine',
    desc: 'Log your weekly slots once. The system learns your schedule, tracks your preferred days, and auto-marks you available.',
  },
  {
    icon: <Zap size={22} color="#D4AF37" />,
    accent: '#C9A84C',
    label: 'Skill-Matched Games',
    desc: "AI pairs you with players at your level for every session — balanced doubles, fair singles, no mismatches.",
  },
  {
    icon: <Shield size={22} color="#4ade80" />,
    accent: '#4ade80',
    label: 'Zero Coordination',
    desc: "You get a notification: your game is confirmed, here's your match, here's the court, see you at 7 PM.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      style={{
        background: '#0A1628',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 6vw, 120px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gold top border */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.35), transparent)' }} />

      {/* Animated shuttlecocks */}
      <svg aria-hidden style={{ position: 'absolute', top: '12%', left: '-3%', width: 32, height: 40, opacity: 0.18, animation: 'shuttle-drift-1 18s linear infinite', pointerEvents: 'none' }} viewBox="0 0 32 40">
        <circle cx="16" cy="7" r="6" fill="#C9A84C" />
        <path d="M10 13 Q16 32 22 13 Q16 18 10 13Z" fill="#C9A84C" opacity="0.7" />
        {[0,1,2,3,4,5,6,7].map(i => <line key={i} x1="16" y1="13" x2={16 + Math.cos((i/8)*Math.PI*2)*11} y2={13 + Math.sin((i/8)*Math.PI*2)*14} stroke="#C9A84C" strokeWidth="0.8" opacity="0.5" />)}
      </svg>
      <svg aria-hidden style={{ position: 'absolute', bottom: '18%', right: '5%', width: 24, height: 32, opacity: 0.14, animation: 'shuttle-drift-2 24s linear infinite', pointerEvents: 'none', transform: 'rotate(45deg)' }} viewBox="0 0 32 40">
        <circle cx="16" cy="7" r="6" fill="#C9A84C" />
        <path d="M10 13 Q16 32 22 13 Q16 18 10 13Z" fill="#C9A84C" opacity="0.7" />
        {[0,1,2,3,4,5,6,7].map(i => <line key={i} x1="16" y1="13" x2={16 + Math.cos((i/8)*Math.PI*2)*11} y2={13 + Math.sin((i/8)*Math.PI*2)*14} stroke="#C9A84C" strokeWidth="0.8" opacity="0.5" />)}
      </svg>
      <style>{`
        @keyframes shuttle-drift-1 { 0%{transform:translate(0,0) rotate(-30deg)} 50%{transform:translate(60vw,30px) rotate(-30deg)} 100%{transform:translate(0,0) rotate(-30deg)} }
        @keyframes shuttle-drift-2 { 0%{transform:translate(0,0) rotate(45deg)} 50%{transform:translate(-40vw,-20px) rotate(45deg)} 100%{transform:translate(0,0) rotate(45deg)} }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* 3D Process Icons */}
        <div className="hidden md:block" style={{ marginBottom: 48 }}>
          <ProcessIcons />
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-block', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.2em', color: '#C21818', textTransform: 'uppercase', marginBottom: 12 }}>
            Community Life
          </div>
          <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(26px, 4vw, 42px)', color: '#fff', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 16 }}>
            How RCC Works
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
            Right now we run on community energy and WhatsApp polls. Soon, an AI engine will handle everything — matching you to the perfect game without lifting a finger.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(520px, 1fr))', gap: 32 }}>

          {/* ── Today ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#C9A84C', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>How It Works Today</span>
              <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {STEPS_NOW.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `rgba(${step.accent === '#25D366' ? '37,211,102' : step.accent === '#D4AF37' ? '201,168,76' : '194,24,24'},0.1)`, border: `1px solid ${step.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 13, color: '#fff', marginBottom: 5, letterSpacing: '0.03em' }}>{step.label}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div style={{ marginTop: 20, background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <MessageCircle size={18} color="#25D366" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 12, color: '#25D366', letterSpacing: '0.06em', marginBottom: 2 }}>JOIN THE WHATSAPP COMMUNITY</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Members get added after approval. Polls go live every week.</div>
              </div>
            </div>
          </div>

          {/* ── Coming Soon ── */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#a78bfa', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>AI Matchmaking — Coming Soon</span>
              <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* Glow behind */}
            <div aria-hidden style={{ position: 'absolute', top: 40, right: -20, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {STEPS_FUTURE.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, background: 'rgba(167,139,250,0.03)', border: '1px solid rgba(167,139,250,0.12)', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `rgba(${step.accent === '#a78bfa' ? '167,139,250' : step.accent === '#D4AF37' ? '201,168,76' : '74,222,128'},0.1)`, border: `1px solid ${step.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 13, color: '#fff', marginBottom: 5, letterSpacing: '0.03em' }}>{step.label}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Teaser badge */}
            <div style={{ marginTop: 20, background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Brain size={18} color="#a78bfa" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 12, color: '#a78bfa', letterSpacing: '0.06em', marginBottom: 2 }}>AVAILABILITY-FIRST SCHEDULING</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Set your free slots once. The AI finds your best match — skill, timing, venue. You just play.</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom stat row */}
        <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {[
            { stat: 'WhatsApp', sub: 'Active community group', color: '#25D366' },
            { stat: 'Weekly Polls', sub: 'Every session decided by vote', color: '#C9A84C' },
            { stat: '48 hrs', sub: 'Venue confirmed before play', color: '#C21818' },
            { stat: 'AI Q4 2025', sub: 'Smart matchmaking target', color: '#a78bfa' },
          ].map(({ stat, sub, color }) => (
            <div key={stat} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px 18px' }}>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 16, color, marginBottom: 4 }}>{stat}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{sub}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
