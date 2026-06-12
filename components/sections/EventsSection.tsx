'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Calendar, MapPin, Users, Clock, X, Check, ChevronRight } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  event_date: string;
  registration_deadline: string;
  venue: string;
  max_participants: number;
  current_participants: number;
  entry_fee: number;
  prize_pool: string | null;
  status: string;
  banner_url: string;
  format: string | null;
}

type FilterTab = 'ALL' | 'TOURNAMENT' | 'LADDER' | 'SMASH NIGHT' | 'CORPORATE';

const FILTER_TABS: FilterTab[] = ['ALL', 'TOURNAMENT', 'LADDER', 'SMASH NIGHT', 'CORPORATE'];

const FILTER_TYPE_MAP: Record<FilterTab, string | null> = {
  ALL: null,
  TOURNAMENT: 'weekend_tournament',
  LADDER: 'ladder_league',
  'SMASH NIGHT': 'smash_night',
  CORPORATE: 'corporate_cup',
};

const EVENT_TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  tournament: { bg: 'rgba(194,24,24,0.15)', text: '#C21818', border: 'rgba(194,24,24,0.4)' },
  ladder: { bg: 'rgba(212,175,55,0.15)', text: '#D4AF37', border: 'rgba(212,175,55,0.4)' },
  smash_night: { bg: 'rgba(139,92,246,0.15)', text: '#a78bfa', border: 'rgba(139,92,246,0.4)' },
  corporate: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', border: 'rgba(59,130,246,0.4)' },
};

function getTypeColor(type: string) {
  return EVENT_TYPE_COLORS[type?.toLowerCase().replace(' ', '_')] || EVENT_TYPE_COLORS['tournament'];
}

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    function update() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ days, hours, mins, secs });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontFamily: 'var(--font-bebas)',
          fontSize: '1.8rem',
          color: '#D4AF37',
          lineHeight: 1,
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '9px',
          color: '#888899',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const { days, hours, mins, secs } = useCountdown(targetDate);
  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '8px',
        border: '1px solid rgba(212,175,55,0.15)',
      }}
    >
      <Clock size={14} color="#888899" />
      <CountdownUnit value={days} label="Days" />
      <span style={{ color: '#D4AF37', fontFamily: 'var(--font-bebas)', fontSize: '1.2rem' }}>:</span>
      <CountdownUnit value={hours} label="Hrs" />
      <span style={{ color: '#D4AF37', fontFamily: 'var(--font-bebas)', fontSize: '1.2rem' }}>:</span>
      <CountdownUnit value={mins} label="Min" />
      <span style={{ color: '#D4AF37', fontFamily: 'var(--font-bebas)', fontSize: '1.2rem' }}>:</span>
      <CountdownUnit value={secs} label="Sec" />
    </div>
  );
}

function formatLabel(f: string | null) {
  const MAP: Record<string, string> = {
    singles: 'Singles',
    doubles: 'Doubles',
    mixed_doubles: 'Mixed Doubles',
    open: 'Open',
  };
  return f ? (MAP[f] ?? f) : 'Open';
}

function generateTicketId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `RCC-${s.slice(0, 4)}-${s.slice(4)}`;
}

interface Ticket {
  ticketId: string;
  name: string;
  email: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  format: string | null;
}

function TicketCard({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  const dateObj = new Date(ticket.eventDate);
  const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(34,197,94,0.15)', border: '2px solid #22c55e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={24} color="#22c55e" />
        </div>
        <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', color: '#22c55e', margin: 0, letterSpacing: '0.04em' }}>
          YOU'RE IN!
        </h3>
      </div>

      {/* Ticket card */}
      <div style={{
        background: '#0a0a0f',
        border: '1px solid rgba(212,175,55,0.4)',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        position: 'relative',
      }}>
        {/* Gold top strip */}
        <div style={{ height: 5, background: 'linear-gradient(to right, #C21818, #D4AF37)' }} />

        <div style={{ padding: '20px 24px' }}>
          {/* Logo + title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 9, color: '#888899', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                RACQUETS CLUB COMMUNITY
              </div>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', color: '#D4AF37', letterSpacing: '0.08em', lineHeight: 1 }}>
                EVENT TICKET
              </div>
            </div>
            <div style={{
              background: 'rgba(194,24,24,0.1)', border: '1px solid rgba(194,24,24,0.3)',
              borderRadius: 6, padding: '4px 10px',
              fontFamily: 'var(--font-montserrat)', fontSize: 10, fontWeight: 700,
              color: '#C21818', letterSpacing: '0.08em',
            }}>
              {formatLabel(ticket.format)}
            </div>
          </div>

          <div style={{ textAlign: 'left', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.4rem', color: '#e8e8ec', letterSpacing: '0.03em', lineHeight: 1.1 }}>
              {ticket.eventTitle}
            </div>
          </div>

          {/* Details grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: 16 }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 9, color: '#555566', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 3 }}>Date</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#e8e8ec', fontWeight: 600 }}>{dateStr}</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 9, color: '#555566', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 3 }}>Time</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#e8e8ec', fontWeight: 600 }}>{timeStr}</div>
            </div>
            <div style={{ textAlign: 'left', gridColumn: '1 / -1' }}>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 9, color: '#555566', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 3 }}>Venue</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#e8e8ec', fontWeight: 600 }}>{ticket.venue}</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 9, color: '#555566', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 3 }}>Name</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#e8e8ec', fontWeight: 600 }}>{ticket.name}</div>
            </div>
          </div>

          {/* Dashed separator */}
          <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', margin: '12px 0' }} />

          {/* Ticket ID */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 9, color: '#555566', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 3 }}>Ticket ID</div>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.3rem', color: '#D4AF37', letterSpacing: '0.12em' }}>{ticket.ticketId}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: '#333344', textAlign: 'right' }}>
              Show this at the venue
            </div>
          </div>
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#555566', marginBottom: 20 }}>
        Save a screenshot of your ticket. See you on the court!
      </p>

      <button
        onClick={onClose}
        style={{
          padding: '12px 32px', background: '#C21818', border: 'none',
          borderRadius: 8, color: '#fff', fontFamily: 'var(--font-montserrat)',
          fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer',
        }}
      >
        DONE
      </button>
    </div>
  );
}

interface RegistrationModalProps {
  event: Event;
  onClose: () => void;
  onRegistered?: (eventId: string) => void;
}

function RegistrationModal({ event, onClose, onRegistered }: RegistrationModalProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', skill_level: 'intermediate' });
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState('');

  const fieldStyle = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', color: '#e8e8ec',
    fontFamily: 'var(--font-inter)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
  };
  const labelStyle2 = {
    display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: '11px',
    letterSpacing: '0.1em', color: '#888899', marginBottom: '8px', textTransform: 'uppercase' as const,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const ticketId = generateTicketId();
    const { error: err } = await supabase.from('event_registrations').insert({
      event_id: event.id,
      member_name: form.name,
      member_email: form.email,
      phone: form.phone || null,
      skill_level: form.skill_level,
      ticket_id: ticketId,
    });

    if (err) {
      if (err.code === '23505') {
        setError('This email is already registered for this event.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } else {
      setTicket({
        ticketId,
        name: form.name,
        email: form.email,
        eventTitle: event.title,
        eventDate: event.event_date,
        venue: event.venue,
        format: event.format,
      });
      onRegistered?.(event.id);
    }
    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111118', border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: '16px', padding: '32px', width: '100%',
          maxWidth: '480px', position: 'relative', margin: 'auto',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#888899', cursor: 'pointer', padding: '4px' }}
        >
          <X size={20} />
        </button>

        {ticket ? (
          <TicketCard ticket={ticket} onClose={onClose} />
        ) : (
          <>
            <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: '#e8e8ec', marginBottom: '4px' }}>
              REGISTER FOR
            </h3>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '14px', color: '#D4AF37', fontWeight: 600, marginBottom: '6px' }}>
              {event.title}
            </p>
            {event.format && (
              <span style={{
                display: 'inline-block', background: 'rgba(194,24,24,0.1)', border: '1px solid rgba(194,24,24,0.3)',
                borderRadius: 5, padding: '2px 10px', fontFamily: 'var(--font-montserrat)',
                fontSize: 11, fontWeight: 700, color: '#C21818', letterSpacing: '0.06em', marginBottom: 20,
              }}>
                {formatLabel(event.format)}
              </span>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: event.format ? 0 : 20 }}>
              <div>
                <label style={labelStyle2}>Full Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={fieldStyle} placeholder="Your name" />
              </div>
              <div>
                <label style={labelStyle2}>Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={fieldStyle} placeholder="your@email.com" />
              </div>
              <div>
                <label style={labelStyle2}>Phone <span style={{ color: '#444455', fontWeight: 400 }}>(optional)</span></label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={fieldStyle} placeholder="+91 98765 43210" />
              </div>
              <div>
                <label style={labelStyle2}>Skill Level</label>
                <select value={form.skill_level} onChange={(e) => setForm({ ...form, skill_level: e.target.value })} style={{ ...fieldStyle, background: '#111118', cursor: 'pointer' }}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="elite">Elite</option>
                </select>
              </div>

              {error && (
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#C21818', margin: 0 }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px', background: loading ? 'rgba(194,24,24,0.5)' : '#C21818',
                  border: 'none', borderRadius: '8px', color: '#fff',
                  fontFamily: 'var(--font-montserrat)', fontSize: '13px', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                {loading ? 'REGISTERING...' : 'GET MY TICKET'}
                {!loading && <ChevronRight size={16} />}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function EventCard({ event, onRegister }: { event: Event; onRegister: (e: Event) => void }) {
  const typeColor = getTypeColor(event.event_type);
  const isPast = event.status === 'completed' || new Date(event.event_date) < new Date();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(17,17,24,0.7)',
        backdropFilter: 'blur(20px)',
        border: hovered
          ? `1px solid ${isPast ? 'rgba(212,175,55,0.3)' : 'rgba(194,24,24,0.3)'}`
          : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? '0 8px 40px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      {event.banner_url && (
        <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
          <img
            src={event.banner_url}
            alt={event.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(17,17,24,1) 0%, transparent 60%)',
            }}
          />
          {isPast && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                padding: '4px 10px',
                background: 'rgba(212,175,55,0.9)',
                borderRadius: '4px',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#0a0a0f',
              }}
            >
              RESULTS
            </div>
          )}
        </div>
      )}

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span
            style={{
              padding: '4px 10px',
              background: typeColor.bg,
              border: `1px solid ${typeColor.border}`,
              borderRadius: '4px',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: typeColor.text,
              textTransform: 'uppercase',
            }}
          >
            {event.event_type?.replace('_', ' ')}
          </span>
          {!event.banner_url && isPast && (
            <span
              style={{
                padding: '4px 10px',
                background: 'rgba(212,175,55,0.15)',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: '4px',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#D4AF37',
              }}
            >
              RESULTS
            </span>
          )}
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '18px',
            fontWeight: 700,
            color: '#e8e8ec',
            marginBottom: '12px',
            lineHeight: 1.3,
          }}
        >
          {event.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={14} color="#888899" />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#888899' }}>
              {new Date(event.event_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
              {' · '}
              {new Date(event.event_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} color="#888899" />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#888899' }}>
              {event.venue}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={14} color="#888899" />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#888899' }}>
              {event.current_participants}/{event.max_participants} participants
            </span>
          </div>
          {event.format && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: 13 }}>🏸</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#888899' }}>
                {formatLabel(event.format)}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {event.entry_fee > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', color: '#888899', letterSpacing: '0.08em', marginBottom: '2px' }}>
                ENTRY FEE
              </div>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.2rem', color: '#e8e8ec' }}>
                ₹{event.entry_fee.toLocaleString()}
              </div>
            </div>
          )}
          {event.prize_pool && (
            <div>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', color: '#888899', letterSpacing: '0.08em', marginBottom: '2px' }}>
                PRIZE POOL
              </div>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.2rem', color: '#D4AF37' }}>
                {event.prize_pool}
              </div>
            </div>
          )}
        </div>

        {!isPast && (
          <div style={{ marginBottom: '16px' }}>
            <CountdownTimer targetDate={event.event_date} />
          </div>
        )}

        {!isPast && (
          <button
            onClick={() => onRegister(event)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#C21818',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#D4AF37';
              (e.currentTarget as HTMLButtonElement).style.color = '#0a0a0f';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#C21818';
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
            }}
          >
            REGISTER NOW <ChevronRight size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      if (data) setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const filtered = events.filter((e) => {
    const mapped = FILTER_TYPE_MAP[activeTab];
    if (!mapped) return true;
    return e.event_type === mapped;
  });

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '80px clamp(16px, 5vw, 120px)',
        background: '#0a0a0f',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '48px' }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            color: '#e8e8ec',
            transform: 'skewX(-4deg)',
            display: 'inline-block',
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          EVENTS &{' '}
          <span className="text-gradient-gold">TOURNAMENTS</span>
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '15px',
            color: '#888899',
            maxWidth: '500px',
          }}
        >
          Compete. Grow. Dominate. From weekend smashes to grand tournaments, there's always a stage for you.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '40px',
        }}
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              border: activeTab === tab ? '1px solid #C21818' : '1px solid rgba(255,255,255,0.1)',
              background: activeTab === tab ? 'rgba(194,24,24,0.2)' : 'transparent',
              color: activeTab === tab ? '#e8e8ec' : '#888899',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: '400px',
                background: 'rgba(17,17,24,0.7)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} onRegister={setSelectedEvent} />
            ))}
            {filtered.length === 0 && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '60px',
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '16px',
                  color: '#888899',
                }}
              >
                No events found for this category.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        {selectedEvent && (
          <RegistrationModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onRegistered={(eventId) => {
              setEvents(prev => prev.map(e =>
                e.id === eventId ? { ...e, current_participants: e.current_participants + 1 } : e
              ));
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
