'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface TicketData {
  valid: boolean;
  ticket_id?: string;
  member_name?: string;
  skill_level?: string;
  registered_at?: string;
  event_title?: string;
  event_date?: string;
  venue?: string;
  event_type?: string;
  event_status?: string;
  error?: string;
}

export default function VerifyTicketPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [data, setData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/verify-ticket/${ticketId}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setData({ valid: false, error: 'Verification failed' }); setLoading(false); });
  }, [ticketId]);

  const valid = data?.valid;

  const eventDate = data?.event_date
    ? new Date(data.event_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const eventTime = data?.event_date
    ? new Date(data.event_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : null;

  const regDate = data?.registered_at
    ? new Date(data.registered_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const row = (label: string, value: string | null | undefined) =>
    value ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#888899', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 16, fontWeight: 600, color: '#e8e8ec' }}>{value}</span>
      </div>
    ) : null;

  return (
    <div style={{ background: '#080810', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420, fontFamily: 'Montserrat, sans-serif' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 16, color: '#D4AF37', letterSpacing: '0.1em', marginBottom: 4 }}>
            RACQUETS CLUB COMMUNITY
          </div>
          <div style={{ fontSize: 11, color: '#555566', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Ticket Verification
          </div>
        </div>

        {loading ? (
          <div style={{ background: '#0d0d14', borderRadius: 20, padding: '48px 24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            <div style={{ color: '#888899', fontSize: 14, letterSpacing: '0.04em' }}>Verifying ticket…</div>
          </div>
        ) : (
          <div style={{ background: '#0d0d14', borderRadius: 20, overflow: 'hidden', border: `1px solid ${valid ? 'rgba(34,197,94,0.3)' : 'rgba(194,24,24,0.3)'}`, boxShadow: `0 0 40px ${valid ? 'rgba(34,197,94,0.08)' : 'rgba(194,24,24,0.08)'}` }}>

            {/* Status banner */}
            <div style={{
              background: valid
                ? 'linear-gradient(135deg, #14532d 0%, #166534 100%)'
                : 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
              padding: '28px 24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 52, marginBottom: 8 }}>{valid ? '✅' : '❌'}</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 4 }}>
                {valid ? 'Valid Ticket' : 'Invalid Ticket'}
              </div>
              <div style={{ fontSize: 12, color: valid ? 'rgba(134,239,172,0.9)' : 'rgba(252,165,165,0.9)', letterSpacing: '0.04em' }}>
                {valid ? 'This registrant is confirmed for the event.' : 'No registration found for this ticket ID.'}
              </div>
            </div>

            {/* Ticket ID chip */}
            {ticketId && (
              <div style={{ textAlign: 'center', padding: '16px 24px 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 20, padding: '6px 16px', fontFamily: 'monospace', fontSize: 14, color: '#D4AF37', letterSpacing: '0.08em', marginBottom: 16 }}>
                  {ticketId}
                </div>
              </div>
            )}

            {valid && (
              <div style={{ padding: '0 24px 24px' }}>
                {row('Player', data?.member_name)}
                {row('Skill Level', data?.skill_level)}
                {row('Event', data?.event_title)}
                {row('Date', eventDate ?? undefined)}
                {row('Time', eventTime ?? undefined)}
                {row('Venue', data?.venue)}
                {row('Registered On', regDate ?? undefined)}

                {/* Admit stamp */}
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-block',
                    border: '3px solid rgba(34,197,94,0.5)',
                    borderRadius: 12,
                    padding: '10px 28px',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 900,
                    fontSize: 18,
                    color: '#22c55e',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    transform: 'rotate(-2deg)',
                    boxShadow: '0 0 20px rgba(34,197,94,0.15)',
                  }}>
                    ADMIT ONE
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#333344', letterSpacing: '0.06em' }}>
          racquetsclubcommunity.com · Official Verification
        </div>
      </div>
    </div>
  );
}
