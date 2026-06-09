'use client';

import { useEffect, useState } from 'react';
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

export default function SupportModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    category: 'general', subject: '', description: '', priority: 'medium',
  });
  const [submitting, setSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-support-modal', handler);
    return () => window.removeEventListener('open-support-modal', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function close() {
    setOpen(false);
    setTicketNumber('');
    setError('');
    setForm({ name: '', email: '', phone: '', category: 'general', subject: '', description: '', priority: 'medium' });
  }

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

    fetch('/api/email/notify-support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket_number, ...form }),
    }).catch(() => {});

    setTicketNumber(ticket_number);
  }

  if (!open) return null;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#e8e8ec',
    fontFamily: 'var(--font-inter)',
    fontSize: 13,
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
    fontSize: 10,
    letterSpacing: '0.1em',
    color: '#888899',
    textTransform: 'uppercase',
    marginBottom: 6,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 900,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed', zIndex: 901,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(680px, calc(100vw - 32px))',
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
          background: '#0d0d18',
          border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 28px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'sticky', top: 0,
          background: '#0d0d18',
          zIndex: 1,
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-montserrat)', fontWeight: 700,
              fontSize: 18, color: '#e8e8ec',
            }}>
              Raise a Support Ticket
            </div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899', marginTop: 3 }}>
              We respond within 24–48 hours
            </div>
          </div>
          <button
            onClick={close}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, width: 36, height: 36, color: '#888899',
              fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px 28px' }}>
          {ticketNumber ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 22, color: '#e8e8ec', marginBottom: 8 }}>
                Ticket Submitted!
              </div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: '#888899', marginBottom: 24 }}>
                We&apos;ve received your request and will respond within 24–48 hours.
              </div>
              <div style={{
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: 12, padding: '20px 24px', marginBottom: 24,
              }}>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#888899', textTransform: 'uppercase', marginBottom: 6 }}>
                  Your Ticket Number
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 700, color: '#D4AF37', letterSpacing: '0.08em' }}>
                  {ticketNumber}
                </div>
              </div>
              <button
                onClick={close}
                style={{
                  background: '#C21818', color: '#fff', border: 'none', borderRadius: 8,
                  padding: '12px 28px', fontFamily: 'var(--font-montserrat)', fontWeight: 700,
                  fontSize: 12, letterSpacing: '0.08em', cursor: 'pointer',
                }}
              >
                CLOSE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Name + Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="sm-two-col">
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input value={form.name} onChange={e => update('name', e.target.value)}
                    onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField('')}
                    placeholder="Your name" required style={focusStyle('name')} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')}
                    placeholder="your@email.com" required style={focusStyle('email')} />
                </div>
              </div>

              {/* Phone + Priority */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="sm-two-col">
                <div>
                  <label style={labelStyle}>Phone (optional)</label>
                  <input value={form.phone} onChange={e => update('phone', e.target.value)}
                    onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField('')}
                    placeholder="+91 98765 43210" style={focusStyle('phone')} />
                </div>
                <div>
                  <label style={labelStyle}>Priority</label>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {PRIORITIES.map(p => (
                      <button key={p.value} type="button" onClick={() => update('priority', p.value)}
                        style={{
                          flex: 1, padding: '9px 4px', borderRadius: 7, border: 'none',
                          cursor: 'pointer', fontFamily: 'var(--font-montserrat)',
                          fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                          background: form.priority === p.value ? `${p.color}22` : 'rgba(255,255,255,0.04)',
                          color: form.priority === p.value ? p.color : '#555566',
                          boxShadow: form.priority === p.value ? `0 0 0 1px ${p.color}` : '0 0 0 1px rgba(255,255,255,0.08)',
                          transition: 'all 0.15s',
                        }}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label style={labelStyle}>Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }} className="sm-cat-grid">
                  {CATEGORIES.map(c => (
                    <button key={c.value} type="button" onClick={() => update('category', c.value)}
                      style={{
                        padding: '8px 6px', borderRadius: 7, border: 'none', cursor: 'pointer',
                        background: form.category === c.value ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                        boxShadow: form.category === c.value ? '0 0 0 1px rgba(212,175,55,0.4)' : '0 0 0 1px rgba(255,255,255,0.07)',
                        fontFamily: 'var(--font-montserrat)', fontSize: 10, fontWeight: 600,
                        color: form.category === c.value ? '#D4AF37' : '#555566',
                        transition: 'all 0.15s', textAlign: 'center',
                      }}>
                      <div style={{ fontSize: 16, marginBottom: 3 }}>{c.icon}</div>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label style={labelStyle}>Subject *</label>
                <input value={form.subject} onChange={e => update('subject', e.target.value)}
                  onFocus={() => setFocusedField('subject')} onBlur={() => setFocusedField('')}
                  placeholder="Brief summary of your issue" required style={focusStyle('subject')} />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)}
                  onFocus={() => setFocusedField('desc')} onBlur={() => setFocusedField('')}
                  placeholder="Describe your issue in detail — include event names, dates, or steps to reproduce..."
                  rows={4} required
                  style={{ ...focusStyle('desc'), resize: 'vertical', minHeight: 100, fontFamily: 'var(--font-inter)' }}
                />
              </div>

              {error && (
                <div style={{
                  background: 'rgba(194,24,24,0.1)', border: '1px solid rgba(194,24,24,0.3)',
                  borderRadius: 8, padding: '10px 14px',
                  fontFamily: 'var(--font-inter)', fontSize: 13, color: '#ff6b6b',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  ⚠ {error}
                </div>
              )}

              <button type="submit" disabled={submitting}
                style={{
                  background: submitting ? 'rgba(100,10,10,0.5)' : 'linear-gradient(135deg, #C21818 0%, #8b0f0f 100%)',
                  color: '#fff', border: 'none', borderRadius: 8,
                  padding: '14px 20px', width: '100%',
                  fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 13,
                  letterSpacing: '0.08em', cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 20px rgba(194,24,24,0.3)', transition: 'background 0.2s',
                }}>
                {submitting ? 'SUBMITTING…' : '🎫 SUBMIT SUPPORT TICKET'}
              </button>
            </form>
          )}
        </div>

        <style>{`
          @media (max-width: 520px) {
            .sm-two-col { grid-template-columns: 1fr !important; }
            .sm-cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
      </div>
    </>
  );
}
