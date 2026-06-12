'use client';

import { useState, useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { MapPin, Mail, Phone, Send, Clock, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { useRecaptcha, verifyRecaptchaToken } from '@/lib/recaptcha';

/* ─── Instagram SVG icon ────────────────────────────────────────────── */
function InstagramIcon({ size = 22, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
    </svg>
  );
}

/* ─── Court data ────────────────────────────────────────────────────── */
const courts = [
  { name: 'DTEA Janakpuri', area: 'Delhi', district: 'West' },
  { name: 'JLDAV Public School Paschim Vihar', area: 'Delhi', district: 'West' },
  { name: 'VVDAV Vikaspuri', area: 'Delhi', district: 'West' },
  { name: 'Divine Happy Paschim Vihar', area: 'Delhi', district: 'West' },
  { name: 'Guruharkishan Nagar Mini Sports Complex', area: 'Paschim Vihar', district: 'Delhi' },
  { name: 'Maxfort School Paschim Vihar', area: 'Delhi', district: 'West' },
  { name: 'DIPS Badminton Academy Rohini', area: 'Rohini Sector 9', district: 'Delhi' },
];

/* ─── Fade-in animation variants ───────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function ContactPage() {
  /* Form state */
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { executeRecaptcha } = useRecaptcha();

  /* InView refs */
  const heroRef = useRef(null);
  const contactRef = useRef(null);
  const courtsRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-80px' });
  const contactInView = useInView(contactRef, { once: true, margin: '-80px' });
  const courtsInView = useInView(courtsRef, { once: true, margin: '-80px' });

  /* Handlers */
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const token = await executeRecaptcha('contact_form');
    if (token) {
      const passed = await verifyRecaptchaToken(token);
      if (!passed) {
        setErrorMsg('Security check failed. Please try again.');
        setSubmitting(false);
        return;
      }
    }

    const { error } = await supabase.from('contact_submissions').insert({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone || null,
      subject: formData.subject || null,
      message: formData.message,
    });

    setSubmitting(false);

    if (error) {
      setErrorMsg('Something went wrong. Please try again or email us directly.');
    } else {
      setSuccess(true);
      setFormData({ full_name: '', email: '', phone: '', subject: '', message: '' });
      // Fire-and-forget admin notification
      fetch('/api/email/notify-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || null,
          message: formData.message,
        }),
      }).catch(() => {});
    }
  }

  /* ─── Styles ──────────────────────────────────────────────────────── */
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#e8e8ec',
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-montserrat), sans-serif',
    fontWeight: 600,
    fontSize: '11px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#888899',
    marginBottom: '6px',
  };

  return (
    <>
      <Navbar />

      <main style={{ background: '#0a0a0f', minHeight: '100vh', color: '#e8e8ec' }}>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          style={{
            paddingTop: '120px',
            paddingBottom: '72px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient glow */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(194,24,24,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <motion.div
            variants={stagger}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            style={{ position: 'relative', zIndex: 1, padding: '0 24px' }}
          >
            {/* Label */}
            <motion.p variants={fadeUp} style={{
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#D4AF37',
              marginBottom: '16px',
            }}>
              Racquets Club Community
            </motion.p>

            {/* Heading */}
            <motion.h1 variants={fadeUp} style={{
              fontFamily: 'var(--font-bebas), Impact, sans-serif',
              fontSize: 'clamp(3.5rem, 10vw, 7rem)',
              lineHeight: 1,
              letterSpacing: '0.04em',
              color: '#e8e8ec',
              marginBottom: '4px',
            }}>
              GET IN{' '}
              <span className="text-gradient-gold">TOUCH</span>
            </motion.h1>

            {/* Divider accent */}
            <motion.div variants={fadeUp} style={{
              width: '64px',
              height: '3px',
              background: 'linear-gradient(90deg, #C21818, #D4AF37)',
              borderRadius: '2px',
              margin: '20px auto',
            }} />

            {/* Subtitle */}
            <motion.p variants={fadeUp} style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
              color: '#888899',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}>
              Questions about membership, events, or just want to say hi?{' '}
              <span style={{ color: '#e8e8ec' }}>We&apos;d love to hear from you.</span>
            </motion.p>
          </motion.div>
        </section>

        {/* ── Two-column: Info + Form ───────────────────────────────── */}
        <section
          ref={contactRef}
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 24px 96px',
          }}
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={contactInView ? 'visible' : 'hidden'}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {/* ── Left: Contact info ─────────────────────────────────── */}
            <motion.div variants={fadeUp}>
              <p style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#D4AF37',
                marginBottom: '12px',
              }}>
                Contact Info
              </p>
              <h2 style={{
                fontFamily: 'var(--font-bebas), Impact, sans-serif',
                fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                letterSpacing: '0.04em',
                color: '#e8e8ec',
                marginBottom: '32px',
                lineHeight: 1.1,
              }}>
                REACH OUT TO US
              </h2>

              {/* Email card */}
              <div
                className="glass"
                style={{
                  borderRadius: '12px',
                  padding: '20px 24px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(212,175,55,0.1)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Mail size={18} color="#D4AF37" />
                </div>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-montserrat), sans-serif',
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#888899',
                    marginBottom: '4px',
                  }}>
                    Email Us
                  </p>
                  <a
                    href="mailto:info@racquetsclubcommunity.com"
                    style={{
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '14px',
                      color: '#e8e8ec',
                      textDecoration: 'none',
                    }}
                  >
                    info@racquetsclubcommunity.com
                  </a>
                </div>
              </div>

              {/* Instagram card */}
              <div
                className="glass"
                style={{
                  borderRadius: '12px',
                  padding: '20px 24px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(212,175,55,0.1)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <InstagramIcon size={18} color="#D4AF37" />
                </div>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-montserrat), sans-serif',
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#888899',
                    marginBottom: '4px',
                  }}>
                    Instagram
                  </p>
                  <a
                    href="https://www.instagram.com/racquetsclubcommunity/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '14px',
                      color: '#e8e8ec',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    @racquetsclubcommunity
                    <ChevronRight size={14} color="#D4AF37" />
                  </a>
                </div>
              </div>

              {/* Response time card */}
              <div
                className="glass"
                style={{
                  borderRadius: '12px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(212,175,55,0.1)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Clock size={18} color="#D4AF37" />
                </div>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-montserrat), sans-serif',
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#888899',
                    marginBottom: '4px',
                  }}>
                    Response Time
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '14px',
                    color: '#e8e8ec',
                    lineHeight: 1.5,
                  }}>
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Right: Contact form ────────────────────────────────── */}
            <motion.div variants={fadeUp}>
              <div
                className="glass"
                style={{
                  borderRadius: '16px',
                  padding: '36px 32px',
                }}
              >
                <h3 style={{
                  fontFamily: 'var(--font-bebas), Impact, sans-serif',
                  fontSize: '1.8rem',
                  letterSpacing: '0.06em',
                  color: '#e8e8ec',
                  marginBottom: '28px',
                }}>
                  SEND A MESSAGE
                </h3>

                {success ? (
                  /* Success state */
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(34,197,94,0.15)',
                      border: '2px solid rgba(34,197,94,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: '#22c55e',
                    }}>
                      Message sent!
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '14px',
                      color: '#888899',
                      lineHeight: 1.6,
                    }}>
                      We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      style={{
                        marginTop: '8px',
                        background: 'none',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '8px',
                        padding: '8px 20px',
                        color: '#888899',
                        fontFamily: 'var(--font-montserrat), sans-serif',
                        fontWeight: 600,
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      Send another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Full Name */}
                    <div>
                      <label htmlFor="full_name" style={labelStyle}>
                        Full Name <span style={{ color: '#C21818' }}>*</span>
                      </label>
                      <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        required
                        placeholder="Your full name"
                        value={formData.full_name}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" style={labelStyle}>
                        Email Address <span style={{ color: '#C21818' }}>*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" style={labelStyle}>
                        Phone <span style={{ color: '#888899', fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" style={labelStyle}>
                        Subject <span style={{ color: '#888899', fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Membership enquiry, event info…"
                        value={formData.subject}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" style={labelStyle}>
                        Message <span style={{ color: '#C21818' }}>*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell us what's on your mind…"
                        value={formData.message}
                        onChange={handleChange}
                        style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                        onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>

                    {/* Error */}
                    {errorMsg && (
                      <div style={{
                        background: 'rgba(194,24,24,0.12)',
                        border: '1px solid rgba(194,24,24,0.3)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontFamily: 'var(--font-inter), system-ui, sans-serif',
                        fontSize: '13px',
                        color: '#f87171',
                      }}>
                        {errorMsg}
                      </div>
                    )}

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '14px 28px',
                        minHeight: '44px',
                        background: submitting
                          ? 'rgba(194,24,24,0.5)'
                          : 'linear-gradient(135deg, #C21818, #a01515)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontFamily: 'var(--font-bebas), Impact, sans-serif',
                        fontSize: '1.1rem',
                        letterSpacing: '0.1em',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        transition: 'opacity 0.2s, transform 0.15s',
                        boxShadow: '0 4px 20px rgba(194,24,24,0.3)',
                      }}
                      onMouseEnter={e => {
                        if (!submitting) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                      }}
                    >
                      <Send size={16} />
                      {submitting ? 'SENDING…' : 'SEND MESSAGE'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Divider */}
        <div className="divider" style={{ maxWidth: '1100px', margin: '0 auto 80px', padding: '0 24px' }}>
          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)' }} />
        </div>

        {/* ── Courts section ────────────────────────────────────────── */}
        <section
          ref={courtsRef}
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 24px 112px',
          }}
        >
          {/* Section header */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={courtsInView ? 'visible' : 'hidden'}
            style={{ marginBottom: '48px' }}
          >
            <motion.p variants={fadeUp} style={{
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#D4AF37',
              marginBottom: '10px',
            }}>
              Our Venues
            </motion.p>
            <motion.h2 variants={fadeUp} style={{
              fontFamily: 'var(--font-bebas), Impact, sans-serif',
              fontSize: 'clamp(2.4rem, 6vw, 4rem)',
              letterSpacing: '0.04em',
              lineHeight: 1,
              color: '#e8e8ec',
            }}>
              WHERE WE{' '}
              <span className="text-gradient-gold">PLAY</span>
            </motion.h2>
            <motion.p variants={fadeUp} style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '15px',
              color: '#888899',
              marginTop: '14px',
              maxWidth: '480px',
              lineHeight: 1.7,
            }}>
              RCC members play across 7 venues in West Delhi and surrounding areas.
            </motion.p>
          </motion.div>

          {/* Courts grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={courtsInView ? 'visible' : 'hidden'}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {courts.map((court, i) => (
              <motion.div
                key={court.name}
                variants={fadeUp}
                style={{
                  background: 'rgba(17,17,24,0.7)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '14px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'border-color 0.25s, transform 0.25s',
                  cursor: 'default',
                }}
                whileHover={{
                  y: -4,
                  borderColor: 'rgba(212,175,55,0.25)',
                  transition: { duration: 0.2 },
                }}
              >
                {/* Icon + badge row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(194,24,24,0.1)',
                    border: '1px solid rgba(194,24,24,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <MapPin size={18} color="#C21818" />
                  </div>

                  {/* RCC Venue badge */}
                  <span style={{
                    fontFamily: 'var(--font-montserrat), sans-serif',
                    fontWeight: 700,
                    fontSize: '9px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#D4AF37',
                    background: 'rgba(212,175,55,0.08)',
                    border: '1px solid rgba(212,175,55,0.22)',
                    borderRadius: '20px',
                    padding: '4px 10px',
                  }}>
                    RCC Venue
                  </span>
                </div>

                {/* Court name */}
                <p style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 700,
                  fontSize: '15px',
                  color: '#e8e8ec',
                  lineHeight: 1.35,
                }}>
                  {court.name}
                </p>

                {/* Area / district */}
                <p style={{
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontSize: '13px',
                  color: '#888899',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  {court.area}
                  <span style={{ color: 'rgba(136,136,153,0.4)', margin: '0 2px' }}>·</span>
                  {court.district}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
