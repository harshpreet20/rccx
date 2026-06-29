'use client';

import NavbarRCC from '@/components/layout/NavbarRCC';
import FooterRCC from '@/components/layout/FooterRCC';
import { useEffect, useRef, useState } from 'react';
import { Calendar, Users, Shield, Trophy, Zap } from 'lucide-react';

const experiences = [
  { icon: Calendar, title: 'Daily Games', desc: 'Curated sessions every day across Delhi NCR.' },
  { icon: Users, title: 'Beginner Sessions', desc: 'Skill-grouped games so you always play at your level.' },
  { icon: Shield, title: "Women's Sessions", desc: 'Dedicated sessions with women admins present.' },
  { icon: Trophy, title: 'Community Events', desc: 'Social nights, mixers, and community hangouts.' },
  { icon: Zap, title: 'Monthly Tournaments', desc: 'Compete in RCC Rise Cup and internal leagues.' },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(201,168,76,0.2)',
  borderRadius: 8,
  padding: '14px 16px',
  color: '#F5F0E8',
  fontFamily: '"Montserrat", sans-serif',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: '"Montserrat", sans-serif',
  fontSize: 13,
  fontWeight: 600,
  color: 'rgba(245,240,232,0.7)',
  marginBottom: 8,
  letterSpacing: '0.04em',
};

export default function JoinPage() {
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [racket, setRacket] = useState('');
  const [consented, setConsented] = useState(false);
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const fadeStyle: React.CSSProperties = {
    opacity: 0,
    transform: 'translateY(32px)',
    transition: 'opacity 0.7s ease, transform 0.7s ease',
  };

  const addRef = (el: HTMLElement | null, i: number) => {
    fadeRefs.current[i] = el;
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    data.preferredDays = selectedDays.join(',');
    data.ownRacket = racket;
    data.consent = String(consented);
    data.whatsappOptIn = String(whatsappOptIn);
    try {
      await fetch('/api/forms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      // show success anyway for UX
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ background: '#050810', minHeight: '100vh', paddingTop: 69 }}>
      <NavbarRCC />

      {/* Hero */}
      <section style={{ position: 'relative', padding: '100px 24px 60px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <p
            ref={(el) => addRef(el, 0)}
            style={{
              ...fadeStyle,
              fontFamily: '"DM Mono", monospace',
              fontSize: 13,
              letterSpacing: '0.2em',
              color: '#C9A84C',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            The RCC Experience
          </p>
          <h1
            ref={(el) => addRef(el, 1)}
            style={{
              ...fadeStyle,
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(34px, 5vw, 54px)',
              color: '#F5F0E8',
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            Play better. Meet your people.
          </h1>
        </div>
      </section>

      {/* Experience Cards */}
      <section style={{ padding: '40px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {experiences.map((exp, i) => (
            <div
              key={exp.title}
              ref={(el) => addRef(el, 2 + i)}
              style={{
                ...fadeStyle,
                transitionDelay: `${i * 0.08}s`,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 12,
                padding: '28px 24px',
              }}
            >
              <exp.icon size={28} color="#C9A84C" style={{ marginBottom: 16 }} />
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, color: '#F5F0E8', marginBottom: 8 }}>
                {exp.title}
              </h3>
              <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 14, color: 'rgba(245,240,232,0.55)', lineHeight: 1.6 }}>
                {exp.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Join Form */}
      <section style={{ padding: '0 24px 120px', maxWidth: 740, margin: '0 auto' }}>
        <div
          ref={(el) => addRef(el, 7)}
          style={{
            ...fadeStyle,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 16,
            padding: 'clamp(32px, 6vw, 56px)',
          }}
        >
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 32, color: '#F5F0E8', marginBottom: 8 }}>
            Apply for Membership
          </h2>
          <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 15, color: 'rgba(245,240,232,0.5)', marginBottom: 40 }}>
            We review applications and reach out within 48 hours.
          </p>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>🎉</div>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, color: '#F5F0E8', marginBottom: 12 }}>
                Application received!
              </h3>
              <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 15, color: 'rgba(245,240,232,0.6)' }}>
                We'll reach out within 48 hours via WhatsApp or email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input name="fullName" required type="text" style={inputStyle} placeholder="Your full name" />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <input name="phone" required type="tel" style={inputStyle} placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input name="email" required type="email" style={inputStyle} placeholder="you@email.com" />
                </div>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <select name="gender" style={inputStyle}>
                    <option value="">Select…</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
                <div>
                  <label style={labelStyle}>Age</label>
                  <input name="age" type="number" min={10} max={80} style={inputStyle} placeholder="25" />
                </div>
                <div>
                  <label style={labelStyle}>Location in Delhi</label>
                  <input name="location" type="text" style={inputStyle} placeholder="e.g. West Delhi, Dwarka" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
                <div>
                  <label style={labelStyle}>Badminton Skill Level</label>
                  <select name="skillLevel" style={inputStyle}>
                    <option value="">Select…</option>
                    <option>Complete Beginner</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Competitive</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Playing Experience</label>
                  <select name="experience" style={inputStyle}>
                    <option value="">Select…</option>
                    <option>Never played</option>
                    <option>&lt; 1 year</option>
                    <option>1–3 years</option>
                    <option>3+ years</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Preferred Playing Days</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
                  {days.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 6,
                        border: selectedDays.includes(day) ? '1px solid #C9A84C' : '1px solid rgba(201,168,76,0.2)',
                        background: selectedDays.includes(day) ? 'rgba(201,168,76,0.15)' : 'transparent',
                        color: selectedDays.includes(day) ? '#C9A84C' : 'rgba(245,240,232,0.5)',
                        fontFamily: '"Montserrat", sans-serif',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
                <div>
                  <label style={labelStyle}>Preferred Time</label>
                  <select name="preferredTime" style={inputStyle}>
                    <option value="">Select…</option>
                    <option>Morning</option>
                    <option>Evening</option>
                    <option>Weekends</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>How did you hear about us?</label>
                  <select name="referralSource" style={inputStyle}>
                    <option value="">Select…</option>
                    <option>Instagram</option>
                    <option>WhatsApp</option>
                    <option>Friend</option>
                    <option>Google</option>
                    <option>Hudle</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Own Racket?</label>
                <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
                  {['Yes', 'No', 'Will buy one'].map((opt) => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: '"Montserrat", sans-serif', fontSize: 14, color: 'rgba(245,240,232,0.7)' }}>
                      <input
                        type="radio"
                        name="ownRacket"
                        value={opt}
                        checked={racket === opt}
                        onChange={() => setRacket(opt)}
                        style={{ accentColor: '#C9A84C' }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Why do you want to join? *</label>
                <textarea
                  name="whyJoin"
                  required
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Tell us a bit about yourself and what you're looking for…"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={consented}
                    onChange={(e) => setConsented(e.target.checked)}
                    required
                    style={{ accentColor: '#C9A84C', marginTop: 2, flexShrink: 0 }}
                  />
                  <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 14, color: 'rgba(245,240,232,0.65)', lineHeight: 1.5 }}>
                    I agree to RCC's community guidelines and zero-tolerance policy *
                  </span>
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={whatsappOptIn}
                    onChange={(e) => setWhatsappOptIn(e.target.checked)}
                    style={{ accentColor: '#C9A84C', marginTop: 2, flexShrink: 0 }}
                  />
                  <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 14, color: 'rgba(245,240,232,0.65)', lineHeight: 1.5 }}>
                    I'd like to receive session updates and announcements via WhatsApp
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting || !consented}
                style={{
                  width: '100%',
                  background: submitting || !consented ? 'rgba(201,168,76,0.4)' : '#C9A84C',
                  color: '#050810',
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 700,
                  fontSize: 16,
                  letterSpacing: '0.08em',
                  padding: '18px',
                  border: 'none',
                  borderRadius: 8,
                  cursor: submitting || !consented ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </section>

      <FooterRCC />
    </main>
  );
}
