'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, ArrowRight, Shield, Users, Trophy, Calendar } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { useRecaptcha, verifyRecaptchaToken } from '@/lib/recaptcha';

/* ─── Types ────────────────────────────────────────────────── */
type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';
type MembershipType = 'monthly' | 'quarterly' | 'annual';

interface FormState {
  name: string;
  email: string;
  phone: string;
  skill_level: SkillLevel;
  membership_type: MembershipType;
  referral: string;
}

/* ─── Helpers ──────────────────────────────────────────────── */
function randomAppId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

/* ─── Stat Chip ────────────────────────────────────────────── */
function StatChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 16px',
        borderRadius: 9999,
        border: '1px solid rgba(212,175,55,0.3)',
        background: 'rgba(212,175,55,0.07)',
        color: '#D4AF37',
        fontFamily: 'var(--font-montserrat)',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  );
}

/* ─── Benefit Card ─────────────────────────────────────────── */
function BenefitCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      style={{
        flex: '1 1 260px',
        padding: '32px 28px',
        borderRadius: 16,
        background: 'rgba(17,17,24,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: 'rgba(212,175,55,0.1)',
          border: '1px solid rgba(212,175,55,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#D4AF37',
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontWeight: 700,
          fontSize: '1rem',
          color: '#e8e8ec',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.875rem',
          color: '#888899',
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </motion.div>
  );
}

/* ─── Membership Type Card ─────────────────────────────────── */
function MembershipCard({
  type,
  label,
  price,
  note,
  selected,
  onSelect,
}: {
  type: MembershipType;
  label: string;
  price: string;
  note: string;
  selected: boolean;
  onSelect: (t: MembershipType) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      style={{
        flex: '1 1 80px',
        padding: '16px 12px',
        minHeight: '44px',
        borderRadius: 12,
        border: selected
          ? '1px solid rgba(212,175,55,0.6)'
          : '1px solid rgba(255,255,255,0.08)',
        background: selected ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.03)',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s ease',
        outline: 'none',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-bebas)',
          fontSize: '1.3rem',
          letterSpacing: '0.06em',
          color: selected ? '#D4AF37' : '#e8e8ec',
          lineHeight: 1.1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontWeight: 700,
          fontSize: '0.8rem',
          color: selected ? '#D4AF37' : '#888899',
          marginTop: 4,
        }}
      >
        {price}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.7rem',
          color: '#888899',
          marginTop: 2,
        }}
      >
        {note}
      </div>
    </button>
  );
}

/* ─── Process Step ─────────────────────────────────────────── */
function ProcessStep({
  number,
  title,
  description,
  isLast,
}: {
  number: number;
  title: string;
  description: string;
  isLast: boolean;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      {/* connector line */}
      {!isLast && (
        <div
          style={{
            position: 'absolute',
            top: 22,
            left: 'calc(50% + 22px)',
            right: 'calc(-50% + 22px)',
            height: 1,
            background: 'linear-gradient(90deg, rgba(212,175,55,0.4), rgba(212,175,55,0.1))',
            zIndex: 0,
          }}
        />
      )}
      {/* circle */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '2px solid #D4AF37',
          background: 'rgba(212,175,55,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-bebas)',
          fontSize: '1.2rem',
          color: '#D4AF37',
          zIndex: 1,
          position: 'relative',
        }}
      >
        {number}
      </div>
      <h4
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontWeight: 700,
          fontSize: '0.85rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#e8e8ec',
          marginTop: 14,
          textAlign: 'center',
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.8rem',
          color: '#888899',
          textAlign: 'center',
          marginTop: 6,
          lineHeight: 1.55,
          maxWidth: 180,
        }}
      >
        {description}
      </p>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function MembershipPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    skill_level: 'intermediate',
    membership_type: 'monthly',
    referral: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [appId, setAppId] = useState('');
  const [error, setError] = useState('');
  const { executeRecaptcha } = useRecaptcha();

  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: '-60px' });
  const processRef = useRef(null);
  const processInView = useInView(processRef, { once: true, margin: '-60px' });

  function update(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const token = await executeRecaptcha('membership_form');
    if (token) {
      const passed = await verifyRecaptchaToken(token);
      if (!passed) {
        setError('Security check failed. Please try again.');
        setSubmitting(false);
        return;
      }
    }

    const { error: dbError } = await supabase.from('members').insert({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      skill_level: form.skill_level,
      membership_type: form.membership_type,
      status: 'pending',
    });

    setSubmitting(false);

    if (dbError) {
      if (dbError.code === '23505') {
        setError('This email is already registered.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      return;
    }

    const generatedAppId = randomAppId();
    setAppId(generatedAppId);
    setSuccess(true);

    // Fire-and-forget: confirmation to applicant + admin notification
    fetch('/api/email/notify-membership', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        skill_level: form.skill_level,
        membership_type: form.membership_type,
        app_id: generatedAppId,
      }),
    }).catch(() => {});
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: '#e8e8ec',
    fontFamily: 'var(--font-inter)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-montserrat)',
    fontWeight: 600,
    fontSize: '0.72rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#888899',
    marginBottom: 8,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e8e8ec' }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 120,
          paddingBottom: 80,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(194,24,24,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ position: 'relative', zIndex: 1, padding: '0 24px' }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(3.5rem, 10vw, 7rem)',
              letterSpacing: '0.04em',
              lineHeight: 1,
              color: '#e8e8ec',
            }}
          >
            JOIN THE
          </h1>
          <h1
            className="text-gradient-gold"
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(3.5rem, 10vw, 7rem)',
              letterSpacing: '0.04em',
              lineHeight: 1,
              marginBottom: 28,
            }}
          >
            INNER CIRCLE
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
              color: '#888899',
              maxWidth: 480,
              margin: '0 auto 36px',
              lineHeight: 1.65,
            }}
          >
            Delhi&apos;s most elite invite-only badminton community.
            <br />
            Not everyone gets in.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <StatChip label="200+ Members" />
            <StatChip label="Invite Only" />
            <StatChip label="Est. 2019" />
          </div>
        </motion.div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#D4AF37',
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          Membership Benefits
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            letterSpacing: '0.04em',
            textAlign: 'center',
            color: '#e8e8ec',
            marginBottom: 48,
          }}
        >
          WHAT YOU GET
        </motion.h2>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <BenefitCard
            icon={<Trophy size={22} />}
            title="Premium Courts"
            description="Access to top Delhi venues — Siri Fort, DDA Vasant Kunj, and more. Reserved slots so you never wait."
            delay={0}
          />
          <BenefitCard
            icon={<Shield size={22} />}
            title="Ranked Play"
            description="ELO-based matchmaking. Every game counts towards your ranking. Compete with players at your level."
            delay={0.1}
          />
          <BenefitCard
            icon={<Users size={22} />}
            title="Community"
            description="Monthly tournaments, smash nights, and an invite-only network of Delhi's top badminton players."
            delay={0.2}
          />
        </div>
      </section>

      {/* ── Application Form ──────────────────────────────────── */}
      <section style={{ padding: '0 24px 100px' }}>
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 40 }}
          animate={formInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            maxWidth: 560,
            margin: '0 auto',
            padding: 'clamp(28px, 5vw, 48px)',
            borderRadius: 20,
            background: 'rgba(17,17,24,0.8)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {success ? (
            /* ── Success State ── */
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  border: '2px solid #D4AF37',
                  background: 'rgba(212,175,55,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 28px',
                }}
              >
                <Check size={32} color="#D4AF37" strokeWidth={2.5} />
              </div>

              <h2
                className="text-gradient-gold"
                style={{
                  fontFamily: 'var(--font-bebas)',
                  fontSize: '2.4rem',
                  letterSpacing: '0.06em',
                  marginBottom: 16,
                }}
              >
                APPLICATION SUBMITTED
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.9rem',
                  color: '#888899',
                  lineHeight: 1.65,
                  marginBottom: 28,
                  maxWidth: 380,
                  margin: '0 auto 28px',
                }}
              >
                We review applications personally. You&apos;ll hear from us within 48 hours.
              </p>

              <div
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1px solid rgba(212,175,55,0.25)',
                  background: 'rgba(212,175,55,0.05)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#888899',
                  }}
                >
                  Application ID:{' '}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    letterSpacing: '0.08em',
                    color: '#D4AF37',
                  }}
                >
                  RCC-APP-{appId}
                </span>
              </div>
            </div>
          ) : (
            /* ── Form State ── */
            <>
              <div style={{ marginBottom: 32 }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '2rem',
                    letterSpacing: '0.05em',
                    color: '#e8e8ec',
                    marginBottom: 6,
                  }}
                >
                  APPLY FOR MEMBERSHIP
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.85rem',
                    color: '#888899',
                  }}
                >
                  All fields marked are required. We review every application personally.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Full Name */}
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>

                {/* Skill Level */}
                <div>
                  <label style={labelStyle}>Skill Level *</label>
                  <select
                    required
                    value={form.skill_level}
                    onChange={e => update('skill_level', e.target.value)}
                    style={{
                      ...inputStyle,
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888899' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      paddingRight: 40,
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="elite">Elite</option>
                  </select>
                </div>

                {/* Membership Type */}
                <div>
                  <label style={labelStyle}>Membership Type *</label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <MembershipCard
                      type="monthly"
                      label="Monthly"
                      price="₹1,499/mo"
                      note="Flexible"
                      selected={form.membership_type === 'monthly'}
                      onSelect={t => update('membership_type', t)}
                    />
                    <MembershipCard
                      type="quarterly"
                      label="Quarterly"
                      price="₹3,999/qtr"
                      note="Save 11%"
                      selected={form.membership_type === 'quarterly'}
                      onSelect={t => update('membership_type', t)}
                    />
                    <MembershipCard
                      type="annual"
                      label="Annual"
                      price="₹13,999/yr"
                      note="Best value"
                      selected={form.membership_type === 'annual'}
                      onSelect={t => update('membership_type', t)}
                    />
                  </div>
                </div>

                {/* Referral */}
                <div>
                  <label style={labelStyle}>How did you hear about us? (optional)</label>
                  <input
                    type="text"
                    placeholder="Friend, social media, tournament…"
                    value={form.referral}
                    onChange={e => update('referral', e.target.value)}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 8,
                      background: 'rgba(194,24,24,0.1)',
                      border: '1px solid rgba(194,24,24,0.35)',
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.85rem',
                      color: '#f87171',
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    marginTop: 4,
                    padding: '14px 24px',
                    borderRadius: 10,
                    border: 'none',
                    background: submitting ? 'rgba(194,24,24,0.5)' : '#C21818',
                    color: '#fff',
                    fontFamily: 'var(--font-montserrat)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'background 0.2s, transform 0.15s',
                  }}
                  onMouseEnter={e => {
                    if (!submitting) e.currentTarget.style.background = '#D4AF37';
                  }}
                  onMouseLeave={e => {
                    if (!submitting) e.currentTarget.style.background = '#C21818';
                  }}
                >
                  {submitting ? (
                    'Submitting…'
                  ) : (
                    <>
                      APPLY FOR MEMBERSHIP
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </section>

      {/* ── The Process ──────────────────────────────────────── */}
      <section
        ref={processRef}
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '0 24px 120px',
          textAlign: 'center',
        }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={processInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#D4AF37',
            marginBottom: 12,
          }}
        >
          How It Works
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={processInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            letterSpacing: '0.04em',
            color: '#e8e8ec',
            marginBottom: 60,
          }}
        >
          THE PROCESS
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={processInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}
        >
          <ProcessStep
            number={1}
            title="Apply"
            description="Fill the form. Tell us about your game, your level, and what you're looking for."
            isLast={false}
          />
          <ProcessStep
            number={2}
            title="Review"
            description="We verify your skill level and assess your fit with the community personally."
            isLast={false}
          />
          <ProcessStep
            number={3}
            title="Welcome"
            description="Get your invite. Join the court. You're now part of Delhi's most elite badminton circle."
            isLast={true}
          />
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
