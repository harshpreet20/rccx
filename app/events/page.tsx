'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, X, Check, ChevronRight, Filter } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { useRecaptcha, verifyRecaptchaToken } from '@/lib/recaptcha';

// ─── Types ────────────────────────────────────────────────────────────────────

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
  prize_pool: string;
  status: string;
  banner_url: string;
  format: string;
  created_at: string;
}

interface RegistrationForm {
  member_name: string;
  member_email: string;
  phone: string;
  skill_level: string;
}

interface TicketData {
  ticket_id: string;
  event_title: string;
  event_date: string;
  venue: string;
  format: string;
  member_name: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateTicketId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `RCC-${s.slice(0, 4)}-${s.slice(4)}`;
}

const FORMAT_LABELS: Record<string, string> = {
  singles: 'Singles',
  doubles: 'Doubles',
  mixed_doubles: 'Mixed Doubles',
  open: 'Open',
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  weekend_tournament: 'Tournament',
  ladder_league: 'Ladder',
  smash_night: 'Smash Night',
  corporate_cup: 'Corporate',
  open_session: 'Open Session',
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  weekend_tournament: '#C21818',
  ladder_league: '#D4AF37',
  smash_night: '#7c3aed',
  corporate_cup: '#0891b2',
  open_session: '#059669',
};

const FILTER_TABS = [
  { key: 'all', label: 'ALL' },
  { key: 'weekend_tournament', label: 'TOURNAMENT' },
  { key: 'ladder_league', label: 'LADDER' },
  { key: 'smash_night', label: 'SMASH NIGHT' },
  { key: 'corporate_cup', label: 'CORPORATE' },
];

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.toLocaleDateString('en-US', { weekday: 'long' });
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return { day, date, time };
}

// ─── Countdown Hook ───────────────────────────────────────────────────────────

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    function update() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CountdownDisplay({ targetDate }: { targetDate: string }) {
  const { days, hours, mins, secs } = useCountdown(targetDate);
  const units = [
    { label: 'D', value: days },
    { label: 'H', value: hours },
    { label: 'M', value: mins },
    { label: 'S', value: secs },
  ];
  return (
    <div className="flex gap-1 items-center">
      {units.map(({ label, value }) => (
        <div key={label} className="flex items-center gap-0.5">
          <span
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: '1rem',
              color: '#D4AF37',
              minWidth: '1.5ch',
              display: 'inline-block',
            }}
          >
            {String(value).padStart(2, '0')}
          </span>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: '#888899' }}>
            {label}
          </span>
          {label !== 'S' && <span style={{ color: '#888899', fontSize: '0.7rem', marginLeft: '1px' }}>:</span>}
        </div>
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <div style={{ height: 160, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s infinite' }} />
      <div style={{ padding: '1.25rem' }}>
        {[80, 60, 40, 40, 40].map((w, i) => (
          <div
            key={i}
            style={{
              height: i === 0 ? 22 : 14,
              width: `${w}%`,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 4,
              marginBottom: 10,
              animation: 'pulse 1.5s infinite',
            }}
          />
        ))}
        <div
          style={{
            height: 40,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 8,
            marginTop: 16,
            animation: 'pulse 1.5s infinite',
          }}
        />
      </div>
    </div>
  );
}

function TicketCard({ ticket, onClose }: { ticket: TicketData; onClose: () => void }) {
  const { day, date, time } = formatEventDate(ticket.event_date);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        background: '#0f0f17',
        border: '1px solid rgba(212,175,55,0.3)',
        borderRadius: '16px',
        overflow: 'hidden',
        maxWidth: 420,
        width: '100%',
      }}
    >
      {/* Gold/red gradient strip */}
      <div
        style={{
          height: 8,
          background: 'linear-gradient(90deg, #C21818 0%, #D4AF37 50%, #C21818 100%)',
        }}
      />

      <div style={{ padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: '#888899', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
              Event Ticket
            </p>
            <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', color: '#e8e8ec', lineHeight: 1.1 }}>
              {ticket.event_title}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Check size={16} style={{ color: '#059669' }} />
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: '#059669', fontWeight: 600 }}>
              CONFIRMED
            </span>
          </div>
        </div>

        {/* Event details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          {[
            { label: 'Date', value: `${day}, ${date}` },
            { label: 'Time', value: time },
            { label: 'Venue', value: ticket.venue },
            { label: 'Format', value: FORMAT_LABELS[ticket.format] || ticket.format },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: '#888899', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>
                {label}
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: '#e8e8ec', fontWeight: 500 }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Attendee */}
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: '#888899', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>
            Registered As
          </p>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: '#e8e8ec', fontWeight: 600 }}>
            {ticket.member_name}
          </p>
        </div>

        {/* Dashed separator */}
        <div
          style={{
            borderTop: '2px dashed rgba(212,175,55,0.25)',
            margin: '1rem -1.5rem',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -1,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 20,
              height: 20,
              background: '#0a0a0f',
              borderRadius: '50%',
              border: '1px solid rgba(212,175,55,0.15)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: -1,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 20,
              height: 20,
              background: '#0a0a0f',
              borderRadius: '50%',
              border: '1px solid rgba(212,175,55,0.15)',
            }}
          />
        </div>

        {/* Ticket ID */}
        <div style={{ paddingTop: '0.5rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: '#888899', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            Ticket ID
          </p>
          <p
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: '2rem',
              letterSpacing: '0.15em',
              background: 'linear-gradient(135deg, #D4AF37, #f5d77a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {ticket.ticket_id}
          </p>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: '#888899', marginTop: 8 }}>
            Save a screenshot of your ticket for check-in
          </p>
        </div>
      </div>

      {/* Close button */}
      <div style={{ padding: '0 1.5rem 1.5rem' }}>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.65rem',
            background: 'rgba(212,175,55,0.1)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: 8,
            color: '#D4AF37',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => ((e.target as HTMLButtonElement).style.background = 'rgba(212,175,55,0.2)')}
          onMouseLeave={e => ((e.target as HTMLButtonElement).style.background = 'rgba(212,175,55,0.1)')}
        >
          CLOSE
        </button>
      </div>
    </motion.div>
  );
}

function EventCard({ event, onRegister }: { event: Event; onRegister: (event: Event) => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { day, date, time } = formatEventDate(event.event_date);
  const isUpcoming = event.status === 'upcoming';
  const isCompleted = event.status === 'completed';
  const isCancelled = event.status === 'cancelled';
  const typeColor = EVENT_TYPE_COLORS[event.event_type] || '#888899';
  const spotsLeft = event.max_participants - event.current_participants;
  const isFull = spotsLeft <= 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45 }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${isCompleted || isCancelled ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.09)'}`,
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        opacity: isCancelled ? 0.55 : 1,
        transition: 'transform 0.2s, border-color 0.2s',
      }}
      whileHover={!isCompleted && !isCancelled ? { y: -4 } : {}}
    >
      {/* Banner / placeholder */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        {event.banner_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.banner_url}
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${typeColor}22 0%, #0a0a0f 60%, ${typeColor}11 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '2.5rem',
                color: typeColor,
                opacity: 0.35,
                letterSpacing: '0.05em',
              }}
            >
              {EVENT_TYPE_LABELS[event.event_type] || 'EVENT'}
            </span>
          </div>
        )}

        {/* Type badge */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: typeColor,
            color: '#fff',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 700,
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            padding: '3px 8px',
            borderRadius: 4,
            textTransform: 'uppercase',
          }}
        >
          {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
        </div>

        {/* Status overlay */}
        {(isCompleted || isCancelled) && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10,10,15,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '1.8rem',
                color: isCompleted ? '#D4AF37' : '#C21818',
                letterSpacing: '0.1em',
                opacity: 0.9,
              }}
            >
              {isCompleted ? 'COMPLETED' : 'CANCELLED'}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: '1.25rem',
            color: isCompleted || isCancelled ? '#888899' : '#e8e8ec',
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {event.title}
        </h3>

        {/* Date & time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={13} style={{ color: '#D4AF37', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: '#e8e8ec' }}>
            {day}, {date}
          </span>
          <span style={{ color: '#888899', fontSize: '0.78rem' }}>·</span>
          <Clock size={13} style={{ color: '#888899', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: '#888899' }}>{time}</span>
        </div>

        {/* Venue */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={13} style={{ color: '#888899', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: '#888899' }}>{event.venue}</span>
        </div>

        {/* Format badge + participants */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {event.format && (
            <span
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#D4AF37',
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: 4,
                padding: '2px 7px',
                textTransform: 'uppercase',
              }}
            >
              {FORMAT_LABELS[event.format] || event.format}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Users size={12} style={{ color: '#888899' }} />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: '#888899' }}>
              {event.current_participants}/{event.max_participants}
            </span>
            {isUpcoming && !isFull && (
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: '#059669' }}>
                ({spotsLeft} left)
              </span>
            )}
            {isUpcoming && isFull && (
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: '#C21818' }}>
                (Full)
              </span>
            )}
          </div>
        </div>

        {/* Countdown */}
        {isUpcoming && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: '#888899', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Starts in
            </span>
            <CountdownDisplay targetDate={event.event_date} />
          </div>
        )}

        {/* Fee & prize */}
        {(event.entry_fee > 0 || event.prize_pool) && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {event.entry_fee > 0 && (
              <div>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: '#888899', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Entry Fee
                </span>
                <p style={{ fontFamily: 'var(--font-bebas)', fontSize: '1rem', color: '#e8e8ec', margin: 0 }}>
                  ${event.entry_fee}
                </p>
              </div>
            )}
            {event.prize_pool && (
              <div>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: '#888899', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Prize Pool
                </span>
                <p style={{ fontFamily: 'var(--font-bebas)', fontSize: '1rem', color: '#D4AF37', margin: 0 }}>
                  {event.prize_pool}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* CTA button */}
        {isCompleted ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '0.6rem',
              background: 'rgba(212,175,55,0.07)',
              border: '1px solid rgba(212,175,55,0.2)',
              borderRadius: 8,
              cursor: 'default',
            }}
          >
            <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.7rem', color: '#D4AF37', letterSpacing: '0.1em' }}>
              VIEW RESULTS
            </span>
            <ChevronRight size={13} style={{ color: '#D4AF37' }} />
          </div>
        ) : isCancelled ? (
          <div
            style={{
              padding: '0.6rem',
              textAlign: 'center',
              borderRadius: 8,
              background: 'rgba(194,24,24,0.08)',
              border: '1px solid rgba(194,24,24,0.2)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.7rem', color: '#C21818', letterSpacing: '0.1em' }}>
              CANCELLED
            </span>
          </div>
        ) : (
          <button
            onClick={() => onRegister(event)}
            disabled={isFull}
            style={{
              width: '100%',
              padding: '0.65rem',
              background: isFull
                ? 'rgba(255,255,255,0.04)'
                : 'linear-gradient(135deg, #C21818 0%, #9b1212 100%)',
              border: isFull ? '1px solid rgba(255,255,255,0.1)' : 'none',
              borderRadius: 8,
              color: isFull ? '#888899' : '#fff',
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              cursor: isFull ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { if (!isFull) (e.target as HTMLButtonElement).style.opacity = '0.85'; }}
            onMouseLeave={e => { if (!isFull) (e.target as HTMLButtonElement).style.opacity = '1'; }}
          >
            {isFull ? 'FULLY BOOKED' : 'REGISTER NOW'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Registration Modal ───────────────────────────────────────────────────────

function RegistrationModal({
  event,
  onClose,
}: {
  event: Event;
  onClose: () => void;
}) {
  const [form, setForm] = useState<RegistrationForm>({
    member_name: '',
    member_email: '',
    phone: '',
    skill_level: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const { executeRecaptcha } = useRecaptcha();

  const { day, date, time } = formatEventDate(event.event_date);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.member_name.trim() || !form.member_email.trim() || !form.skill_level) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    const token = await executeRecaptcha('event_registration');
    if (token) {
      const passed = await verifyRecaptchaToken(token);
      if (!passed) {
        setError('Security check failed. Please try again.');
        setLoading(false);
        return;
      }
    }
    const ticket_id = generateTicketId();
    const { error: dbError } = await supabase.from('event_registrations').insert({
      event_id: event.id,
      member_name: form.member_name.trim(),
      member_email: form.member_email.trim(),
      phone: form.phone.trim() || null,
      skill_level: form.skill_level,
      ticket_id,
      registered_at: new Date().toISOString(),
    });
    setLoading(false);
    if (dbError) {
      setError('Registration failed. Please try again.');
      return;
    }
    setTicket({
      ticket_id,
      event_title: event.title,
      event_date: event.event_date,
      venue: event.venue,
      format: event.format,
      member_name: form.member_name.trim(),
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {ticket ? (
            <TicketCard key="ticket" ticket={ticket} onClose={onClose} />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: '#0f0f17',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              {/* Modal header */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: '#888899', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                    Register for Event
                  </p>
                  <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.4rem', color: '#e8e8ec', margin: 0, lineHeight: 1.1 }}>
                    {event.title}
                  </h2>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: '#888899', margin: '4px 0 0' }}>
                    {day}, {date} · {time} · {event.venue}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888899', padding: 4, marginTop: -2 }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { id: 'member_name', label: 'Full Name *', type: 'text', placeholder: 'Your full name' },
                  { id: 'member_email', label: 'Email Address *', type: 'email', placeholder: 'you@example.com' },
                  { id: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '+1 (555) 000-0000' },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id}>
                    <label
                      htmlFor={id}
                      style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: '#888899', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}
                    >
                      {label}
                    </label>
                    <input
                      id={id}
                      type={type}
                      placeholder={placeholder}
                      value={form[id as keyof RegistrationForm]}
                      onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        padding: '0.65rem 0.85rem',
                        color: '#e8e8ec',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                ))}

                {/* Skill level */}
                <div>
                  <label
                    htmlFor="skill_level"
                    style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: '#888899', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}
                  >
                    Skill Level *
                  </label>
                  <select
                    id="skill_level"
                    value={form.skill_level}
                    onChange={e => setForm(f => ({ ...f, skill_level: e.target.value }))}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      padding: '0.65rem 0.85rem',
                      color: form.skill_level ? '#e8e8ec' : '#888899',
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.875rem',
                      outline: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  >
                    <option value="" disabled style={{ background: '#0f0f17' }}>Select your level</option>
                    {['Beginner', 'Intermediate', 'Advanced', 'Elite'].map(level => (
                      <option key={level} value={level.toLowerCase()} style={{ background: '#0f0f17' }}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: '#C21818', margin: 0 }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: loading ? 'rgba(194,24,24,0.4)' : 'linear-gradient(135deg, #C21818 0%, #9b1212 100%)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontFamily: 'var(--font-montserrat)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.12em',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.2s',
                    marginTop: 4,
                  }}
                >
                  {loading ? 'REGISTERING…' : 'REGISTER & GET TICKET'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      if (!error && data) setEvents(data as Event[]);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const filtered = events.filter(e =>
    activeFilter === 'all' ? true : e.event_type === activeFilter
  );

  return (
    <>
      <Navbar />

      <main style={{ background: '#0a0a0f', minHeight: '100vh', color: '#e8e8ec' }}>
        {/* ── Hero ── */}
        <section
          style={{
            paddingTop: 120,
            paddingBottom: '4rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background glow */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60vw',
              height: '40vh',
              background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.75rem',
                letterSpacing: '0.25em',
                color: '#D4AF37',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}
            >
              Racquets Club Community
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                color: '#e8e8ec',
                margin: '0 0 0.5rem',
                lineHeight: 0.95,
                letterSpacing: '0.02em',
              }}
            >
              EVENTS &amp;{' '}
              <span className="text-gradient-gold">TOURNAMENTS</span>
            </h1>

            {/* Gold accent line */}
            <div
              style={{
                width: 80,
                height: 3,
                background: 'linear-gradient(90deg, #C21818, #D4AF37)',
                margin: '1.25rem auto',
                borderRadius: 2,
              }}
            />

            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '1rem',
                color: '#888899',
                maxWidth: 520,
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Compete, connect, and elevate your game. Find your next challenge on the court.
            </p>
          </motion.div>
        </section>

        {/* ── Filter Tabs ── */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem 2.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', overflowX: 'auto', alignItems: 'center', paddingBottom: '4px' }}
          >
            <Filter size={15} style={{ color: '#888899', marginRight: 4 }} />
            {FILTER_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: 20,
                  border: '1px solid',
                  borderColor: activeFilter === tab.key ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                  background: activeFilter === tab.key ? 'rgba(212,175,55,0.12)' : 'transparent',
                  color: activeFilter === tab.key ? '#D4AF37' : '#888899',
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        </section>

        {/* ── Cards Grid ── */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem 5rem' }}>
          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '5rem 1rem' }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <Calendar size={26} style={{ color: '#D4AF37' }} />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-bebas)',
                  fontSize: '1.6rem',
                  color: '#e8e8ec',
                  marginBottom: '0.5rem',
                }}
              >
                NO EVENTS FOUND
              </h3>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: '#888899' }}>
                {activeFilter === 'all'
                  ? 'No events scheduled yet. Check back soon.'
                  : 'No events in this category right now. Try a different filter.'}
              </p>
            </motion.div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {filtered.map(event => (
                <EventCard key={event.id} event={event} onRegister={setSelectedEvent} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* ── Registration Modal ── */}
      <AnimatePresence>
        {selectedEvent && (
          <RegistrationModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>

      {/* Pulse animation for skeleton + responsive styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @media (max-width: 480px) {
          .events-modal-inner { padding: 20px !important; }
          .events-countdown-value {
            font-size: clamp(0.75rem, 3vw, 1rem) !important;
          }
        }
      `}</style>
    </>
  );
}
