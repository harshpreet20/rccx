'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRecaptcha, verifyRecaptchaToken } from '@/lib/recaptcha';
import { Check, ArrowRight } from 'lucide-react';

export default function MembershipSection() {
  const selected = 'monthly';
  const [form, setForm] = useState({ name: '', email: '', phone: '', skill_level: 'intermediate' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { executeRecaptcha } = useRecaptcha();

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = await executeRecaptcha('membership_section');
    if (token) {
      const passed = await verifyRecaptchaToken(token);
      if (!passed) {
        setError('Security check failed. Please try again.');
        setLoading(false);
        return;
      }
    }
    const { error: err } = await supabase.from('members').insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      skill_level: form.skill_level,
      membership_type: selected,
      status: 'pending',
    });
    if (err) setError('Something went wrong. Please try again.');
    else setSuccess(true);
    setLoading(false);
  }

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '80px clamp(16px, 5vw, 120px)',
        background: '#0a0a0f',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(194,24,24,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)',
      }} />

      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            color: '#e8e8ec',
            transform: 'skewX(-4deg)',
            display: 'inline-block',
            lineHeight: 1,
            marginBottom: '16px',
          }}>
            JOIN <span className="text-gradient-gold">RCC</span> TODAY
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: '#888899', maxWidth: '420px', margin: '0 auto' }}>
            Apply for membership. Delhi&apos;s most elite invite-only badminton community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            background: 'rgba(17,17,24,0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
            padding: 'clamp(28px, 4vw, 48px)',
          }}
        >
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(212,175,55,0.15)', border: '2px solid #D4AF37',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <Check size={32} color="#D4AF37" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.2rem', color: '#D4AF37', marginBottom: '12px' }}>
                WELCOME TO RCC!
              </h3>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: '#888899', lineHeight: 1.6 }}>
                Your application has been received. We&apos;ll reach out within 24 hours to complete onboarding.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <FormField label="Full Name" type="text" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Your full name" />
              <FormField label="Email Address" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="your@email.com" />
              <FormField label="Phone Number" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+91 98765 43210" />

              <div>
                <label style={{
                  display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: '11px',
                  letterSpacing: '0.12em', color: '#888899', marginBottom: '8px', textTransform: 'uppercase',
                }}>
                  Skill Level
                </label>
                <select
                  value={form.skill_level}
                  onChange={(e) => setForm({ ...form, skill_level: e.target.value })}
                  style={{
                    width: '100%', padding: '12px 16px', background: '#111118',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                    color: '#e8e8ec', fontFamily: 'var(--font-inter)', fontSize: '14px',
                    outline: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="elite">Elite</option>
                </select>
              </div>

              {error && (
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#C21818' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '15px', background: loading ? 'rgba(194,24,24,0.5)' : '#C21818',
                  border: 'none', borderRadius: '8px', color: '#fff',
                  fontFamily: 'var(--font-montserrat)', fontSize: '13px', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px',
                  minHeight: '44px',
                }}
                onMouseEnter={(e) => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.background = '#D4AF37'; (e.currentTarget as HTMLButtonElement).style.color = '#0a0a0f'; } }}
                onMouseLeave={(e) => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.background = '#C21818'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; } }}
              >
                {loading ? 'SUBMITTING...' : 'APPLY FOR MEMBERSHIP'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function FormField({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <label style={{
        display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: '11px',
        letterSpacing: '0.12em', color: '#888899', marginBottom: '8px', textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <input
        type={type} required value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
          color: '#e8e8ec', fontFamily: 'var(--font-inter)', fontSize: '14px', outline: 'none',
        }}
      />
    </div>
  );
}
