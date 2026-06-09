'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';

const PARTNERSHIP_TYPES = [
  { value: 'venue',       label: 'Venue Partner',        icon: '🏟️', desc: 'Provide courts or facilities' },
  { value: 'equipment',   label: 'Equipment Sponsor',     icon: '🏸', desc: 'Racquets, shuttles, gear' },
  { value: 'apparel',     label: 'Apparel & Merchandise', icon: '👕', desc: 'Kits, jerseys, merchandise' },
  { value: 'media',       label: 'Media & Content',       icon: '📸', desc: 'Photography, videography, coverage' },
  { value: 'food',        label: 'F&B Partner',           icon: '🥤', desc: 'Refreshments, nutrition, hospitality' },
  { value: 'technology',  label: 'Technology Partner',    icon: '💻', desc: 'Apps, platforms, digital services' },
  { value: 'financial',   label: 'Title / Financial Sponsor', icon: '🏆', desc: 'Tournament or league sponsorship' },
  { value: 'other',       label: 'Other',                 icon: '🤝', desc: 'Tell us your idea' },
];

export default function PartnerPage() {
  const [form, setForm] = useState({
    company_name: '', contact_name: '', email: '', phone: '',
    website: '', partnership_type: '', description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState('');

  function update(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
    if (error) setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company_name.trim() || !form.contact_name.trim() || !form.email.trim() || !form.partnership_type || !form.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');

    const { error: dbError } = await supabase.from('partnership_inquiries').insert({
      company_name: form.company_name.trim(),
      contact_name: form.contact_name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      website: form.website.trim() || null,
      partnership_type: form.partnership_type,
      description: form.description.trim(),
    });

    setSubmitting(false);
    if (dbError) {
      setError('Something went wrong. Please try again or email us directly.');
      return;
    }
    setSubmitted(true);
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    padding: '13px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused === field ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 10,
    color: '#e8e8ec',
    fontFamily: 'var(--font-inter)',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box' as const,
    boxShadow: focused === field ? '0 0 0 2px rgba(212,175,55,0.15)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  });

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

  return (
    <main style={{ background: '#080810', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        paddingTop: 'clamp(100px,14vw,160px)',
        paddingBottom: 'clamp(40px,6vw,80px)',
        paddingLeft: 'clamp(16px,5vw,120px)',
        paddingRight: 'clamp(16px,5vw,120px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 400, pointerEvents: 'none',
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)',
        }} />
        <div style={{
          display: 'inline-block',
          background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: 20, padding: '6px 18px', marginBottom: 20,
          fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.14em', color: '#D4AF37', textTransform: 'uppercase',
        }}>
          Partner With Us
        </div>
        <h1 style={{
          fontFamily: 'var(--font-bebas)',
          fontSize: 'clamp(3rem, 7vw, 6rem)',
          color: '#e8e8ec', lineHeight: 1, marginBottom: 20,
          letterSpacing: '0.02em',
        }}>
          BUILD SOMETHING <span style={{ color: '#D4AF37' }}>LEGENDARY</span>
        </h1>
        <p style={{
          fontFamily: 'var(--font-inter)', fontSize: 17, color: '#888899',
          lineHeight: 1.7, maxWidth: 560, margin: '0 auto',
        }}>
          Join Delhi&apos;s most competitive badminton community as a partner. Reach passionate players,
          build brand presence, and be part of something bigger than sport.
        </p>
      </div>

      {/* Partnership types */}
      <div style={{ padding: '0 clamp(16px,5vw,120px) clamp(40px,6vw,80px)' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12, maxWidth: 900, margin: '0 auto 80px',
        }}>
          {PARTNERSHIP_TYPES.slice(0, 4).map(pt => (
            <div key={pt.value} style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '20px 16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{pt.icon}</div>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 13, color: '#e8e8ec', marginBottom: 4 }}>
                {pt.label}
              </div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899' }}>
                {pt.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        {submitted ? (
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🤝</div>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 28, color: '#e8e8ec', marginBottom: 12 }}>
              Thank You!
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: '#888899', lineHeight: 1.7 }}>
              We&apos;ve received your partnership inquiry. Our team will review it and reach out to you within 3–5 business days.
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{
              background: 'rgba(13,13,20,0.8)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20, padding: 'clamp(24px,4vw,40px)',
              backdropFilter: 'blur(10px)',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 20,
                color: '#e8e8ec', marginBottom: 4,
              }}>
                Partnership Enquiry Form
              </h2>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#888899', marginBottom: 28 }}>
                Fill out the form below and we&apos;ll get back to you with partnership details and pricing.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Company + Contact */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="partner-two-col">
                  <div>
                    <label style={labelStyle}>Company / Brand Name *</label>
                    <input value={form.company_name} onChange={e => update('company_name', e.target.value)}
                      onFocus={() => setFocused('company_name')} onBlur={() => setFocused('')}
                      placeholder="Your company name" required style={inputStyle('company_name')} />
                  </div>
                  <div>
                    <label style={labelStyle}>Contact Person *</label>
                    <input value={form.contact_name} onChange={e => update('contact_name', e.target.value)}
                      onFocus={() => setFocused('contact_name')} onBlur={() => setFocused('')}
                      placeholder="Your name" required style={inputStyle('contact_name')} />
                  </div>
                </div>

                {/* Email + Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="partner-two-col">
                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                      onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                      placeholder="business@company.com" required style={inputStyle('email')} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone (optional)</label>
                    <input value={form.phone} onChange={e => update('phone', e.target.value)}
                      onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                      placeholder="+91 98765 43210" style={inputStyle('phone')} />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label style={labelStyle}>Website (optional)</label>
                  <input value={form.website} onChange={e => update('website', e.target.value)}
                    onFocus={() => setFocused('website')} onBlur={() => setFocused('')}
                    placeholder="https://yourcompany.com" style={inputStyle('website')} />
                </div>

                {/* Partnership type */}
                <div>
                  <label style={labelStyle}>Partnership Type *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }} className="partner-type-grid">
                    {PARTNERSHIP_TYPES.map(pt => (
                      <button key={pt.value} type="button" onClick={() => update('partnership_type', pt.value)}
                        style={{
                          padding: '10px 8px', borderRadius: 8, border: 'none', cursor: 'pointer',
                          background: form.partnership_type === pt.value ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                          boxShadow: form.partnership_type === pt.value ? '0 0 0 1px rgba(212,175,55,0.4)' : '0 0 0 1px rgba(255,255,255,0.07)',
                          fontFamily: 'var(--font-montserrat)', fontSize: 10, fontWeight: 600,
                          color: form.partnership_type === pt.value ? '#D4AF37' : '#555566',
                          transition: 'all 0.15s', textAlign: 'center',
                        }}>
                        <div style={{ fontSize: 18, marginBottom: 4 }}>{pt.icon}</div>
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Tell Us About Your Partnership Vision *</label>
                  <textarea value={form.description} onChange={e => update('description', e.target.value)}
                    onFocus={() => setFocused('description')} onBlur={() => setFocused('')}
                    placeholder="Describe what you're looking for in a partnership — budget range, duration, specific events you'd like to associate with, or any unique ideas..."
                    rows={5} required
                    style={{ ...inputStyle('description'), resize: 'vertical', minHeight: 120, fontFamily: 'var(--font-inter)' }}
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

                <button type="submit" disabled={submitting}
                  style={{
                    background: submitting ? 'rgba(212,175,55,0.2)' : 'linear-gradient(135deg, #D4AF37 0%, #a8882a 100%)',
                    color: submitting ? '#888899' : '#0a0a0f',
                    border: 'none', borderRadius: 10,
                    padding: '15px 20px', width: '100%',
                    fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 14,
                    letterSpacing: '0.08em', cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 20px rgba(212,175,55,0.25)', transition: 'all 0.2s',
                  }}>
                  {submitting ? 'SUBMITTING…' : '🤝 SUBMIT PARTNERSHIP ENQUIRY'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />

      <style>{`
        @media (max-width: 600px) {
          .partner-two-col { grid-template-columns: 1fr !important; }
          .partner-type-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </main>
  );
}
