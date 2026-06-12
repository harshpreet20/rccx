'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const CATEGORIES = [
  { value: 'general',       label: 'General Enquiry',   icon: '💬' },
  { value: 'event',         label: 'Event Issue',        icon: '📅' },
  { value: 'membership',    label: 'Membership',         icon: '👥' },
  { value: 'payment',       label: 'Payment',            icon: '💳' },
  { value: 'court_booking', label: 'Court Booking',      icon: '🏸' },
  { value: 'technical',     label: 'Technical Issue',    icon: '⚙️' },
  { value: 'other',         label: 'Other',              icon: '📋' },
];

const PRIORITIES = [
  { value: 'low',    label: 'Low',    color: '#22c55e' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high',   label: 'High',   color: '#ef4444' },
  { value: 'urgent', label: 'Urgent', color: '#C21818' },
];

function generateTicketNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `RCC-SUP-${rand}`;
}

export default function SupportSection() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    category: 'general', subject: '', description: '', priority: 'medium',
  });
  const [submitting, setSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  function update(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
    if (error) setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');

    const ticket_number = generateTicketNumber();
    const { error: dbError } = await supabase.from('support_tickets').insert({
      ticket_number,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      category: form.category,
      subject: form.subject.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: 'open',
    });

    setSubmitting(false);

    if (dbError) {
      setError('Something went wrong. Please try again or email us directly.');
      return;
    }

    // Fire-and-forget admin notification
    fetch('/api/email/notify-support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket_number, ...form }),
    }).catch(() => {});

    setTicketNumber(ticket_number);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#e8e8ec',
    fontFamily: 'var(--font-inter)',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'box-shadow 0.2s, border-color 0.2s',
  };

  const focusStyle = (field: string): React.CSSProperties =>
    focusedField === field
      ? { ...inputStyle, boxShadow: '0 0 0 2px rgba(212,175,55,0.2)', borderColor: 'rgba(212,175,55,0.4)' }
      : inputStyle;

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-montserrat)',
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: '0.1em',
    color: '#888899',
    textTransform: 'uppercase',
    marginBottom: 8,
  };

  if (ticketNumber) {
    return (
      <section style={{ background: '#080810', padding: 'clamp(60px,8vw,100px) clamp(16px,5vw,120px)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
          <div style={{
            fontFamily: 'Arial, "Helvetica Neue", sans-serif',
            fontWeight: 700, fontSize: 'clamp(22px,4vw,30px)',
            color: '#e8e8ec', marginBottom: 12,
          }}>
            Ticket Submitted!
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: '#888899', lineHeight: 1.7, marginBottom: 32 }}>
            We&apos;ve received your support request and will respond within 24–48 hours.
          </div>
          <div style={{
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: 16, padding: '28px 32px', marginBottom: 32,
          }}>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#888899', textTransform: 'uppercase', marginBottom: 8 }}>
              Your Ticket Number
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 700, color: '#D4AF37', letterSpacing: '0.08em' }}>
              {ticketNumber}
            </div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#555566', marginTop: 8 }}>
              Save this number to track your request
            </div>
          </div>
          <button
            onClick={() => { setForm({ name: '', email: '', phone: '', category: 'general', subject: '', description: '', priority: 'medium' }); setTicketNumber(''); }}
            style={{
              background: 'transparent', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8,
              padding: '10px 24px', color: '#D4AF37', fontFamily: 'var(--font-montserrat)',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer',
            }}
          >
            Submit Another Ticket
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="support" style={{ background: '#080810', padding: 'clamp(60px,8vw,100px) clamp(16px,5vw,120px)', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(194,24,24,0.06) 0%, transparent 70%)',
      }} />

      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 20, padding: '6px 18px', marginBottom: 16,
            fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.14em', color: '#D4AF37', textTransform: 'uppercase',
          }}>
            Support
          </div>
          <h2 style={{
            fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700,
            fontSize: 'clamp(28px,5vw,42px)', color: '#e8e8ec',
            lineHeight: 1.15, marginBottom: 16,
          }}>
            Raise a Support Ticket
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 16, color: '#888899', lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
            Have an issue or question? Raise a ticket and our team will get back to you within 24–48 hours.
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: 'rgba(13,13,20,0.8)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20, padding: 'clamp(24px,4vw,40px)',
          backdropFilter: 'blur(10px)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Name + Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="support-two-col">
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  value={form.name} onChange={e => update('name', e.target.value)}
                  onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField('')}
                  placeholder="Your name" required style={focusStyle('name')}
                />
              </div>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input
                  type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')}
                  placeholder="your@email.com" required style={focusStyle('email')}
                />
              </div>
            </div>

            {/* Phone + Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="support-two-col">
              <div>
                <label style={labelStyle}>Phone (optional)</label>
                <input
                  value={form.phone} onChange={e => update('phone', e.target.value)}
                  onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField('')}
                  placeholder="+91 98765 43210" style={focusStyle('phone')}
                />
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {PRIORITIES.map(p => (
                    <button
                      key={p.value} type="button"
                      onClick={() => update('priority', p.value)}
                      style={{
                        flex: 1, padding: '11px 4px', borderRadius: 8, border: 'none',
                        cursor: 'pointer', fontFamily: 'var(--font-montserrat)',
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                        background: form.priority === p.value ? `${p.color}22` : 'rgba(255,255,255,0.04)',
                        color: form.priority === p.value ? p.color : '#555566',
                        boxShadow: form.priority === p.value ? `0 0 0 1px ${p.color}` : '0 0 0 1px rgba(255,255,255,0.08)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>Category *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }} className="support-cat-grid">
                {CATEGORIES.map(c => (
                  <button
                    key={c.value} type="button"
                    onClick={() => update('category', c.value)}
                    style={{
                      padding: '10px 8px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: form.category === c.value ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                      boxShadow: form.category === c.value ? '0 0 0 1px rgba(212,175,55,0.4)' : '0 0 0 1px rgba(255,255,255,0.07)',
                      fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 600,
                      color: form.category === c.value ? '#D4AF37' : '#555566',
                      transition: 'all 0.15s', textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{c.icon}</div>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label style={labelStyle}>Subject *</label>
              <input
                value={form.subject} onChange={e => update('subject', e.target.value)}
                onFocus={() => setFocusedField('subject')} onBlur={() => setFocusedField('')}
                placeholder="Brief summary of your issue" required style={focusStyle('subject')}
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description *</label>
              <textarea
                value={form.description} onChange={e => update('description', e.target.value)}
                onFocus={() => setFocusedField('desc')} onBlur={() => setFocusedField('')}
                placeholder="Please describe your issue in detail — include any relevant event names, dates, ticket IDs, or steps to reproduce..."
                rows={5} required
                style={{
                  ...focusStyle('desc'), resize: 'vertical', minHeight: 120,
                  fontFamily: 'var(--font-inter)',
                }}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(194,24,24,0.1)', border: '1px solid rgba(194,24,24,0.3)',
                borderRadius: 10, padding: '12px 16px',
                fontFamily: 'var(--font-inter)', fontSize: 13, color: '#ff6b6b',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                ⚠ {error}
              </div>
            )}

            <button
              type="submit" disabled={submitting}
              style={{
                background: submitting ? 'rgba(100,10,10,0.5)' : 'linear-gradient(135deg, #C21818 0%, #8b0f0f 100%)',
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '15px 20px', width: '100%',
                fontFamily: 'Arial, "Helvetica Neue", sans-serif',
                fontWeight: 700, fontSize: 14, letterSpacing: '0.08em',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(194,24,24,0.3)',
                transition: 'background 0.2s',
              }}
            >
              {submitting ? 'SUBMITTING…' : '🎫 SUBMIT SUPPORT TICKET'}
            </button>

          </form>
        </div>

        <style>{`
          @media (max-width: 600px) {
            .support-two-col { grid-template-columns: 1fr !important; }
            .support-cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
