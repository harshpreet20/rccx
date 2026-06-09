'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

type Member = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  skill_level?: string;
  membership_plan?: string;
  status: string;
  created_at: string;
};

type Event = {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  event_date: string;
  registration_deadline?: string;
  venue?: string;
  max_participants?: number;
  current_participants?: number;
  entry_fee?: number;
  prize_pool?: string;
  status: string;
  banner_url?: string;
};

type EventRegistration = {
  id: string;
  event_id: string;
  member_name: string;
  member_email: string;
  phone?: string;
  skill_level?: string;
  ticket_id?: string;
  registered_at: string;
  events: { title: string; event_date: string } | null;
};

type LeaderboardEntry = {
  id: string;
  player_name: string;
  elo_rating: number;
  wins: number;
  losses: number;
  streak: number;
  skill_level?: string;
  badges?: string[];
};

type Announcement = {
  id: string;
  title: string;
  body: string;
  category?: string;
  author?: string;
  image_url?: string;
  pinned: boolean;
  created_at: string;
};

type InstagramPost = {
  id: string;
  image_url: string;
  caption?: string;
  post_url?: string;
  likes?: number;
  posted_at: string;
};

type PlayerSpotlight = {
  id: string;
  player_name: string;
  tagline?: string;
  bio?: string;
  skill_level?: string;
  youtube_url?: string;
  avatar_url?: string;
  achievements?: string[];
  featured: boolean;
  display_order?: number;
};

type Sponsor = {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  tier?: string;
  category?: string;
  active: boolean;
  display_order?: number;
};

type PartnershipInquiry = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  partnership_type?: string;
  message?: string;
  status: string;
  notes?: string;
  created_at: string;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_image_url?: string;
  author: string;
  category: string;
  tags?: string[];
  published: boolean;
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
};

type AdminUser = {
  id: string;
  auth_user_id?: string;
  email: string;
  full_name?: string;
  role: string;
  active: boolean;
  last_login?: string;
  created_at: string;
};

type AiKnowledgeEntry = {
  id: string;
  title: string;
  content: string;
  category: string;
  active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
};

type SeoSuggestion = {
  priority: 'high' | 'medium' | 'low';
  category: string;
  action: string;
  impact: string;
};

type SeoAnalysisResult = {
  rankingProbability?: number;
  top3Probability?: number;
  featuredSnippetProbability?: number;
  aiCitationProbability?: number;
  keywordDifficulty?: number;
  contentScore?: number;
  seoScore?: number;
  aeoScore?: number;
  geoScore?: number;
  readabilityScore?: number;
  localSeoScore?: number;
  semanticAlignment?: number;
  entityCoverage?: number;
  queryCoverage?: number;
  intentAlignment?: number;
  serpCompetitionScore?: number;
  serpVolatility?: number;
  freshnessBias?: number;
  localRankingPotential?: number;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: SeoSuggestion[];
  billing?: { creditsUsed: number; currency: string; remainingCredits: number };
  error?: string;
};

type ChatSession = {
  id: string;
  session_key: string;
  messages: { role: string; content: string }[];
  user_agent?: string;
  page_url?: string;
  total_messages: number;
  started_at: string;
  last_message_at: string;
};

type OverviewStats = {
  totalMembers: number;
  pendingMembers: number;
  totalEvents: number;
  upcomingEvents: number;
  leaderboardEntries: number;
  announcements: number;
  instagramPosts: number;
  spotlights: number;
  sponsors: number;
  testimonials: number;
  totalRegistrations: number;
  totalNewsletterSubscribers: number;
  skillDistribution: Record<string, number>;
  membershipDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
};

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  color: '#e8e8ec',
  padding: '10px 14px',
  width: '100%',
  fontFamily: 'var(--font-inter)',
  fontSize: 14,
  boxSizing: 'border-box',
  outline: 'none',
};

const primaryBtn: React.CSSProperties = {
  background: '#C21818',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 20px',
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: '0.04em',
  cursor: 'pointer',
};

const dangerBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(194,24,24,0.4)',
  color: '#C21818',
  borderRadius: 6,
  padding: '5px 12px',
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 600,
  fontSize: 12,
  cursor: 'pointer',
};

const successBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(34,197,94,0.4)',
  color: '#22c55e',
  borderRadius: 6,
  padding: '5px 12px',
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 600,
  fontSize: 12,
  cursor: 'pointer',
};

const goldBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(212,175,55,0.4)',
  color: '#D4AF37',
  borderRadius: 6,
  padding: '5px 12px',
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 600,
  fontSize: 12,
  cursor: 'pointer',
};

const glassCard: React.CSSProperties = {
  background: 'rgba(17,17,24,0.8)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 14,
  padding: 24,
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 14px',
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: '0.08em',
  color: '#888899',
  textTransform: 'uppercase',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontFamily: 'var(--font-inter)',
  fontSize: 13,
  color: '#e8e8ec',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 11,
  fontWeight: 700,
  color: '#888899',
  letterSpacing: '0.06em',
  marginBottom: 6,
  textTransform: 'uppercase',
};

// ─── Toast component ──────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  if (!msg) return null;
  return (
    <div style={{
      padding: '10px 18px',
      borderRadius: 8,
      marginBottom: 16,
      background: type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(194,24,24,0.12)',
      border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(194,24,24,0.3)'}`,
      color: type === 'success' ? '#22c55e' : '#C21818',
      fontFamily: 'var(--font-inter)',
      fontSize: 13,
    }}>
      {msg}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ value }: { value: string }) {
  const MAP: Record<string, [string, string]> = {
    active: ['rgba(34,197,94,0.15)', '#22c55e'],
    pending: ['rgba(212,175,55,0.15)', '#D4AF37'],
    inactive: ['rgba(194,24,24,0.15)', '#C21818'],
    upcoming: ['rgba(212,175,55,0.15)', '#D4AF37'],
    ongoing: ['rgba(34,197,94,0.15)', '#22c55e'],
    completed: ['rgba(136,136,153,0.15)', '#888899'],
    cancelled: ['rgba(194,24,24,0.15)', '#C21818'],
  };
  const [bg, color] = MAP[value] ?? ['rgba(255,255,255,0.08)', '#888899'];
  return (
    <span style={{
      background: bg,
      color,
      borderRadius: 5,
      padding: '2px 8px',
      fontSize: 11,
      fontFamily: 'var(--font-montserrat)',
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    }}>
      {value}
    </span>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ title, count, action }: { title: string; count?: number; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: '#e8e8ec', letterSpacing: '0.04em', margin: 0 }}>
        {title}
        {count != null && <span style={{ fontSize: '1rem', color: '#888899', marginLeft: 8 }}>({count})</span>}
      </h2>
      {action}
    </div>
  );
}

// ─── Form section ─────────────────────────────────────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ ...glassCard, marginBottom: 24 }}>
      <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 14, color: '#D4AF37', margin: '0 0 16px 0', letterSpacing: '0.04em' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── Table placeholders ───────────────────────────────────────────────────────

function LoadingRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} style={{ ...tdStyle, textAlign: 'center', color: '#888899', padding: 32 }}>Loading…</td>
    </tr>
  );
}

function EmptyRow({ cols, msg }: { cols: number; msg: string }) {
  return (
    <tr>
      <td colSpan={cols} style={{ ...tdStyle, textAlign: 'center', color: '#888899', padding: 32 }}>{msg}</td>
    </tr>
  );
}

// ─── TAB 1: OVERVIEW ─────────────────────────────────────────────────────────

// Helper types for overview data
type LeaderboardRow = { player_name: string; elo_rating: number; wins: number; losses: number; skill_level?: string };
type RecentRegRow = { member_name: string; member_email: string; ticket_id?: string; registered_at: string; events: { title: string } | null };
type MemberRow = { skill_level?: string; membership_type?: string; status?: string };

// SVG Donut Chart component
function DonutChart({ data, colors, title }: {
  data: { label: string; value: number; pct: number }[];
  colors: string[];
  title: string;
}) {
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = 50;
  const stroke = 18;
  const circumference = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.value, 0);

  let offset = 0;
  const arcs = data.map((d, i) => {
    const dash = (d.pct / 100) * circumference;
    const gap = circumference - dash;
    const arc = { dash, gap, offset, color: colors[i] ?? '#888899', label: d.label, pct: d.pct, value: d.value };
    offset += dash;
    return arc;
  });

  return (
    <div style={{
      background: '#0d0d18',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20,
      padding: '24px 20px',
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 14, color: '#e8e8ec', marginBottom: 16, letterSpacing: '0.04em' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background ring */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth={stroke}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={-arc.offset}
              strokeLinecap="butt"
            />
          ))}
          {/* Center text (counter-rotate) */}
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            style={{ transform: `rotate(90deg)`, transformOrigin: `${cx}px ${cy}px` }}
            fill="#e8e8ec"
            fontSize={20}
            fontFamily='Arial, "Helvetica Neue", sans-serif'
            fontWeight={700}
          >
            {total}
          </text>
        </svg>
        {/* Legend */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.map((d, i) => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[i] ?? '#888899', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, color: '#888899', textTransform: 'capitalize' }}>{d.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 12, color: '#e8e8ec' }}>{d.value}</span>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#888899' }}>{d.pct.toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function OverviewModule() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [recentRegs, setRecentRegs] = useState<RecentRegRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const [
      { count: totalMembers },
      { count: pendingMembers },
      { count: totalEvents },
      { count: upcomingEvents },
      { count: leaderboardEntries },
      { count: announcements },
      { count: instagramPosts },
      { count: spotlights },
      { count: sponsors },
      { count: testimonials },
      { data: membersData },
      { count: totalRegistrations },
      { count: totalNewsletterSubscribers },
      { data: leaderboardData },
      { data: recentRegsData },
    ] = await Promise.all([
      supabase.from('members').select('*', { count: 'exact', head: true }),
      supabase.from('members').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'upcoming'),
      supabase.from('leaderboard').select('*', { count: 'exact', head: true }),
      supabase.from('announcements').select('*', { count: 'exact', head: true }),
      supabase.from('instagram_posts').select('*', { count: 'exact', head: true }),
      supabase.from('player_spotlights').select('*', { count: 'exact', head: true }),
      supabase.from('sponsors').select('*', { count: 'exact', head: true }),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }),
      supabase.from('members').select('skill_level, membership_type, status'),
      supabase.from('event_registrations').select('*', { count: 'exact', head: true }),
      supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
      supabase.from('leaderboard').select('player_name, elo_rating, wins, losses, skill_level').order('elo_rating', { ascending: false }).limit(5),
      supabase.from('event_registrations').select('member_name, member_email, ticket_id, registered_at, events(title)').order('registered_at', { ascending: false }).limit(6),
    ]);

    const rows: MemberRow[] = (membersData as MemberRow[] | null) ?? [];

    const skillDist: Record<string, number> = {};
    const membershipDist: Record<string, number> = {};
    const statusDist: Record<string, number> = {};
    for (const row of rows) {
      const skill = row.skill_level ?? 'unknown';
      const mem = row.membership_type ?? 'unknown';
      const stat = row.status ?? 'unknown';
      skillDist[skill] = (skillDist[skill] ?? 0) + 1;
      membershipDist[mem] = (membershipDist[mem] ?? 0) + 1;
      statusDist[stat] = (statusDist[stat] ?? 0) + 1;
    }

    setStats({
      totalMembers: totalMembers ?? 0,
      pendingMembers: pendingMembers ?? 0,
      totalEvents: totalEvents ?? 0,
      upcomingEvents: upcomingEvents ?? 0,
      leaderboardEntries: leaderboardEntries ?? 0,
      announcements: announcements ?? 0,
      instagramPosts: instagramPosts ?? 0,
      spotlights: spotlights ?? 0,
      sponsors: sponsors ?? 0,
      testimonials: testimonials ?? 0,
      totalRegistrations: totalRegistrations ?? 0,
      totalNewsletterSubscribers: totalNewsletterSubscribers ?? 0,
      skillDistribution: skillDist,
      membershipDistribution: membershipDist,
      statusDistribution: statusDist,
    });
    setLeaderboard((leaderboardData as LeaderboardRow[] | null) ?? []);
    setRecentRegs((recentRegsData as RecentRegRow[] | null) ?? []);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Build donut chart data from distributions
  function buildChartData(dist: Record<string, number>, keys: string[]): { label: string; value: number; pct: number }[] {
    const total = Object.values(dist).reduce((s, v) => s + v, 0) || 1;
    return keys.map(k => ({
      label: k,
      value: dist[k] ?? 0,
      pct: ((dist[k] ?? 0) / total) * 100,
    }));
  }

  const skillKeys = ['beginner', 'intermediate', 'advanced', 'elite'];
  const skillColors = ['#888899', '#3b82f6', '#D4AF37', '#C21818'];
  const memKeys = ['monthly', 'quarterly', 'annual'];
  const memColors = ['#22c55e', '#3b82f6', '#D4AF37'];
  const statusKeys = ['pending', 'active', 'inactive'];
  const statusColors = ['#f59e0b', '#22c55e', '#888899'];

  const rankColors = ['#D4AF37', '#9ca3af', '#b45309'];
  const rankLabels = ['#1', '#2', '#3'];

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 24, color: '#e8e8ec', letterSpacing: '0.04em', margin: 0 }}>
          OVERVIEW
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {lastUpdated && (
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#444455' }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button style={primaryBtn} onClick={fetchStats}>↻ Refresh</button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', padding: 40, textAlign: 'center' }}>Loading dashboard…</div>
      ) : stats ? (
        <>
          {/* ── Section 1: KPI Hero Cards ── */}
          <style>{`
            .kpi-number { font-family: Arial,"Helvetica Neue",sans-serif; font-weight: 700; font-size: clamp(36px,3.5vw,56px); line-height: 1; }
          `}</style>
          <div className="kpi-grid">
            {/* Card 1: Members */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(109,40,217,0.12) 100%)',
              border: '1px solid rgba(139,92,246,0.35)',
              borderRadius: 20, padding: '24px 20px', minHeight: 180,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 26, marginBottom: 10 }}>👥</div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>Community Members</div>
                <div className="kpi-number" style={{ color: '#c4b5fd' }}>{stats.totalMembers}</div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, color: 'rgba(196,181,253,0.7)', marginTop: 6 }}>{stats.pendingMembers} pending approval</div>
              </div>
              <div style={{ height: 3, background: 'rgba(139,92,246,0.2)', borderRadius: 4, marginTop: 16 }}>
                <div style={{ height: '100%', width: '72%', background: 'linear-gradient(to right, #8b5cf6, #c4b5fd)', borderRadius: 4 }} />
              </div>
            </div>

            {/* Card 2: Registrations */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(34,197,94,0.22) 0%, rgba(16,185,129,0.12) 100%)',
              border: '1px solid rgba(34,197,94,0.35)',
              borderRadius: 20, padding: '24px 20px', minHeight: 180,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 26, marginBottom: 10 }}>🎫</div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>Event Registrations</div>
                <div className="kpi-number" style={{ color: '#86efac' }}>{stats.totalRegistrations}</div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, color: 'rgba(134,239,172,0.7)', marginTop: 6 }}>Tickets issued</div>
              </div>
              <div style={{ height: 3, background: 'rgba(34,197,94,0.2)', borderRadius: 4, marginTop: 16 }}>
                <div style={{ height: '100%', width: '65%', background: 'linear-gradient(to right, #22c55e, #86efac)', borderRadius: 4 }} />
              </div>
            </div>

            {/* Card 3: Newsletter */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.22) 0%, rgba(234,179,8,0.12) 100%)',
              border: '1px solid rgba(245,158,11,0.35)',
              borderRadius: 20, padding: '24px 20px', minHeight: 180,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 26, marginBottom: 10 }}>📬</div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>Newsletter Reach</div>
                <div className="kpi-number" style={{ color: '#fcd34d' }}>{stats.totalNewsletterSubscribers}</div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, color: 'rgba(252,211,77,0.7)', marginTop: 6 }}>Active subscribers</div>
              </div>
              <div style={{ height: 3, background: 'rgba(245,158,11,0.2)', borderRadius: 4, marginTop: 16 }}>
                <div style={{ height: '100%', width: '80%', background: 'linear-gradient(to right, #f59e0b, #fcd34d)', borderRadius: 4 }} />
              </div>
            </div>

            {/* Card 4: Events */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(194,24,24,0.22) 0%, rgba(220,38,38,0.12) 100%)',
              border: '1px solid rgba(194,24,24,0.35)',
              borderRadius: 20, padding: '24px 20px', minHeight: 180,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 26, marginBottom: 10 }}>📅</div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>Upcoming Events</div>
                <div className="kpi-number" style={{ color: '#fca5a5' }}>{stats.upcomingEvents}</div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, color: 'rgba(252,165,165,0.7)', marginTop: 6 }}>{stats.totalEvents} total events</div>
              </div>
              <div style={{ height: 3, background: 'rgba(194,24,24,0.2)', borderRadius: 4, marginTop: 16 }}>
                <div style={{ height: '100%', width: '60%', background: 'linear-gradient(to right, #C21818, #ef4444)', borderRadius: 4 }} />
              </div>
            </div>
          </div>

          {/* ── Section 2: Donut Charts Row ── */}
          <div className="donut-grid">
            <DonutChart
              title="Skill Distribution"
              data={buildChartData(stats.skillDistribution, skillKeys)}
              colors={skillColors}
            />
            <DonutChart
              title="Membership Plans"
              data={buildChartData(stats.membershipDistribution, memKeys)}
              colors={memColors}
            />
            <DonutChart
              title="Member Status"
              data={buildChartData(stats.statusDistribution, statusKeys)}
              colors={statusColors}
            />
          </div>

          {/* ── Section 3: Recent Activity (two-column) ── */}
          <div className="activity-grid">
            {/* Recent Registrations */}
            <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px 20px' }}>
              <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 14, color: '#e8e8ec', marginBottom: 16, letterSpacing: '0.04em' }}>
                Recent Registrations
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentRegs.length === 0 ? (
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#888899', padding: '16px 0' }}>No registrations yet.</div>
                ) : recentRegs.map((reg, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 14px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 10,
                    borderLeft: '3px solid rgba(212,175,55,0.5)',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 12, color: '#D4AF37' }}>
                          {reg.ticket_id ?? '—'}
                        </span>
                        <span style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: 13, color: '#e8e8ec', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {reg.member_name}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#888899', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {reg.events?.title ?? 'Unknown Event'}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#444455', flexShrink: 0 }}>
                      {timeAgo(reg.registered_at)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Players */}
            <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px 20px' }}>
              <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 14, color: '#e8e8ec', marginBottom: 16, letterSpacing: '0.04em' }}>
                Top Players
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {leaderboard.length === 0 ? (
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#888899', padding: '16px 0' }}>No leaderboard data.</div>
                ) : leaderboard.map((player, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    background: i === 0 ? 'rgba(212,175,55,0.07)' : 'rgba(255,255,255,0.02)',
                    borderRadius: 10,
                  }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: i < 3 ? `${rankColors[i]}22` : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${i < 3 ? rankColors[i] : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Arial, "Helvetica Neue", sans-serif',
                      fontWeight: 700,
                      fontSize: 10,
                      color: i < 3 ? rankColors[i] : '#888899',
                      flexShrink: 0,
                    }}>
                      {i < 3 ? rankLabels[i] : `#${i + 1}`}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: 13, color: '#e8e8ec', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {player.player_name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#888899' }}>
                        {player.wins}W / {player.losses}L
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 14, color: i === 0 ? '#D4AF37' : '#888899', flexShrink: 0 }}>
                      {player.elo_rating}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Section 4: Sponsor Snapshot Bar ── */}
          <div style={{
            background: '#0d0d18',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20,
            padding: '20px 24px',
            marginBottom: 8,
          }}>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, color: '#444455', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>
              Sponsor Highlights
            </div>
            <div className="sponsor-grid">
              {[
                { label: 'Avg Skill Level', value: 'Intermediate' },
                { label: 'Player Retention', value: '94%' },
                { label: 'Events per Month', value: '3.2' },
                { label: 'Community Growth', value: '+12% MoM' },
              ].map(pill => (
                <div key={pill.label} style={{
                  background: 'rgba(212,175,55,0.06)',
                  border: '1px solid rgba(212,175,55,0.18)',
                  borderRadius: 16,
                  padding: '14px 18px',
                }}>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#555566', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{pill.label}</div>
                  <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 22, color: '#D4AF37' }}>{pill.value}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

// ─── TAB 2: MEMBERS ───────────────────────────────────────────────────────────

function MembersModule() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setMembers(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('members').update({ status }).eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast(`Member ${status}`, 'success'); fetchMembers(); }
  };

  const deleteMember = async (id: string) => {
    if (!window.confirm('Delete this member?')) return;
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Member deleted', 'success'); fetchMembers(); }
  };

  const pending = members.filter(m => m.status === 'pending').length;

  return (
    <div>
      <SectionHeading title="MEMBERS" count={members.length} />
      {pending > 0 && (
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#D4AF37', marginBottom: 16 }}>
          {pending} pending approval
        </p>
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div style={{ ...glassCard, padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Name', 'Email', 'Phone', 'Skill', 'Plan', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <LoadingRow cols={8} />}
            {!loading && members.length === 0 && <EmptyRow cols={8} msg="No members found." />}
            {members.map(m => (
              <tr key={m.id}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{m.full_name}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{m.email}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{m.phone ?? '—'}</td>
                <td style={tdStyle}>{m.skill_level ?? '—'}</td>
                <td style={tdStyle}>{m.membership_plan ?? '—'}</td>
                <td style={tdStyle}><StatusBadge value={m.status} /></td>
                <td style={{ ...tdStyle, color: '#888899' }}>{new Date(m.created_at).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {m.status === 'pending' && (
                      <>
                        <button style={successBtn} onClick={() => updateStatus(m.id, 'active')}>Approve</button>
                        <button style={dangerBtn} onClick={() => updateStatus(m.id, 'inactive')}>Reject</button>
                      </>
                    )}
                    {m.status === 'inactive' && (
                      <button style={successBtn} onClick={() => updateStatus(m.id, 'active')}>Activate</button>
                    )}
                    {m.status === 'active' && (
                      <button style={dangerBtn} onClick={() => updateStatus(m.id, 'inactive')}>Deactivate</button>
                    )}
                    <button style={dangerBtn} onClick={() => deleteMember(m.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB 3: REGISTRATIONS ────────────────────────────────────────────────────

function RegistrationsModule() {
  const [regs, setRegs] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRegs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*, events(title, event_date)')
      .order('registered_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setRegs((data as EventRegistration[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRegs(); }, [fetchRegs]);

  const deleteReg = async (id: string) => {
    if (!window.confirm('Delete this registration?')) return;
    const { error } = await supabase.from('event_registrations').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Registration deleted', 'success'); fetchRegs(); }
  };

  return (
    <div>
      <SectionHeading title="REGISTRATIONS" count={regs.length} />
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div style={{ ...glassCard, padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Ticket ID', 'Name', 'Email', 'Phone', 'Skill', 'Event', 'Registered At', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <LoadingRow cols={8} />}
            {!loading && regs.length === 0 && <EmptyRow cols={8} msg="No registrations found." />}
            {regs.map(r => (
              <tr key={r.id}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={tdStyle}>
                  {r.ticket_id ? (
                    <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, color: '#D4AF37', letterSpacing: '0.08em' }}>
                      {r.ticket_id}
                    </span>
                  ) : <span style={{ color: '#555566' }}>—</span>}
                </td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{r.member_name}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{r.member_email}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{r.phone ?? '—'}</td>
                <td style={tdStyle}>{r.skill_level ?? '—'}</td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{r.events?.title ?? '—'}</div>
                  {r.events?.event_date && (
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#555566' }}>
                      {new Date(r.events.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </td>
                <td style={{ ...tdStyle, color: '#888899' }}>{new Date(r.registered_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                <td style={tdStyle}>
                  <button style={dangerBtn} onClick={() => deleteReg(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB: CONTACT INBOX ───────────────────────────────────────────────────────

interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

function ContactsModule() {
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    setItems((data as ContactSubmission[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: ContactSubmission['status']) {
    const { error } = await supabase.from('contact_submissions').update({ status }).eq('id', id);
    if (error) { showToast('Update failed', 'error'); return; }
    setItems(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  }

  async function remove(id: string) {
    if (!confirm('Delete this submission?')) return;
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (error) { showToast('Delete failed', 'error'); return; }
    setItems(prev => prev.filter(c => c.id !== id));
    if (expanded === id) setExpanded(null);
    showToast('Deleted', 'success');
  }

  const STATUS_COLOR: Record<string, string> = {
    new: '#C21818',
    read: '#f59e0b',
    replied: '#22c55e',
  };

  const filtered = items.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q) ||
        c.message?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const newCount = items.filter(c => c.status === 'new').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', value: items.length, color: '#D4AF37' },
          { label: 'New', value: newCount, color: '#C21818' },
          { label: 'Read', value: items.filter(c => c.status === 'read').length, color: '#f59e0b' },
          { label: 'Replied', value: items.filter(c => c.status === 'replied').length, color: '#22c55e' },
        ].map(s => (
          <div key={s.label} style={{ ...glassCard, flex: '1 1 80px', minWidth: 80, textAlign: 'center', padding: '14px 12px' }}>
            <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, color: '#888899', letterSpacing: '0.06em', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email, subject…"
          style={{ ...inputStyle, flex: 1, minWidth: 180 }}
        />
        {(['all', 'new', 'read', 'replied'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'capitalize',
              background: filter === f ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
              color: filter === f ? '#D4AF37' : '#888899',
              borderBottom: filter === f ? '2px solid #D4AF37' : '2px solid transparent',
            }}
          >
            {f === 'all' ? `All (${items.length})` : f === 'new' ? `New (${newCount})` : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ color: '#888899', textAlign: 'center', padding: 40 }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ ...glassCard, textAlign: 'center', padding: 40, color: '#555566' }}>
          {search || filter !== 'all' ? 'No messages match your filter.' : '📩 No contact submissions yet.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(c => {
            const isOpen = expanded === c.id;
            const date = new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            const time = new Date(c.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            return (
              <div
                key={c.id}
                style={{
                  ...glassCard,
                  padding: 0,
                  overflow: 'hidden',
                  borderLeft: `3px solid ${STATUS_COLOR[c.status] ?? '#444'}`,
                  background: c.status === 'new' ? 'rgba(194,24,24,0.04)' : 'rgba(255,255,255,0.02)',
                }}
              >
                {/* Header row */}
                <div
                  onClick={() => {
                    setExpanded(isOpen ? null : c.id);
                    if (c.status === 'new') setStatus(c.id, 'read');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', cursor: 'pointer' }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${STATUS_COLOR[c.status]}, #0d0d14)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff',
                  }}>
                    {(c.full_name?.[0] ?? '?').toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 14, color: '#e8e8ec' }}>{c.full_name}</span>
                      {c.status === 'new' && (
                        <span style={{ background: '#C21818', color: '#fff', borderRadius: 4, padding: '1px 7px', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>NEW</span>
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.email}{c.subject ? ` · ${c.subject}` : ''}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, color: '#555566' }}>{date}</span>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#3a3a4a' }}>{time}</span>
                  </div>

                  <span style={{ color: '#555566', fontSize: 12, marginLeft: 4 }}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px 18px' }}>
                    {/* Contact meta */}
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 14 }}>
                      <div>
                        <div style={labelStyle}>Email</div>
                        <a href={`mailto:${c.email}`} style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#D4AF37', textDecoration: 'none' }}>{c.email}</a>
                      </div>
                      {c.phone && (
                        <div>
                          <div style={labelStyle}>Phone</div>
                          <a href={`tel:${c.phone}`} style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#D4AF37', textDecoration: 'none' }}>{c.phone}</a>
                        </div>
                      )}
                      {c.subject && (
                        <div>
                          <div style={labelStyle}>Subject</div>
                          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#e8e8ec' }}>{c.subject}</div>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '14px 16px', fontFamily: 'var(--font-inter)', fontSize: 14, color: '#c9d2df', lineHeight: 1.75, whiteSpace: 'pre-wrap', marginBottom: 16 }}>
                      {c.message}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      <a
                        href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject || 'Your enquiry to RCC')}`}
                        onClick={() => setStatus(c.id, 'replied')}
                        style={{ ...goldBtn, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        ✉ Reply via Email
                      </a>
                      {c.status !== 'replied' && (
                        <button onClick={() => setStatus(c.id, 'replied')} style={goldBtn}>Mark Replied</button>
                      )}
                      {c.status === 'replied' && (
                        <button onClick={() => setStatus(c.id, 'read')} style={{ ...goldBtn, background: 'rgba(255,255,255,0.05)', color: '#888899' }}>Mark Unread</button>
                      )}
                      <button onClick={() => remove(c.id)} style={{ ...dangerBtn, marginLeft: 'auto' }}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── TAB: SUPPORT TICKETS ─────────────────────────────────────────────────────

interface SupportTicket {
  id: string;
  ticket_number: string;
  name: string;
  email: string;
  phone: string | null;
  category: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const TICKET_PRIORITY_COLOR: Record<string, string> = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444', urgent: '#C21818' };
const TICKET_STATUS_COLOR:   Record<string, string> = { open: '#C21818', in_progress: '#f59e0b', resolved: '#22c55e', closed: '#555566' };
const TICKET_STATUS_LABEL:   Record<string, string> = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' };
const TICKET_CAT_LABEL:      Record<string, string> = {
  general: 'General', event: 'Event Issue', membership: 'Membership',
  payment: 'Payment', court_booking: 'Court Booking', technical: 'Technical', other: 'Other',
};

function SupportTicketsModule() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savingNotes, setSavingNotes] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
    const t = (data as SupportTicket[]) ?? [];
    setTickets(t);
    const n: Record<string, string> = {};
    t.forEach(tk => { n[tk.id] = tk.admin_notes ?? ''; });
    setNotes(n);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: SupportTicket['status']) {
    const { error } = await supabase.from('support_tickets').update({ status }).eq('id', id);
    if (error) { showToast('Update failed', 'error'); return; }
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  }

  async function saveNotes(id: string) {
    setSavingNotes(id);
    const { error } = await supabase.from('support_tickets').update({ admin_notes: notes[id] ?? '' }).eq('id', id);
    setSavingNotes(null);
    if (error) showToast('Failed to save notes', 'error');
    else { showToast('Notes saved', 'success'); setTickets(prev => prev.map(t => t.id === id ? { ...t, admin_notes: notes[id] } : t)); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this ticket?')) return;
    const { error } = await supabase.from('support_tickets').delete().eq('id', id);
    if (error) { showToast('Delete failed', 'error'); return; }
    setTickets(prev => prev.filter(t => t.id !== id));
    if (expanded === id) setExpanded(null);
    showToast('Deleted', 'success');
  }

  const filtered = tickets.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name?.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) || t.ticket_number?.toLowerCase().includes(q);
    }
    return true;
  });

  const openCount = tickets.filter(t => t.status === 'open').length;
  const urgentCount = tickets.filter(t => t.priority === 'urgent' && t.status === 'open').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', value: tickets.length, color: '#D4AF37' },
          { label: 'Open', value: openCount, color: '#C21818' },
          { label: 'In Progress', value: tickets.filter(t => t.status === 'in_progress').length, color: '#f59e0b' },
          { label: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length, color: '#22c55e' },
          { label: 'Urgent', value: urgentCount, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={{ ...glassCard, flex: '1 1 70px', minWidth: 70, textAlign: 'center', padding: '14px 10px' }}>
            <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#888899', letterSpacing: '0.05em', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ticket, name, email…" style={{ ...inputStyle, flex: 1, minWidth: 180 }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
          <option value="all">All Statuses</option>
          {['open','in_progress','resolved','closed'].map(s => <option key={s} value={s}>{TICKET_STATUS_LABEL[s]}</option>)}
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
          <option value="all">All Priorities</option>
          {['urgent','high','medium','low'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
        </select>
      </div>

      {/* Tickets list */}
      {loading ? (
        <div style={{ color: '#888899', textAlign: 'center', padding: 40 }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ ...glassCard, textAlign: 'center', padding: 40, color: '#555566' }}>
          {search || statusFilter !== 'all' || priorityFilter !== 'all' ? 'No tickets match your filters.' : '🎫 No support tickets yet.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(t => {
            const isOpen = expanded === t.id;
            const date = new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            const time = new Date(t.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={t.id} style={{ ...glassCard, padding: 0, overflow: 'hidden', borderLeft: `3px solid ${TICKET_PRIORITY_COLOR[t.priority] ?? '#444'}` }}>

                {/* Row */}
                <div onClick={() => setExpanded(isOpen ? null : t.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', cursor: 'pointer' }}>
                  <div style={{ minWidth: 52, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#555566', letterSpacing: '0.04em' }}>{t.ticket_number}</div>
                    <div style={{ display: 'inline-block', background: `${TICKET_PRIORITY_COLOR[t.priority]}22`, color: TICKET_PRIORITY_COLOR[t.priority], borderRadius: 4, padding: '2px 6px', fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', marginTop: 2, textTransform: 'uppercase' }}>{t.priority}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 13, color: '#e8e8ec', marginBottom: 2 }}>{t.subject}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#888899' }}>{t.name} · {t.email} · {TICKET_CAT_LABEL[t.category] ?? t.category}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span style={{ background: `${TICKET_STATUS_COLOR[t.status]}22`, color: TICKET_STATUS_COLOR[t.status], borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{TICKET_STATUS_LABEL[t.status]}</span>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#555566' }}>{date} {time}</span>
                  </div>
                  <span style={{ color: '#555566', fontSize: 12, marginLeft: 4 }}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px 18px' }}>
                    {/* Meta */}
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 14 }}>
                      <div><div style={labelStyle}>Email</div><a href={`mailto:${t.email}`} style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#D4AF37', textDecoration: 'none' }}>{t.email}</a></div>
                      {t.phone && <div><div style={labelStyle}>Phone</div><span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#e8e8ec' }}>{t.phone}</span></div>}
                      <div><div style={labelStyle}>Category</div><span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#e8e8ec' }}>{TICKET_CAT_LABEL[t.category]}</span></div>
                      <div><div style={labelStyle}>Submitted</div><span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#e8e8ec' }}>{date} {time}</span></div>
                    </div>

                    {/* Description */}
                    <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '14px 16px', fontFamily: 'var(--font-inter)', fontSize: 14, color: '#c9d2df', lineHeight: 1.75, whiteSpace: 'pre-wrap', marginBottom: 16 }}>
                      {t.description}
                    </div>

                    {/* Admin notes */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>Admin Notes (internal)</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <textarea
                          value={notes[t.id] ?? ''}
                          onChange={e => setNotes(n => ({ ...n, [t.id]: e.target.value }))}
                          rows={3} placeholder="Internal notes visible only to admins…"
                          style={{ ...inputStyle, flex: 1, resize: 'vertical', fontFamily: 'var(--font-inter)' }}
                        />
                        <button onClick={() => saveNotes(t.id)} disabled={savingNotes === t.id} style={{ ...goldBtn, alignSelf: 'flex-end', flexShrink: 0 }}>
                          {savingNotes === t.id ? '…' : 'Save'}
                        </button>
                      </div>
                    </div>

                    {/* Status + Actions */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      <a href={`mailto:${t.email}?subject=Re: [${t.ticket_number}] ${t.subject}`} style={{ ...goldBtn, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        ✉ Reply
                      </a>
                      {(['open','in_progress','resolved','closed'] as const).filter(s => s !== t.status).map(s => (
                        <button key={s} onClick={() => updateStatus(t.id, s)} style={{ ...goldBtn, background: 'rgba(255,255,255,0.05)', color: '#888899', fontSize: 11 }}>
                          → {TICKET_STATUS_LABEL[s]}
                        </button>
                      ))}
                      <button onClick={() => remove(t.id)} style={{ ...dangerBtn, marginLeft: 'auto' }}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── TAB 4: EVENTS ────────────────────────────────────────────────────────────

function EventsModule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', event_type: 'weekend_tournament',
    event_date: '', registration_deadline: '', venue: '',
    max_participants: '', entry_fee: '', prize_pool: '',
    status: 'upcoming', banner_url: '',
  });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setEvents(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const createEvent = async () => {
    const payload = {
      title: form.title,
      description: form.description || null,
      event_type: form.event_type,
      event_date: form.event_date || null,
      registration_deadline: form.registration_deadline || null,
      venue: form.venue || null,
      max_participants: form.max_participants ? parseInt(form.max_participants) : null,
      entry_fee: form.entry_fee ? parseFloat(form.entry_fee) : null,
      prize_pool: form.prize_pool || null,
      status: form.status,
      banner_url: form.banner_url || null,
    };
    const { error } = await supabase.from('events').insert([payload]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Event created!', 'success');
      setForm({ title: '', description: '', event_type: 'weekend_tournament', event_date: '', registration_deadline: '', venue: '', max_participants: '', entry_fee: '', prize_pool: '', status: 'upcoming', banner_url: '' });
      setShowForm(false);
      fetchEvents();
    }
  };

  const deleteEvent = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Event deleted', 'success'); fetchEvents(); }
  };

  const textFields: { key: string; label: string; type: string }[] = [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'venue', label: 'Venue', type: 'text' },
    { key: 'event_date', label: 'Date & Time', type: 'datetime-local' },
    { key: 'registration_deadline', label: 'Registration Deadline', type: 'datetime-local' },
    { key: 'max_participants', label: 'Max Participants', type: 'number' },
    { key: 'entry_fee', label: 'Entry Fee', type: 'number' },
    { key: 'prize_pool', label: 'Prize Pool', type: 'text' },
    { key: 'banner_url', label: 'Banner URL', type: 'text' },
  ];

  return (
    <div>
      <SectionHeading
        title="EVENTS"
        count={events.length}
        action={<button style={primaryBtn} onClick={() => setShowForm(v => !v)}>{showForm ? 'Cancel' : '+ Create Event'}</button>}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showForm && (
        <FormSection title="NEW EVENT">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {textFields.map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} value={(form as Record<string, string>)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Event Type</label>
              <select value={form.event_type} onChange={e => setForm(p => ({ ...p, event_type: e.target.value }))} style={inputStyle}>
                {['weekend_tournament', 'ladder_league', 'smash_night', 'corporate_cup', 'open_session'].map(t => (
                  <option key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
                {['upcoming', 'ongoing', 'completed', 'cancelled'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          {form.banner_url && (
            <div style={{ marginTop: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.banner_url} alt="Banner preview" style={{ height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <button style={{ ...primaryBtn, marginTop: 16 }} onClick={createEvent}>Create Event</button>
        </FormSection>
      )}

      <div style={{ ...glassCard, padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Title', 'Type', 'Date', 'Participants', 'Fee', 'Status', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <LoadingRow cols={7} />}
            {!loading && events.length === 0 && <EmptyRow cols={7} msg="No events found." />}
            {events.map(ev => (
              <tr key={ev.id}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{ev.title}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{ev.event_type?.replace(/_/g, ' ')}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{ev.event_date ? new Date(ev.event_date).toLocaleDateString() : '—'}</td>
                <td style={tdStyle}>{ev.current_participants ?? 0} / {ev.max_participants ?? '∞'}</td>
                <td style={tdStyle}>{ev.entry_fee != null ? `$${ev.entry_fee}` : '—'}</td>
                <td style={tdStyle}><StatusBadge value={ev.status} /></td>
                <td style={tdStyle}>
                  <button style={dangerBtn} onClick={() => deleteEvent(ev.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB 5: LEADERBOARD ───────────────────────────────────────────────────────

function LeaderboardModule() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ elo_rating: '', wins: '', losses: '', streak: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ player_name: '', elo_rating: '1200', wins: '0', losses: '0', streak: '0', skill_level: 'intermediate', badges: '' });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('leaderboard').select('*').order('elo_rating', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setEntries(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const startEdit = (e: LeaderboardEntry) => {
    setEditId(e.id);
    setEditForm({ elo_rating: String(e.elo_rating), wins: String(e.wins), losses: String(e.losses), streak: String(e.streak) });
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase.from('leaderboard').update({
      elo_rating: Number(editForm.elo_rating),
      wins: Number(editForm.wins),
      losses: Number(editForm.losses),
      streak: Number(editForm.streak),
    }).eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Updated!', 'success'); setEditId(null); fetchEntries(); }
  };

  const deleteEntry = async (id: string) => {
    if (!window.confirm('Delete this player?')) return;
    const { error } = await supabase.from('leaderboard').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Deleted', 'success'); fetchEntries(); }
  };

  const addPlayer = async () => {
    const payload = {
      player_name: addForm.player_name,
      elo_rating: parseInt(addForm.elo_rating) || 1200,
      wins: parseInt(addForm.wins) || 0,
      losses: parseInt(addForm.losses) || 0,
      streak: parseInt(addForm.streak) || 0,
      skill_level: addForm.skill_level || null,
      badges: addForm.badges ? addForm.badges.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    const { error } = await supabase.from('leaderboard').insert([payload]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Player added!', 'success');
      setAddForm({ player_name: '', elo_rating: '1200', wins: '0', losses: '0', streak: '0', skill_level: 'intermediate', badges: '' });
      setShowAdd(false);
      fetchEntries();
    }
  };

  const numInput = (val: string, onChange: (v: string) => void) => (
    <input type="number" value={val} onChange={e => onChange(e.target.value)}
      style={{ ...inputStyle, width: 70, padding: '4px 8px', fontSize: 12 }} />
  );

  const addFields: { key: string; label: string; type: string }[] = [
    { key: 'player_name', label: 'Player Name', type: 'text' },
    { key: 'elo_rating', label: 'ELO Rating', type: 'number' },
    { key: 'wins', label: 'Wins', type: 'number' },
    { key: 'losses', label: 'Losses', type: 'number' },
    { key: 'streak', label: 'Streak', type: 'number' },
  ];

  return (
    <div>
      <SectionHeading
        title="LEADERBOARD"
        count={entries.length}
        action={<button style={primaryBtn} onClick={() => setShowAdd(v => !v)}>{showAdd ? 'Cancel' : '+ Add Player'}</button>}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showAdd && (
        <FormSection title="ADD PLAYER">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {addFields.map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} value={(addForm as Record<string, string>)[f.key]}
                  onChange={e => setAddForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Skill Level</label>
              <select value={addForm.skill_level} onChange={e => setAddForm(p => ({ ...p, skill_level: e.target.value }))} style={inputStyle}>
                {['beginner', 'intermediate', 'advanced', 'elite'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Badges (comma-separated)</label>
              <input type="text" value={addForm.badges} onChange={e => setAddForm(p => ({ ...p, badges: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <button style={{ ...primaryBtn, marginTop: 16 }} onClick={addPlayer}>Add Player</button>
        </FormSection>
      )}

      <div style={{ ...glassCard, padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['#', 'Name', 'ELO', 'Wins', 'Losses', 'W/L%', 'Streak', 'Skill', 'Badges', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <LoadingRow cols={10} />}
            {!loading && entries.length === 0 && <EmptyRow cols={10} msg="No entries found." />}
            {entries.map((e, i) => {
              const wlPct = (e.wins + e.losses) > 0 ? Math.round((e.wins / (e.wins + e.losses)) * 100) : 0;
              return (
                <tr key={e.id}
                  onMouseEnter={el => (el.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={el => (el.currentTarget.style.background = 'transparent')}>
                  <td style={{ ...tdStyle, color: '#888899' }}>#{i + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{e.player_name}</td>
                  <td style={tdStyle}>
                    {editId === e.id
                      ? numInput(editForm.elo_rating, v => setEditForm(p => ({ ...p, elo_rating: v })))
                      : <span style={{ color: '#D4AF37', fontWeight: 700 }}>{e.elo_rating}</span>}
                  </td>
                  <td style={tdStyle}>
                    {editId === e.id ? numInput(editForm.wins, v => setEditForm(p => ({ ...p, wins: v }))) : e.wins}
                  </td>
                  <td style={tdStyle}>
                    {editId === e.id ? numInput(editForm.losses, v => setEditForm(p => ({ ...p, losses: v }))) : e.losses}
                  </td>
                  <td style={{ ...tdStyle, color: wlPct >= 50 ? '#22c55e' : '#888899' }}>{wlPct}%</td>
                  <td style={tdStyle}>
                    {editId === e.id ? numInput(editForm.streak, v => setEditForm(p => ({ ...p, streak: v }))) : e.streak}
                  </td>
                  <td style={{ ...tdStyle, color: '#888899' }}>{e.skill_level ?? '—'}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {(e.badges ?? []).map(b => (
                        <span key={b} style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700 }}>{b}</span>
                      ))}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {editId === e.id ? (
                        <>
                          <button style={successBtn} onClick={() => saveEdit(e.id)}>Save</button>
                          <button style={dangerBtn} onClick={() => setEditId(null)}>Cancel</button>
                        </>
                      ) : (
                        <button style={goldBtn} onClick={() => startEdit(e)}>Edit</button>
                      )}
                      <button style={dangerBtn} onClick={() => deleteEntry(e.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB 6: ANNOUNCEMENTS ────────────────────────────────────────────────────

function AnnouncementsModule() {
  const [posts, setPosts] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', category: 'general', author: 'RCC Admin', image_url: '', pinned: false });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setPosts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const createPost = async () => {
    const { error } = await supabase.from('announcements').insert([{
      title: form.title,
      body: form.body,
      category: form.category,
      author: form.author || null,
      image_url: form.image_url || null,
      pinned: form.pinned,
    }]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Announcement posted!', 'success');
      setForm({ title: '', body: '', category: 'general', author: 'RCC Admin', image_url: '', pinned: false });
      setShowForm(false);
      fetchPosts();
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Deleted', 'success'); fetchPosts(); }
  };

  const togglePin = async (id: string, pinned: boolean) => {
    const { error } = await supabase.from('announcements').update({ pinned: !pinned }).eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast(pinned ? 'Unpinned' : 'Pinned!', 'success'); fetchPosts(); }
  };

  const catColor: Record<string, string> = {
    match_result: '#D4AF37', event: '#22c55e', announcement: '#888899', achievement: '#C21818', general: '#888899',
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div>
      <SectionHeading
        title="ANNOUNCEMENTS"
        count={posts.length}
        action={<button style={primaryBtn} onClick={() => setShowForm(v => !v)}>{showForm ? 'Cancel' : '+ New Post'}</button>}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showForm && (
        <FormSection title="NEW ANNOUNCEMENT">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Author</label>
              <input type="text" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inputStyle}>
                {['match_result', 'event', 'announcement', 'achievement', 'general'].map(c => (
                  <option key={c} value={c}>{c.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Image URL (optional)</label>
              <input type="text" value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Body</label>
            <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-inter)', fontSize: 13, color: '#e8e8ec', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.pinned} onChange={e => setForm(p => ({ ...p, pinned: e.target.checked }))} />
              Pin this post
            </label>
            <button style={primaryBtn} onClick={createPost}>Post</button>
          </div>
        </FormSection>
      )}

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', padding: 24 }}>Loading…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {posts.map(p => (
            <div key={p.id} style={glassCard}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    {p.pinned && (
                      <span style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700 }}>
                        📌 PINNED
                      </span>
                    )}
                    <span style={{ background: `${catColor[p.category ?? 'general']}22`, color: catColor[p.category ?? 'general'] ?? '#888899', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {p.category ?? 'general'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#888899' }}>{timeAgo(p.created_at)}</span>
                    {p.author && <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#888899' }}>by {p.author}</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15, color: '#e8e8ec', marginBottom: 6 }}>{p.title}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#888899', lineHeight: 1.6 }}>
                    {p.body?.slice(0, 120)}{(p.body?.length ?? 0) > 120 ? '…' : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  <button style={goldBtn} onClick={() => togglePin(p.id, p.pinned)}>{p.pinned ? 'Unpin' : 'Pin'}</button>
                  <button style={dangerBtn} onClick={() => deletePost(p.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', ...glassCard, textAlign: 'center', color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 14 }}>
              No announcements yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TAB 7: INSTAGRAM ────────────────────────────────────────────────────────

function InstagramModule() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ image_url: '', caption: '', post_url: '', likes: '' });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('instagram_posts').select('*').order('posted_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setPosts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const addPost = async () => {
    const payload = {
      image_url: form.image_url,
      caption: form.caption || null,
      post_url: form.post_url || null,
      likes: form.likes ? parseInt(form.likes) : 0,
      posted_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('instagram_posts').insert([payload]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Post added!', 'success');
      setForm({ image_url: '', caption: '', post_url: '', likes: '' });
      setShowForm(false);
      fetchPosts();
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm('Delete this post?')) return;
    const { error } = await supabase.from('instagram_posts').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Deleted', 'success'); fetchPosts(); }
  };

  const igFields: { key: string; label: string; type: string }[] = [
    { key: 'image_url', label: 'Image URL', type: 'text' },
    { key: 'post_url', label: 'Post URL', type: 'text' },
    { key: 'likes', label: 'Likes', type: 'number' },
  ];

  return (
    <div>
      <SectionHeading
        title="INSTAGRAM POSTS"
        count={posts.length}
        action={<button style={primaryBtn} onClick={() => setShowForm(v => !v)}>{showForm ? 'Cancel' : '+ Add Post'}</button>}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showForm && (
        <FormSection title="NEW INSTAGRAM POST">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
            {igFields.map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} value={(form as Record<string, string>)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Caption</label>
            <textarea value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <button style={primaryBtn} onClick={addPost}>Add Post</button>
        </FormSection>
      )}

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', padding: 24 }}>Loading…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {posts.map(p => (
            <div key={p.id}
              style={{ ...glassCard, padding: 0, overflow: 'hidden', position: 'relative' }}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}>
              <div style={{ position: 'relative', height: 180, background: '#111118' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image_url} alt={p.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.opacity = '0'; }} />
                {hoveredId === p.id && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button style={{ ...dangerBtn, background: 'rgba(194,24,24,0.8)' }} onClick={() => deletePost(p.id)}>Delete</button>
                  </div>
                )}
              </div>
              <div style={{ padding: '10px 12px' }}>
                {p.caption && (
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899', lineHeight: 1.5, marginBottom: 6 }}>
                    {p.caption.slice(0, 100)}{(p.caption?.length ?? 0) > 100 ? '…' : ''}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#D4AF37' }}>♥ {p.likes ?? 0}</span>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#888899' }}>{new Date(p.posted_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', ...glassCard, textAlign: 'center', color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 14 }}>
              No posts yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TAB 8: PLAYER SPOTLIGHTS ─────────────────────────────────────────────────

function SpotlightsModule() {
  const [spotlights, setSpotlights] = useState<PlayerSpotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    player_name: '', tagline: '', bio: '', skill_level: 'intermediate',
    achievements: '', youtube_url: '', avatar_url: '', featured: false,
  });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSpotlights = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('player_spotlights')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setSpotlights(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSpotlights(); }, [fetchSpotlights]);

  const createSpotlight = async () => {
    const payload = {
      player_name: form.player_name,
      tagline: form.tagline || null,
      bio: form.bio || null,
      skill_level: form.skill_level,
      youtube_url: form.youtube_url || null,
      avatar_url: form.avatar_url || null,
      achievements: form.achievements ? form.achievements.split(',').map(s => s.trim()).filter(Boolean) : [],
      featured: form.featured,
    };
    const { error } = await supabase.from('player_spotlights').insert([payload]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Spotlight created!', 'success');
      setForm({ player_name: '', tagline: '', bio: '', skill_level: 'intermediate', achievements: '', youtube_url: '', avatar_url: '', featured: false });
      setShowForm(false);
      fetchSpotlights();
    }
  };

  const deleteSpotlight = async (id: string) => {
    if (!window.confirm('Delete this spotlight?')) return;
    const { error } = await supabase.from('player_spotlights').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Deleted', 'success'); fetchSpotlights(); }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    const { error } = await supabase.from('player_spotlights').update({ featured: !featured }).eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast(featured ? 'Unfeatured' : 'Featured!', 'success'); fetchSpotlights(); }
  };

  const spFields: { key: string; label: string }[] = [
    { key: 'player_name', label: 'Player Name' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'youtube_url', label: 'YouTube URL' },
    { key: 'avatar_url', label: 'Avatar URL' },
  ];

  return (
    <div>
      <SectionHeading
        title="PLAYER SPOTLIGHTS"
        count={spotlights.length}
        action={<button style={primaryBtn} onClick={() => setShowForm(v => !v)}>{showForm ? 'Cancel' : '+ New Spotlight'}</button>}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showForm && (
        <FormSection title="NEW SPOTLIGHT">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
            {spFields.map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input type="text" value={String((form as Record<string, unknown>)[f.key] ?? '')}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Skill Level</label>
              <select value={form.skill_level} onChange={e => setForm(p => ({ ...p, skill_level: e.target.value }))} style={inputStyle}>
                {['beginner', 'intermediate', 'advanced', 'elite'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Achievements (comma-separated)</label>
            <input type="text" value={form.achievements} onChange={e => setForm(p => ({ ...p, achievements: e.target.value }))} style={inputStyle} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-inter)', fontSize: 13, color: '#e8e8ec', cursor: 'pointer', marginBottom: 16 }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
            Featured spotlight
          </label>
          <button style={primaryBtn} onClick={createSpotlight}>Create Spotlight</button>
        </FormSection>
      )}

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', padding: 24 }}>Loading…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {spotlights.map(s => (
            <div key={s.id} style={glassCard}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {s.featured && (
                    <span style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700, display: 'inline-block', marginBottom: 6 }}>★ FEATURED</span>
                  )}
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15, color: '#e8e8ec', margin: '0 0 4px 0' }}>{s.player_name}</h3>
                  {s.tagline && <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899' }}>{s.tagline}</div>}
                </div>
                <span style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700, flexShrink: 0 }}>{s.skill_level}</span>
              </div>
              {s.bio && (
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899', lineHeight: 1.6, marginBottom: 10 }}>
                  {s.bio.slice(0, 150)}{(s.bio?.length ?? 0) > 150 ? '…' : ''}
                </p>
              )}
              {(s.achievements ?? []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                  {(s.achievements ?? []).slice(0, 3).map(a => (
                    <span key={a} style={{ background: 'rgba(255,255,255,0.06)', color: '#888899', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-inter)' }}>{a}</span>
                  ))}
                </div>
              )}
              {s.youtube_url && (
                <a href={s.youtube_url} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#C21818', textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>
                  ▶ Watch on YouTube
                </a>
              )}
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={goldBtn} onClick={() => toggleFeatured(s.id, s.featured)}>{s.featured ? 'Unfeature' : 'Feature'}</button>
                <button style={dangerBtn} onClick={() => deleteSpotlight(s.id)}>Delete</button>
              </div>
            </div>
          ))}
          {spotlights.length === 0 && (
            <div style={{ gridColumn: '1 / -1', ...glassCard, textAlign: 'center', color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 14 }}>
              No spotlights yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TAB 9: PARTNERS ─────────────────────────────────────────────────────────

function PartnersModule() {
  const [subTab, setSubTab] = useState<'sponsors' | 'inquiries'>('sponsors');
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', logo_url: '', website_url: '', tier: '', category: '', display_order: '0', active: true });
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inquiries state
  const [inquiries, setInquiries] = useState<PartnershipInquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<PartnershipInquiry | null>(null);
  const [updatingInquiry, setUpdatingInquiry] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSponsors = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('sponsors').select('*').order('display_order', { ascending: true });
    if (error) showToast(error.message, 'error');
    else setSponsors(data ?? []);
    setLoading(false);
  }, []);

  const fetchInquiries = useCallback(async () => {
    setInquiriesLoading(true);
    const { data, error } = await supabase.from('partnership_inquiries').select('*').order('created_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setInquiries((data ?? []) as PartnershipInquiry[]);
    setInquiriesLoading(false);
  }, []);

  useEffect(() => { fetchSponsors(); fetchInquiries(); }, [fetchSponsors, fetchInquiries]);

  async function updateInquiryStatus(id: string, status: string, notes: string) {
    setUpdatingInquiry(true);
    const { error } = await supabase.from('partnership_inquiries').update({ status, notes }).eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Updated!', 'success'); setSelectedInquiry(null); fetchInquiries(); }
    setUpdatingInquiry(false);
  }

  async function handleLogoUpload(file: File) {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('partner-logos').upload(fileName, file, { upsert: false });
    if (uploadError) { showToast('Upload failed: ' + uploadError.message, 'error'); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('partner-logos').getPublicUrl(fileName);
    setForm(f => ({ ...f, logo_url: urlData.publicUrl }));
    showToast('Logo uploaded!', 'success');
    setUploading(false);
  }

  const addPartner = async () => {
    const payload = {
      name: form.name,
      logo_url: form.logo_url || null,
      website_url: form.website_url || null,
      tier: form.tier || null,
      category: form.category || null,
      display_order: parseInt(form.display_order) || 0,
      active: form.active,
    };
    const { error } = await supabase.from('sponsors').insert([payload]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Partner added!', 'success');
      setForm({ name: '', logo_url: '', website_url: '', tier: '', category: '', display_order: '0', active: true });
      setShowForm(false);
      fetchSponsors();
    }
  };

  const deleteSponsor = async (id: string, logoUrl?: string) => {
    if (!window.confirm('Delete this partner?')) return;
    if (logoUrl && logoUrl.includes('partner-logos')) {
      const path = logoUrl.split('/partner-logos/')[1];
      if (path) await supabase.storage.from('partner-logos').remove([path]);
    }
    const { error } = await supabase.from('sponsors').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Partner deleted', 'success'); fetchSponsors(); }
  };

  const toggleActive = async (id: string, active: boolean) => {
    const { error } = await supabase.from('sponsors').update({ active: !active }).eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast(active ? 'Deactivated' : 'Activated!', 'success'); fetchSponsors(); }
  };

  const statusColors: Record<string, string> = {
    new: '#D4AF37', reviewing: '#60a5fa', accepted: '#22c55e', rejected: '#C21818', default: '#888899',
  };

  return (
    <div>
      <SectionHeading title="PARTNERS" count={sponsors.length} />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Sub-tab switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['sponsors', 'inquiries'] as const).map(t => (
          <button key={t} onClick={() => setSubTab(t)} style={{
            padding: '7px 16px', borderRadius: 8, border: '1px solid',
            borderColor: subTab === t ? 'rgba(194,24,24,0.4)' : 'rgba(255,255,255,0.08)',
            background: subTab === t ? 'rgba(194,24,24,0.12)' : 'transparent',
            color: subTab === t ? '#C21818' : 'rgba(255,255,255,0.4)',
            fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}>
            {t === 'sponsors' ? `Sponsors (${sponsors.length})` : `Inquiries (${inquiries.length})`}
          </button>
        ))}
      </div>

      {subTab === 'inquiries' && (
        <div>
          {selectedInquiry ? (
            <InquiryDetail
              inquiry={selectedInquiry}
              updating={updatingInquiry}
              onClose={() => setSelectedInquiry(null)}
              onSave={(status, notes) => updateInquiryStatus(selectedInquiry.id, status, notes)}
            />
          ) : (
            <div style={{ ...glassCard, padding: 0, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['Company', 'Contact', 'Email', 'Type', 'Status', 'Date', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {inquiriesLoading && <LoadingRow cols={7} />}
                  {!inquiriesLoading && inquiries.length === 0 && <EmptyRow cols={7} msg="No inquiries yet." />}
                  {inquiries.map(inq => (
                    <tr key={inq.id}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{inq.company_name}</td>
                      <td style={tdStyle}>{inq.contact_name}</td>
                      <td style={{ ...tdStyle, color: '#D4AF37' }}><a href={`mailto:${inq.email}`} style={{ color: '#D4AF37' }}>{inq.email}</a></td>
                      <td style={{ ...tdStyle, color: '#888899' }}>{inq.partnership_type ?? '—'}</td>
                      <td style={tdStyle}>
                        <span style={{ color: statusColors[inq.status] ?? statusColors.default, fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>
                          {inq.status}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, color: '#888899' }}>{new Date(inq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td style={tdStyle}>
                        <button style={primaryBtn} onClick={() => setSelectedInquiry(inq)}>Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {subTab === 'sponsors' && <>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button style={primaryBtn} onClick={() => setShowForm(v => !v)}>{showForm ? 'Cancel' : '+ Add Partner'}</button>
        </div>

      {showForm && (
        <FormSection title="NEW PARTNER">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
            {[
              { key: 'name', label: 'Name', type: 'text' },
              { key: 'website_url', label: 'Website URL', type: 'text' },
              { key: 'tier', label: 'Tier (e.g. Gold Partner)', type: 'text' },
              { key: 'category', label: 'Category (e.g. Equipment)', type: 'text' },
              { key: 'display_order', label: 'Display Order', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} value={(form as Record<string, string | boolean>)[f.key] as string}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
          </div>

          {/* Logo upload */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Logo</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{ ...primaryBtn, background: uploading ? 'rgba(194,24,24,0.4)' : '#C21818', padding: '9px 16px', fontSize: 12 }}
              >
                {uploading ? 'Uploading...' : '⬆ Upload Logo'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }}
              />
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#555566' }}>or paste URL below</span>
            </div>
            <input
              type="text"
              placeholder="https://... (auto-filled after upload)"
              value={form.logo_url}
              onChange={e => setForm(p => ({ ...p, logo_url: e.target.value }))}
              style={{ ...inputStyle, marginTop: 8 }}
            />
            {form.logo_url && (
              <div style={{ marginTop: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.logo_url} alt="Logo preview" style={{ height: 64, objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-inter)', fontSize: 13, color: '#e8e8ec', cursor: 'pointer', marginBottom: 16 }}>
            <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
            Active
          </label>
          <button style={primaryBtn} onClick={addPartner}>Add Partner</button>
        </FormSection>
      )}

      <div style={{ ...glassCard, padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['#', 'Logo', 'Name', 'Tier', 'Category', 'Website', 'Active', 'Order', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <LoadingRow cols={9} />}
            {!loading && sponsors.length === 0 && <EmptyRow cols={9} msg="No partners found." />}
            {sponsors.map((s, i) => (
              <tr key={s.id}
                style={{ opacity: s.active ? 1 : 0.45 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ ...tdStyle, color: '#888899' }}>{i + 1}</td>
                <td style={tdStyle}>
                  {s.logo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={s.logo_url} alt={s.name} style={{ height: 40, objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: 4, borderRadius: 4 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <span style={{ color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 12 }}>No logo</span>
                  )}
                </td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{s.name}</td>
                <td style={{ ...tdStyle, color: '#D4AF37' }}>{s.tier ?? '—'}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{s.category ?? '—'}</td>
                <td style={tdStyle}>
                  {s.website_url ? (
                    <a href={s.website_url} target="_blank" rel="noreferrer" style={{ color: '#D4AF37', fontFamily: 'var(--font-inter)', fontSize: 12 }}>
                      {s.website_url.replace(/^https?:\/\//, '')}
                    </a>
                  ) : <span style={{ color: '#888899' }}>—</span>}
                </td>
                <td style={tdStyle}>
                  <span style={{ color: s.active ? '#22c55e' : '#C21818', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11 }}>
                    {s.active ? 'YES' : 'NO'}
                  </span>
                </td>
                <td style={{ ...tdStyle, color: '#888899' }}>{s.display_order ?? 0}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={s.active ? dangerBtn : successBtn} onClick={() => toggleActive(s.id, s.active)}>
                      {s.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button style={dangerBtn} onClick={() => deleteSponsor(s.id, s.logo_url)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>}
    </div>
  );
}

function InquiryDetail({ inquiry, updating, onClose, onSave }: {
  inquiry: PartnershipInquiry;
  updating: boolean;
  onClose: () => void;
  onSave: (status: string, notes: string) => void;
}) {
  const [status, setStatus] = useState(inquiry.status);
  const [notes, setNotes] = useState(inquiry.notes ?? '');
  return (
    <div style={{ ...glassCard }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 15, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {inquiry.company_name}
        </h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18 }}>✕</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Contact', value: inquiry.contact_name },
          { label: 'Email', value: inquiry.email },
          { label: 'Phone', value: inquiry.phone ?? '—' },
          { label: 'Type', value: inquiry.partnership_type ?? '—' },
          { label: 'Submitted', value: new Date(inquiry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
            <div style={{ color: '#e8e8ec', fontSize: 13 }}>{value}</div>
          </div>
        ))}
      </div>
      {inquiry.message && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Message</div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '12px 14px', color: '#e8e8ec', fontSize: 13, lineHeight: 1.6 }}>
            {inquiry.message}
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {['new', 'reviewing', 'accepted', 'rejected'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Internal Notes</label>
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes…" style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button style={primaryBtn} disabled={updating} onClick={() => onSave(status, notes)}>
          {updating ? 'Saving…' : 'Save Changes'}
        </button>
        <button style={{ ...primaryBtn, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── CHAT LOGS MODULE ────────────────────────────────────────────────────────

function ChatLogsModule() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ChatSession | null>(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('last_message_at', { ascending: false })
      .limit(200);
    if (data) setSessions(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  async function deleteSession(id: string) {
    if (!confirm('Delete this chat session?')) return;
    await supabase.from('chat_sessions').delete().eq('id', id);
    if (selected?.id === id) setSelected(null);
    setToast({ msg: 'Session deleted.', type: 'success' });
    setTimeout(() => setToast(null), 2500);
    fetchSessions();
  }

  function downloadTranscript(s: ChatSession) {
    const lines = [
      `RCC Chat Transcript`,
      `Session: ${s.session_key}`,
      `Date: ${new Date(s.started_at).toLocaleString('en-IN')}`,
      `Messages: ${s.total_messages}`,
      `─────────────────────────────────────`,
      ...s.messages.map(m => `[${m.role.toUpperCase()}] ${m.content}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `rcc-chat-${s.session_key}.txt`; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = sessions.filter(s =>
    search === '' ||
    s.session_key.toLowerCase().includes(search.toLowerCase()) ||
    s.messages.some(m => m.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <SectionHeading title={`CHAT LOGS (${sessions.length})`} />

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '340px 1fr' : '1fr', gap: 16, alignItems: 'start' }}>
        {/* Sessions list */}
        <div>
          <input
            style={{ ...inputStyle, marginBottom: 12 }}
            placeholder="Search messages or session ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {loading ? (
            <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 13 }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ ...glassCard, textAlign: 'center', color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 14 }}>
              {sessions.length === 0 ? 'No chat sessions yet. Start a conversation on the website.' : 'No sessions match your search.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map(s => (
                <div
                  key={s.id}
                  onClick={() => setSelected(selected?.id === s.id ? null : s)}
                  style={{
                    ...glassCard,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    border: selected?.id === s.id ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#D4AF37' }}>{s.session_key}</span>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#888899', background: 'rgba(255,255,255,0.06)', borderRadius: 4, padding: '2px 6px' }}>
                      {s.total_messages} msgs
                    </span>
                  </div>
                  {s.messages.length > 0 && (
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.messages[s.messages.length - 1]?.content ?? ''}
                    </div>
                  )}
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#444455', marginTop: 6 }}>
                    {new Date(s.last_message_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transcript panel */}
        {selected && (
          <div style={{ ...glassCard, position: 'sticky', top: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 13, color: '#D4AF37', letterSpacing: '0.04em' }}>TRANSCRIPT</div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#555566', marginTop: 2 }}>{selected.session_key}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={goldBtn} onClick={() => downloadTranscript(selected)}>⬇ Download</button>
                <button style={dangerBtn} onClick={() => deleteSession(selected.id)}>Delete</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899' }}>
                <span style={{ color: '#555566' }}>Started:</span> {new Date(selected.started_at).toLocaleString('en-IN')}
              </div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899' }}>
                <span style={{ color: '#555566' }}>Messages:</span> {selected.total_messages}
              </div>
            </div>

            <div style={{ maxHeight: 500, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selected.messages.filter(m => m.role === 'user' || m.role === 'assistant').map((m, i) => {
                const isUser = m.role === 'user';
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '80%',
                      padding: '10px 14px',
                      borderRadius: isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                      background: isUser ? 'rgba(194,24,24,0.2)' : 'rgba(255,255,255,0.06)',
                      border: isUser ? '1px solid rgba(194,24,24,0.3)' : '1px solid rgba(255,255,255,0.08)',
                      fontFamily: 'var(--font-inter)',
                      fontSize: 13,
                      color: '#e8e8ec',
                      lineHeight: 1.5,
                    }}>
                      <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 9, color: isUser ? '#C21818' : '#888899', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                        {isUser ? 'User' : 'RCC AI'}
                      </div>
                      {m.content}
                    </div>
                  </div>
                );
              })}
              {selected.messages.length === 0 && (
                <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No messages in this session.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BLOG MODULE ─────────────────────────────────────────────────────────────

function BlogModule() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', cover_image_url: '', author: 'RCC Admin', category: 'general', tags: '', published: false, featured: false });
  const [seoKeyword, setSeoKeyword] = useState('');
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoResult, setSeoResult] = useState<SeoAnalysisResult | null>(null);
  const [showSeoPanel, setShowSeoPanel] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function startEdit(post: BlogPost) {
    setEditPost(post);
    setForm({
      title: post.title, slug: post.slug, excerpt: post.excerpt ?? '',
      content: post.content ?? '', cover_image_url: post.cover_image_url ?? '',
      author: post.author, category: post.category,
      tags: (post.tags ?? []).join(', '),
      published: post.published, featured: post.featured,
    });
    setShowForm(true);
  }

  function resetForm() {
    setEditPost(null);
    setForm({ title: '', slug: '', excerpt: '', content: '', cover_image_url: '', author: 'RCC Admin', category: 'general', tags: '', published: false, featured: false });
    setShowForm(false);
  }

  async function handleSave() {
    if (!form.title || !form.slug) { showToast('Title and slug are required.', 'error'); return; }
    const payload = {
      title: form.title, slug: form.slug, excerpt: form.excerpt || null,
      content: form.content || null, cover_image_url: form.cover_image_url || null,
      author: form.author, category: form.category,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      published: form.published, featured: form.featured,
      updated_at: new Date().toISOString(),
    };
    if (editPost) {
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', editPost.id);
      if (error) showToast('Failed to update post.', 'error');
      else { showToast('Post updated.', 'success'); resetForm(); fetchPosts(); }
    } else {
      const { error } = await supabase.from('blog_posts').insert(payload);
      if (error) showToast(error.code === '23505' ? 'Slug already exists.' : 'Failed to create post.', 'error');
      else { showToast('Post created.', 'success'); resetForm(); fetchPosts(); }
    }
  }

  async function togglePublished(id: string, val: boolean) {
    await supabase.from('blog_posts').update({ published: !val, updated_at: new Date().toISOString() }).eq('id', id);
    fetchPosts();
  }

  async function toggleFeatured(id: string, val: boolean) {
    await supabase.from('blog_posts').update({ featured: !val, updated_at: new Date().toISOString() }).eq('id', id);
    fetchPosts();
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    showToast('Post deleted.', 'success');
    fetchPosts();
  }

  async function analyzeSeo() {
    if (!form.content && !form.title) { showToast('Add title or content before analyzing SEO.', 'error'); return; }
    setSeoLoading(true);
    setShowSeoPanel(true);
    setSeoResult(null);
    try {
      const res = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: seoKeyword.trim() || form.title,
          content: form.content,
          metaTitle: form.title,
          metaDescription: form.excerpt,
          domainUrl: 'racquetsclubcommunity.com',
        }),
      });
      const data: SeoAnalysisResult = await res.json();
      if (res.ok) setSeoResult(data);
      else showToast((data as { error?: string }).error || 'SEO analysis failed.', 'error');
    } catch {
      showToast('Network error during SEO analysis.', 'error');
    }
    setSeoLoading(false);
  }

  function SeoScoreBar({ label, value, color }: { label: string; value: number | undefined; color: string }) {
    const pct = Math.round((value ?? 0) * 100);
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#888899' }}>{label}</span>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, color }}>{pct}%</span>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
        </div>
      </div>
    );
  }

  function SeoCircleScore({ label, value, color }: { label: string; value: number | undefined; color: string }) {
    const pct = Math.round((value ?? 0) * 100);
    const r = 22, circumference = 2 * Math.PI * r;
    const offset = circumference - (pct / 100) * circumference;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <svg width={56} height={56} viewBox="0 0 56 56">
          <circle cx={28} cy={28} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={5} />
          <circle cx={28} cy={28} r={r} fill="none" stroke={color} strokeWidth={5}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 28 28)"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
          <text x={28} y={32} textAnchor="middle" fill={color} fontSize={11} fontWeight={700} fontFamily="var(--font-montserrat)">{pct}</text>
        </svg>
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: '#888899', textAlign: 'center', maxWidth: 60 }}>{label}</span>
      </div>
    );
  }

  const catColor: Record<string, string> = {
    news: '#3b82f6', match_report: '#C21818', tips: '#22c55e', community: '#a78bfa', general: '#888899',
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <SectionHeading title={`BLOG (${posts.length})`} action={
        <button style={primaryBtn} onClick={() => { resetForm(); setShowForm(true); }}>+ New Post</button>
      } />

      {showForm && (
        <div style={{ ...glassCard, marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 14, color: '#D4AF37', margin: '0 0 16px 0' }}>
            {editPost ? 'Edit Post' : 'New Blog Post'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Title</label>
              <input style={inputStyle} value={form.title} onChange={e => {
                const t = e.target.value;
                setForm(f => ({ ...f, title: t, slug: editPost ? f.slug : autoSlug(t) }));
              }} placeholder="Post title" />
            </div>
            <div>
              <label style={labelStyle}>Slug</label>
              <input style={inputStyle} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="url-slug" />
            </div>
            <div>
              <label style={labelStyle}>Author</label>
              <input style={inputStyle} value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={{ ...inputStyle, background: '#0a0a0f' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="general">General</option>
                <option value="news">News</option>
                <option value="match_report">Match Report</option>
                <option value="tips">Tips</option>
                <option value="community">Community</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input style={inputStyle} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="badminton, delhi, tips" />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Cover Image URL</label>
              <input style={inputStyle} value={form.cover_image_url} onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))} placeholder="https://..." />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Excerpt</label>
              <textarea style={{ ...inputStyle, height: 72, resize: 'vertical' }} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Short description" />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Content (Markdown / HTML)</label>
              <textarea style={{ ...inputStyle, height: 160, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Full post content..." />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" id="pub" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
              <label htmlFor="pub" style={{ ...labelStyle, margin: 0, cursor: 'pointer' }}>Published</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" id="feat" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
              <label htmlFor="feat" style={{ ...labelStyle, margin: 0, cursor: 'pointer' }}>Featured</label>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 20, paddingTop: 16 }}>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, color: '#D4AF37', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
              SEO Analysis
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={seoKeyword}
                onChange={e => setSeoKeyword(e.target.value)}
                placeholder="Target keyword (defaults to title)"
              />
              <button
                style={{ ...goldBtn, whiteSpace: 'nowrap', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={analyzeSeo}
                disabled={seoLoading}
              >
                {seoLoading ? '⏳ Analyzing...' : '🔍 Analyze SEO'}
              </button>
            </div>
          </div>

          {showSeoPanel && (
            <div style={{ marginTop: 16, border: '1px solid rgba(212,175,55,0.2)', borderRadius: 10, background: 'rgba(212,175,55,0.03)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(212,175,55,0.1)', background: 'rgba(212,175,55,0.06)' }}>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 12, color: '#D4AF37', letterSpacing: '0.1em' }}>SEO ANALYSIS RESULTS</span>
                <button onClick={() => setShowSeoPanel(false)} style={{ background: 'none', border: 'none', color: '#888899', cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
              </div>

              {seoLoading && (
                <div style={{ padding: 32, textAlign: 'center', color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 13 }}>
                  <div style={{ marginBottom: 8, fontSize: 24 }}>⏳</div>
                  Analyzing content against SEO signals...
                </div>
              )}

              {!seoLoading && seoResult && (
                <div style={{ padding: 16 }}>

                  {/* Main probability gauges */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                    <SeoCircleScore label="Ranking Probability" value={seoResult.rankingProbability} color="#D4AF37" />
                    <SeoCircleScore label="Top-3 Probability" value={seoResult.top3Probability} color="#22c55e" />
                    <SeoCircleScore label="Featured Snippet" value={seoResult.featuredSnippetProbability} color="#3b82f6" />
                    <SeoCircleScore label="AI Citation" value={seoResult.aiCitationProbability} color="#a78bfa" />
                  </div>

                  {/* Score grid — two columns */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '4px 24px', marginBottom: 20 }}>
                    <SeoScoreBar label="SEO Score" value={seoResult.seoScore} color="#D4AF37" />
                    <SeoScoreBar label="Content Score" value={seoResult.contentScore} color="#22c55e" />
                    <SeoScoreBar label="AEO Score" value={seoResult.aeoScore} color="#3b82f6" />
                    <SeoScoreBar label="GEO Score" value={seoResult.geoScore} color="#a78bfa" />
                    <SeoScoreBar label="Readability" value={seoResult.readabilityScore} color="#f59e0b" />
                    <SeoScoreBar label="Local SEO" value={seoResult.localSeoScore} color="#ec4899" />
                    <SeoScoreBar label="Semantic Alignment" value={seoResult.semanticAlignment} color="#06b6d4" />
                    <SeoScoreBar label="Entity Coverage" value={seoResult.entityCoverage} color="#14b8a6" />
                    <SeoScoreBar label="Query Coverage" value={seoResult.queryCoverage} color="#f97316" />
                    <SeoScoreBar label="Intent Alignment" value={seoResult.intentAlignment} color="#84cc16" />
                    <SeoScoreBar label="SERP Competition" value={seoResult.serpCompetitionScore} color="#C21818" />
                    <SeoScoreBar label="Keyword Difficulty" value={seoResult.keywordDifficulty} color="#ef4444" />
                  </div>

                  {/* Strengths & Weaknesses */}
                  {((seoResult.strengths?.length ?? 0) > 0 || (seoResult.weaknesses?.length ?? 0) > 0) && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
                      {(seoResult.strengths?.length ?? 0) > 0 && (
                        <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8, padding: 12 }}>
                          <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, color: '#22c55e', letterSpacing: '0.12em', marginBottom: 10 }}>✓ STRENGTHS</div>
                          {seoResult.strengths!.map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                              <span style={{ color: '#22c55e', flexShrink: 0, fontSize: 11 }}>✓</span>
                              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#aab8a8', lineHeight: 1.5 }}>{s}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {(seoResult.weaknesses?.length ?? 0) > 0 && (
                        <div style={{ background: 'rgba(194,24,24,0.06)', border: '1px solid rgba(194,24,24,0.2)', borderRadius: 8, padding: 12 }}>
                          <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, color: '#C21818', letterSpacing: '0.12em', marginBottom: 10 }}>✗ WEAKNESSES</div>
                          {seoResult.weaknesses!.map((w, i) => (
                            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                              <span style={{ color: '#C21818', flexShrink: 0, fontSize: 11 }}>✗</span>
                              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#b8a8a8', lineHeight: 1.5 }}>{w}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Suggestions table */}
                  {(seoResult.suggestions?.length ?? 0) > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, color: '#888899', letterSpacing: '0.12em', marginBottom: 10 }}>ACTIONABLE SUGGESTIONS</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {seoResult.suggestions!.map((s, i) => {
                          const priorityColor = s.priority === 'high' ? '#C21818' : s.priority === 'medium' ? '#f59e0b' : '#22c55e';
                          return (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '10px 12px', display: 'grid', gridTemplateColumns: 'auto auto 1fr auto', gap: '8px 12px', alignItems: 'start' }}>
                              <span style={{ background: `${priorityColor}22`, color: priorityColor, border: `1px solid ${priorityColor}44`, borderRadius: 3, padding: '2px 7px', fontSize: 9, fontFamily: 'var(--font-montserrat)', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap', alignSelf: 'center' }}>
                                {s.priority}
                              </span>
                              <span style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', borderRadius: 3, padding: '2px 7px', fontSize: 9, fontFamily: 'var(--font-montserrat)', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap', alignSelf: 'center' }}>
                                {s.category}
                              </span>
                              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#c8c8d4', lineHeight: 1.5 }}>{s.action}</span>
                              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: '#888899', whiteSpace: 'nowrap', alignSelf: 'center' }}>{s.impact}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Billing footer */}
                  {seoResult.billing && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: '#555566' }}>
                        Credits used: <span style={{ color: '#888899' }}>{seoResult.billing.creditsUsed}</span>
                      </span>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: '#555566' }}>
                        Remaining: <span style={{ color: '#22c55e' }}>{seoResult.billing.remainingCredits}</span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button style={primaryBtn} onClick={handleSave}>{editPost ? 'Save Changes' : 'Publish Post'}</button>
            <button style={dangerBtn} onClick={resetForm}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 13 }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Title', 'Category', 'Author', 'Views', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{p.title}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#555566' }}>/blog/{p.slug}</div>
                    {p.featured && <span style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', borderRadius: 3, padding: '1px 6px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700 }}>★ FEATURED</span>}
                  </td>
                  <td style={tdStyle}>
                    <span style={{ background: `${catColor[p.category] ?? '#888899'}22`, color: catColor[p.category] ?? '#888899', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontFamily: 'var(--font-montserrat)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {p.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={tdStyle}>{p.author}</td>
                  <td style={tdStyle}>{p.views.toLocaleString()}</td>
                  <td style={tdStyle}>
                    <span style={{ background: p.published ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)', color: p.published ? '#22c55e' : '#888899', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontFamily: 'var(--font-montserrat)', fontWeight: 700 }}>
                      {p.published ? 'LIVE' : 'DRAFT'}
                    </span>
                  </td>
                  <td style={tdStyle}>{new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button style={goldBtn} onClick={() => startEdit(p)}>Edit</button>
                      <button style={p.published ? dangerBtn : successBtn} onClick={() => togglePublished(p.id, p.published)}>
                        {p.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button style={goldBtn} onClick={() => toggleFeatured(p.id, p.featured)}>{p.featured ? 'Unfeature' : 'Feature'}</button>
                      <button style={dangerBtn} onClick={() => deletePost(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: '#888899' }}>No blog posts yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── USER MANAGEMENT MODULE ───────────────────────────────────────────────────

function UserManagementModule() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState({ email: '', full_name: '', role: 'editor' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleAddUser() {
    if (!form.email) { showToast('Email is required.', 'error'); return; }
    const { error } = await supabase.from('admin_users').insert({
      email: form.email, full_name: form.full_name || null, role: form.role,
    });
    if (error) showToast(error.code === '23505' ? 'Email already exists.' : 'Failed to add user.', 'error');
    else { showToast('Admin user added. They can log in with Supabase Auth.', 'success'); setShowForm(false); setForm({ email: '', full_name: '', role: 'editor' }); fetchUsers(); }
  }

  async function updateRole(id: string, role: string) {
    await supabase.from('admin_users').update({ role }).eq('id', id);
    fetchUsers();
  }

  async function toggleActive(id: string, active: boolean) {
    await supabase.from('admin_users').update({ active: !active }).eq('id', id);
    fetchUsers();
  }

  async function deleteUser(id: string) {
    if (!confirm('Remove this admin user?')) return;
    await supabase.from('admin_users').delete().eq('id', id);
    showToast('User removed.', 'success');
    fetchUsers();
  }

  const ROLE_COLORS: Record<string, string> = {
    super_admin: '#C21818', admin: '#D4AF37', editor: '#22c55e', viewer: '#888899',
  };
  const ROLE_PERMS: Record<string, string> = {
    super_admin: 'Full access — all tabs, all actions, user management',
    admin: 'All tabs — create, edit, delete content',
    editor: 'Create & edit content — cannot delete or manage users',
    viewer: 'Read-only — can view all data, no modifications',
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <SectionHeading title={`ADMIN USERS (${users.length})`} action={
        <button style={primaryBtn} onClick={() => setShowForm(s => !s)}>+ Add Admin</button>
      } />

      {/* Default credentials notice */}
      <div style={{ ...glassCard, marginBottom: 24, border: '1px solid rgba(212,175,55,0.25)' }}>
        <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 12, color: '#D4AF37', letterSpacing: '0.06em', marginBottom: 10 }}>
          DEFAULT CREDENTIALS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#555566', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Login URL</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#e8e8ec' }}>/enter/backend/login</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#555566', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Default Admin Email</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#D4AF37' }}>admin@racquetsclubcommunity.com</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#555566', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Password</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#888899' }}>Set via Supabase Auth → Users → Invite</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#555566', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Auth Provider</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#e8e8ec' }}>Supabase Email Auth</div>
          </div>
        </div>
        <div style={{ marginTop: 12, fontFamily: 'var(--font-inter)', fontSize: 12, color: '#555566' }}>
          To create the first admin account: Supabase Dashboard → Authentication → Users → Invite a user with the email above. The user record here tracks role permissions.
        </div>
      </div>

      {/* Role reference */}
      <div style={{ ...glassCard, marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 12, color: '#888899', letterSpacing: '0.06em', marginBottom: 10 }}>ROLE PERMISSIONS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          {Object.entries(ROLE_PERMS).map(([role, desc]) => (
            <div key={role} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 14px' }}>
              <span style={{ background: `${ROLE_COLORS[role]}22`, color: ROLE_COLORS[role], borderRadius: 4, padding: '2px 8px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700, textTransform: 'uppercase', display: 'inline-block', marginBottom: 6 }}>
                {role.replace('_', ' ')}
              </span>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div style={{ ...glassCard, marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 14, color: '#D4AF37', margin: '0 0 16px 0' }}>Add Admin User</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="user@example.com" />
            </div>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Name" />
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <select style={{ ...inputStyle, background: '#0a0a0f' }} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button style={primaryBtn} onClick={handleAddUser}>Add User</button>
            <button style={dangerBtn} onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 13 }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['User', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ opacity: u.active ? 1 : 0.5 }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600 }}>{u.full_name ?? '—'}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#555566' }}>{u.email}</div>
                  </td>
                  <td style={tdStyle}>
                    <select
                      value={u.role}
                      onChange={e => updateRole(u.id, e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: ROLE_COLORS[u.role] ?? '#888899', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 12, cursor: 'pointer', textTransform: 'uppercase', outline: 'none' }}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ background: u.active ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)', color: u.active ? '#22c55e' : '#888899', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontFamily: 'var(--font-montserrat)', fontWeight: 700 }}>
                      {u.active ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td style={tdStyle}>{u.last_login ? new Date(u.last_login).toLocaleString('en-IN') : 'Never'}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button style={u.active ? dangerBtn : successBtn} onClick={() => toggleActive(u.id, u.active)}>{u.active ? 'Disable' : 'Enable'}</button>
                      <button style={dangerBtn} onClick={() => deleteUser(u.id)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#888899' }}>No admin users configured.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── TABS CONFIG ──────────────────────────────────────────────────────────────

type NewsletterSubscriber = {
  id: string;
  email: string;
  full_name?: string;
  source?: string;
  status: string;
  subscribed_at: string;
};

function NewsletterModule() {
  const [tab, setTab] = useState<'subscribers' | 'send'>('subscribers');

  // ── Subscribers state ──
  const [subs, setSubs] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // ── Campaign state ──
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent: number; errors: number; total: number; provider?: string } | null>(null);
  const [sendError, setSendError] = useState('');
  const [preview, setPreview] = useState(false);

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false });
    if (data) setSubs(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  function showToast(msg: string, type: 'success' | 'error') { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); }

  async function unsubscribe(id: string) {
    await supabase.from('newsletter_subscribers').update({ status: 'unsubscribed' }).eq('id', id);
    showToast('Marked as unsubscribed.', 'success'); fetchSubs();
  }

  async function deleteSub(id: string) {
    if (!confirm('Remove this subscriber?')) return;
    await supabase.from('newsletter_subscribers').delete().eq('id', id);
    showToast('Subscriber removed.', 'success'); fetchSubs();
  }

  function exportCSV() {
    const rows = [['Email', 'Name', 'Source', 'Status', 'Subscribed At'], ...subs.map(s => [s.email, s.full_name ?? '', s.source ?? '', s.status, new Date(s.subscribed_at).toLocaleString('en-IN')])];
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'rcc-newsletter-subscribers.csv'; a.click(); URL.revokeObjectURL(url);
  }

  async function sendCampaign(isTest: boolean) {
    if (!subject.trim() || !body.trim()) { showToast('Subject and body are required.', 'error'); return; }
    if (isTest && !testEmail.trim()) { showToast('Enter a test email address.', 'error'); return; }
    if (!isTest && !confirm(`Send this campaign to all ${active} active subscribers?`)) return;
    setSending(true);
    setSendResult(null);
    setSendError('');
    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subject.trim(), html: body.trim(), ...(isTest ? { test_email: testEmail.trim() } : {}) }),
      });
      const data = await res.json() as { sent?: number; errors?: number; total?: number; provider?: string; error?: string };
      if (!res.ok || data.error) {
        setSendError(data.error ?? 'Send failed. Check your email settings.');
      } else {
        setSendResult({ sent: data.sent ?? 0, errors: data.errors ?? 0, total: data.total ?? 0, provider: data.provider });
        showToast(isTest ? 'Test email sent!' : `Campaign sent to ${data.sent} subscribers!`, 'success');
      }
    } catch { setSendError('Network error. Please try again.'); }
    setSending(false);
  }

  const filtered = subs.filter(s => search === '' || s.email.toLowerCase().includes(search.toLowerCase()) || (s.full_name ?? '').toLowerCase().includes(search.toLowerCase()));
  const active = subs.filter(s => s.status === 'active').length;

  const tabBtn = (t: 'subscribers' | 'send', label: string) => (
    <button onClick={() => setTab(t)} style={{
      background: tab === t ? 'rgba(212,175,55,0.15)' : 'transparent',
      border: `1px solid ${tab === t ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
      color: tab === t ? '#D4AF37' : '#888899',
      borderRadius: 8, padding: '8px 20px',
      fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 12,
      letterSpacing: '0.04em', cursor: 'pointer',
    }}>{label}</button>
  );

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 'clamp(20px,2.5vw,28px)', color: '#e8e8ec', margin: 0 }}>
          Newsletter
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {tabBtn('subscribers', `Subscribers (${subs.length})`)}
          {tabBtn('send', '✉ Send Campaign')}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: 12, marginBottom: 20 }}>
        {[{ label: 'Total', value: subs.length, color: '#D4AF37' }, { label: 'Active', value: active, color: '#22c55e' }, { label: 'Unsubscribed', value: subs.filter(s => s.status !== 'active').length, color: '#888899' }].map(stat => (
          <div key={stat.label} style={{ ...glassCard, textAlign: 'center', padding: '16px' }}>
            <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: '2rem', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#888899', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── SUBSCRIBERS TAB ── */}
      {tab === 'subscribers' && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <input style={{ ...inputStyle, flex: 1, minWidth: 200 }} placeholder="Search by email or name..." value={search} onChange={e => setSearch(e.target.value)} />
            <button style={{ ...goldBtn }} onClick={exportCSV}>⬇ Export CSV</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Email', 'Name', 'Source', 'Status', 'Date', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>
                {loading && <LoadingRow cols={6} />}
                {!loading && filtered.length === 0 && <EmptyRow cols={6} msg="No subscribers yet." />}
                {filtered.map(s => (
                  <tr key={s.id} style={{ opacity: s.status === 'active' ? 1 : 0.5 }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{s.email}</td>
                    <td style={tdStyle}>{s.full_name ?? '—'}</td>
                    <td style={{ ...tdStyle, color: '#888899' }}>{s.source ?? 'footer'}</td>
                    <td style={tdStyle}><StatusBadge value={s.status} /></td>
                    <td style={{ ...tdStyle, color: '#888899' }}>{new Date(s.subscribed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {s.status === 'active' && <button style={dangerBtn} onClick={() => unsubscribe(s.id)}>Unsub</button>}
                        <button style={dangerBtn} onClick={() => deleteSub(s.id)}>Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── SEND CAMPAIGN TAB ── */}
      {tab === 'send' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Template picker */}
          {(() => {
            const TEMPLATES: { label: string; icon: string; subject: string; body: string }[] = [
              {
                label: 'Welcome',
                icon: '👋',
                subject: 'Welcome to RCC! 🏸',
                body: `Hi RCC Family! 👋

We're thrilled to have you with us at Racquets Club Community — Delhi's invite-only elite badminton network!

Here's what you can look forward to:

🏸  Weekend Tournaments & Ladder Leagues
🏆  Smash Nights every Friday
⭐  Player spotlights and community events
📣  Exclusive early registration access

Visit us at: racquetsclubcommunity.com

See you on court!
— The RCC Team`,
              },
              {
                label: 'Event Announcement',
                icon: '📣',
                subject: '🏸 New Event: [Event Name] — Register Now!',
                body: `Hey RCC Family! 🏸

We're excited to announce a brand-new event:

━━━━━━━━━━━━━━━━━━━━━━━━━━
🏸  [EVENT NAME]
━━━━━━━━━━━━━━━━━━━━━━━━━━

📅  Date:    [Day, DD Month YYYY]
⏰  Time:    [Time]
📍  Venue:   [Venue Name]
🎫  Entry:   ₹[Amount] / Free
🏆  Prize:   ₹[Prize Pool]

Spots are limited — register early to secure your place!

👉 Register here: racquetsclubcommunity.com/events

Questions? Reply to this email or reach us at admin@racquetsclubcommunity.com

See you on court!
— The RCC Team`,
              },
              {
                label: 'Event Reminder',
                icon: '⏰',
                subject: '⏰ Reminder: [Event Name] is Tomorrow!',
                body: `Hey RCC Family! ⏰

Just a friendly reminder — [EVENT NAME] is happening tomorrow!

━━━━━━━━━━━━━━━━━━━━━━━━━━
📅  [Day, DD Month]  |  ⏰  [Time]
📍  [Venue Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━

What to bring:
• Badminton racquet(s)
• Court shoes (non-marking soles)
• Water bottle
• Your A-game 💪

Not registered yet? Limited walk-in spots may be available.
👉 racquetsclubcommunity.com/events

See you on court tomorrow!
— The RCC Team`,
              },
              {
                label: 'Tournament Results',
                icon: '🏆',
                subject: '🏆 Tournament Results — [Event Name]',
                body: `Hey RCC Family! 🏆

What an incredible event! Here are the results from [EVENT NAME]:

━━━━━━━━━━━━━━━━━━━━━━━━━━
🥇  WINNER
━━━━━━━━━━━━━━━━━━━━━━━━━━

🥇  [Winner Name]
🥈  [Runner-up Name]
🥉  [Third Place Name]

━━━━━━━━━━━━━━━━━━━━━━━━━━

Congratulations to all participants for an amazing display of skill and sportsmanship!

Check the updated leaderboard at: racquetsclubcommunity.com

See you at the next event!
— The RCC Team`,
              },
              {
                label: 'Weekly Digest',
                icon: '📅',
                subject: `🏸 RCC Weekly Roundup — ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
                body: `Hey RCC Family! 👋

Here's everything happening at Racquets Club Community this week.

━━━━━━━━━━━━━━━━━━━━━━━━━━
📅  EVENTS THIS WEEK
━━━━━━━━━━━━━━━━━━━━━━━━━━

[List upcoming events here]

Register at: racquetsclubcommunity.com/events

━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆  LEADERBOARD TOP 5
━━━━━━━━━━━━━━━━━━━━━━━━━━

[Leaderboard snapshot]

Full rankings at: racquetsclubcommunity.com

━━━━━━━━━━━━━━━━━━━━━━━━━━

Have a great week on the courts!
— The RCC Team`,
              },
              {
                label: 'Member Spotlight',
                icon: '⭐',
                subject: '⭐ RCC Member Spotlight — [Player Name]',
                body: `Hey RCC Family! ⭐

This week we're shining the spotlight on one of our outstanding members:

━━━━━━━━━━━━━━━━━━━━━━━━━━
⭐  MEMBER SPOTLIGHT
━━━━━━━━━━━━━━━━━━━━━━━━━━

[Player Name] | [Skill Level] | [City/Area]

[Write 2-3 sentences about the player — their journey, achievements, playing style, or something fun about them.]

Recent achievements:
• [Achievement 1]
• [Achievement 2]

━━━━━━━━━━━━━━━━━━━━━━━━━━

Know someone deserving a spotlight? Reply to this email and nominate them!

See you on court!
— The RCC Team`,
              },
            ];
            return (
              <div style={{ ...glassCard }}>
                <label style={labelStyle}>Quick Templates</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {TEMPLATES.map(t => (
                    <button
                      key={t.label}
                      onClick={() => { setSubject(t.subject); setBody(t.body); setPreview(false); }}
                      style={{
                        background: 'rgba(212,175,55,0.06)',
                        border: '1px solid rgba(212,175,55,0.18)',
                        borderRadius: 8,
                        padding: '10px 12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.14)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.06)')}
                    >
                      <div style={{ fontSize: 18, marginBottom: 2 }}>{t.icon}</div>
                      <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 600, color: '#D4AF37', letterSpacing: '0.04em' }}>{t.label}</div>
                    </button>
                  ))}
                </div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, color: '#555566', marginTop: 6 }}>
                  Click a template to pre-fill subject &amp; body. Then customise before sending.
                </div>
              </div>
            );
          })()}

          {/* Info strip */}
          <div style={{ ...glassCard, background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)', padding: '12px 18px' }}>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 12, color: '#888899' }}>
              Will send to <strong style={{ color: '#22c55e' }}>{active} active subscribers</strong>.
              Configure provider &amp; API key under <strong style={{ color: '#D4AF37' }}>Site Settings ⚙️</strong>.
              Supported: <strong style={{ color: '#e8e8ec' }}>Resend</strong> (free 100/day · 3k/mo) · <strong style={{ color: '#e8e8ec' }}>SendGrid</strong> (free 100/day) · <strong style={{ color: '#e8e8ec' }}>Brevo</strong> (free 300/day)
            </div>
          </div>

          {/* Subject */}
          <div style={glassCard}>
            <label style={labelStyle}>Subject Line</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. RCC Smash Night #12 – Register Now 🏸" style={inputStyle} />
          </div>

          {/* Body */}
          <div style={glassCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Email Body</label>
              <button onClick={() => setPreview(!preview)} style={goldBtn}>{preview ? 'Edit' : 'Preview'}</button>
            </div>
            {preview ? (
              <div style={{ background: '#fff', borderRadius: 8, padding: '24px', color: '#333', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', minHeight: 160, fontFamily: 'Arial, sans-serif' }}>
                {body || <span style={{ color: '#aaa' }}>Nothing to preview yet…</span>}
              </div>
            ) : (
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder={`Write your email here. Plain text or HTML.\n\nExample:\nHello RCC Family! 👋\n\nSmash Night #12 is happening this Friday at Siri Fort.\n📅 Friday, 23 May · 7:00 PM onwards\n🏸 All skill levels welcome\n\nRegister here: racquetsclubcommunity.com/events\n\nSee you on court!\n— The RCC Team`}
                rows={12}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 180 }}
              />
            )}
          </div>

          {/* Send results */}
          {sendResult && (
            <div style={{ ...glassCard, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)' }}>
              <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 15, color: '#22c55e', marginBottom: 8 }}>
                ✓ Campaign sent via {sendResult.provider ?? 'email'}
              </div>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 13, color: '#888899', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <span>Sent: <strong style={{ color: '#22c55e' }}>{sendResult.sent}</strong></span>
                {sendResult.errors > 0 && <span>Errors: <strong style={{ color: '#C21818' }}>{sendResult.errors}</strong></span>}
                <span>Total: {sendResult.total}</span>
              </div>
            </div>
          )}

          {sendError && <Toast msg={sendError} type="error" />}

          {/* Test send */}
          <div style={glassCard}>
            <label style={labelStyle}>Send Test Email First</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input value={testEmail} onChange={e => setTestEmail(e.target.value)} type="email" placeholder="your@email.com" style={{ ...inputStyle, flex: 1, minWidth: 200 }} />
              <button onClick={() => sendCampaign(true)} disabled={sending} style={{ ...goldBtn, padding: '10px 20px', flexShrink: 0, opacity: sending ? 0.7 : 1 }}>
                {sending ? 'Sending…' : 'Send Test'}
              </button>
            </div>
          </div>

          {/* Send to all */}
          <button
            onClick={() => sendCampaign(false)}
            disabled={sending || active === 0}
            style={{
              ...primaryBtn,
              width: '100%',
              padding: '14px 20px',
              fontSize: 14,
              letterSpacing: '0.06em',
              opacity: (sending || active === 0) ? 0.6 : 1,
            }}
          >
            {sending ? 'Sending Campaign…' : `📨 Send to All ${active} Active Subscribers`}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── TAB: AI KNOWLEDGE BASE ───────────────────────────────────────────────────

function AiContextModule() {
  const CATEGORIES = ['events', 'membership', 'courts', 'rules', 'faqs', 'announcements', 'general'];
  const CAT_COLORS: Record<string, string> = {
    events: '#8b5cf6',
    membership: '#22c55e',
    courts: '#3b82f6',
    rules: '#f59e0b',
    faqs: '#D4AF37',
    announcements: '#C21818',
    general: '#888899',
  };

  const [entries, setEntries] = useState<AiKnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [filterCat, setFilterCat] = useState<string>('all');
  const [editId, setEditId] = useState<string | null>(null);

  // Form state
  const [fTitle, setFTitle] = useState('');
  const [fContent, setFContent] = useState('');
  const [fCategory, setFCategory] = useState('general');
  const [fPriority, setFPriority] = useState(5);
  const [fActive, setFActive] = useState(true);
  const [saving, setSaving] = useState(false);

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchEntries() {
    setLoading(true);
    const { data } = await supabase
      .from('ai_knowledge_base')
      .select('*')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });
    setEntries(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchEntries(); }, []);

  function resetForm() {
    setEditId(null);
    setFTitle('');
    setFContent('');
    setFCategory('general');
    setFPriority(5);
    setFActive(true);
  }

  function startEdit(e: AiKnowledgeEntry) {
    setEditId(e.id);
    setFTitle(e.title);
    setFContent(e.content);
    setFCategory(e.category);
    setFPriority(e.priority);
    setFActive(e.active);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSave() {
    if (!fTitle.trim() || !fContent.trim()) {
      showToast('Title and content are required.', 'error');
      return;
    }
    setSaving(true);
    const payload = {
      title: fTitle.trim(),
      content: fContent.trim(),
      category: fCategory,
      priority: fPriority,
      active: fActive,
      updated_at: new Date().toISOString(),
    };
    if (editId) {
      const { error } = await supabase.from('ai_knowledge_base').update(payload).eq('id', editId);
      if (error) showToast('Failed to update entry.', 'error');
      else { showToast('Entry updated!', 'success'); resetForm(); fetchEntries(); }
    } else {
      const { error } = await supabase.from('ai_knowledge_base').insert(payload);
      if (error) showToast('Failed to add entry.', 'error');
      else { showToast('Entry added to chatbot knowledge!', 'success'); resetForm(); fetchEntries(); }
    }
    setSaving(false);
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('ai_knowledge_base').update({ active: !current, updated_at: new Date().toISOString() }).eq('id', id);
    setEntries(prev => prev.map(e => e.id === id ? { ...e, active: !current } : e));
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this knowledge entry?')) return;
    await supabase.from('ai_knowledge_base').delete().eq('id', id);
    setEntries(prev => prev.filter(e => e.id !== id));
    showToast('Entry deleted.', 'success');
  }

  const filtered = filterCat === 'all' ? entries : entries.filter(e => e.category === filterCat);
  const activeCount = entries.filter(e => e.active).length;

  return (
    <div>
      <style>{`
        .ai-kb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 640px) { .ai-kb-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 'clamp(20px,2.5vw,28px)', color: '#e8e8ec', margin: 0 }}>
            AI Knowledge Base
          </h2>
          <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 12, color: '#888899', marginTop: 4 }}>
            {activeCount} active entries feeding the chatbot · {entries.length} total
          </div>
        </div>
        {editId && (
          <button onClick={resetForm} style={{ ...goldBtn, padding: '8px 16px' }}>
            ✕ Cancel Edit
          </button>
        )}
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Add / Edit Form */}
      <div style={{ ...glassCard, marginBottom: 28, border: editId ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 15, color: editId ? '#D4AF37' : '#e8e8ec', marginBottom: 18 }}>
          {editId ? '✏️ Editing Entry' : '➕ Add New Knowledge Entry'}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Title</label>
          <input value={fTitle} onChange={e => setFTitle(e.target.value)} placeholder="e.g. Delhi Smash Open 2026" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Content</label>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, color: fContent.length > 1800 ? '#C21818' : '#888899' }}>
              {fContent.length} / 2000
            </span>
          </div>
          <textarea
            value={fContent}
            onChange={e => setFContent(e.target.value.slice(0, 2000))}
            placeholder="Enter information the chatbot should know. Be specific — dates, fees, venue, rules, eligibility, etc."
            rows={5}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
          />
        </div>

        <div className="ai-kb-grid" style={{ marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={fCategory} onChange={e => setFCategory(e.target.value)} style={inputStyle}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Priority (1 = highest)</label>
            <input type="number" min={1} max={10} value={fPriority} onChange={e => setFPriority(Number(e.target.value))} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <button
            onClick={() => setFActive(!fActive)}
            style={{
              background: fActive ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${fActive ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: fActive ? '#22c55e' : '#888899',
              borderRadius: 6,
              padding: '6px 14px',
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            {fActive ? '● Active' : '○ Inactive'}
          </button>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, color: '#888899' }}>
            {fActive ? 'Chatbot will use this entry' : 'Entry will be ignored by chatbot'}
          </span>
        </div>

        <button onClick={handleSave} disabled={saving} style={{ ...primaryBtn, opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving…' : editId ? 'Update Entry' : 'Add to Knowledge Base'}
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {['all', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            style={{
              background: filterCat === cat ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${filterCat === cat ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: filterCat === cat ? '#D4AF37' : '#888899',
              borderRadius: 20,
              padding: '5px 14px',
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 600,
              fontSize: 11,
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            {cat === 'all' ? `All (${entries.length})` : `${cat.charAt(0).toUpperCase() + cat.slice(1)} (${entries.filter(e => e.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Preview strip — what the chatbot "knows" right now */}
      {activeCount > 0 && (
        <div style={{ ...glassCard, marginBottom: 24, background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 13, color: '#D4AF37', marginBottom: 10 }}>
            🤖 Chatbot currently knows about:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {entries.filter(e => e.active).map(e => (
              <span key={e.id} style={{
                background: `${CAT_COLORS[e.category] ?? '#888899'}18`,
                border: `1px solid ${CAT_COLORS[e.category] ?? '#888899'}40`,
                color: CAT_COLORS[e.category] ?? '#888899',
                borderRadius: 20,
                padding: '3px 10px',
                fontFamily: 'var(--font-montserrat)',
                fontSize: 11,
                fontWeight: 600,
              }}>
                {e.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Entries list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#888899', padding: 32, fontFamily: 'var(--font-montserrat)', fontSize: 13 }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888899', padding: 40, fontFamily: 'var(--font-montserrat)', fontSize: 13 }}>
            No entries yet. Add your first knowledge entry above!
          </div>
        ) : filtered.map(entry => (
          <div key={entry.id} style={{
            background: '#0d0d18',
            border: `1px solid ${entry.active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
            borderRadius: 12,
            padding: '16px 18px',
            opacity: entry.active ? 1 : 0.6,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{
                    background: `${CAT_COLORS[entry.category] ?? '#888899'}20`,
                    color: CAT_COLORS[entry.category] ?? '#888899',
                    borderRadius: 4,
                    padding: '2px 8px',
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}>
                    {entry.category}
                  </span>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#555566' }}>
                    Priority {entry.priority}
                  </span>
                  {!entry.active && (
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#C21818', fontWeight: 700 }}>
                      INACTIVE
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 14, color: '#e8e8ec', marginBottom: 6 }}>
                  {entry.title}
                </div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {entry.content.length > 200 ? entry.content.slice(0, 200) + '…' : entry.content}
                </div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 10, color: '#444455', marginTop: 8 }}>
                  {entry.content.length} chars · Updated {new Date(entry.updated_at).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                <button onClick={() => toggleActive(entry.id, entry.active)} style={entry.active ? dangerBtn : successBtn}>
                  {entry.active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => startEdit(entry)} style={goldBtn}>Edit</button>
                <button onClick={() => handleDelete(entry.id)} style={dangerBtn}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: SITE SETTINGS ───────────────────────────────────────────────────────

type SettingKey = 'recaptcha_site_key' | 'recaptcha_secret_key' | 'instagram_access_token' | 'instagram_account_id' | 'email_provider' | 'email_api_key' | 'email_from_address' | 'email_from_name' | 'site_url' | 'webhook_secret' | 'cron_secret' | 'admin_email';

const SETTING_FIELDS: { key: SettingKey; label: string; hint: string; secret: boolean; group: string }[] = [
  { key: 'recaptcha_site_key',    label: 'reCAPTCHA Site Key (public)',    hint: 'Get from console.cloud.google.com → reCAPTCHA → Site key', secret: false, group: 'reCAPTCHA' },
  { key: 'recaptcha_secret_key',  label: 'reCAPTCHA Secret Key (private)', hint: 'Used server-side to verify tokens. Keep this private.', secret: true, group: 'reCAPTCHA' },
  { key: 'instagram_access_token','label': 'Instagram Access Token',       hint: 'From Meta for Developers → Basic Display or Business API', secret: true, group: 'Instagram' },
  { key: 'instagram_account_id',  label: 'Instagram Business Account ID',  hint: 'Required for Business/Creator accounts. Leave blank for personal.', secret: false, group: 'Instagram' },
  { key: 'email_provider',        label: 'Email Provider',                  hint: 'resend · sendgrid · brevo  (default: resend)', secret: false, group: 'Newsletter Email' },
  { key: 'email_api_key',         label: 'Email API Key',                   hint: 'API key from your email provider dashboard', secret: true, group: 'Newsletter Email' },
  { key: 'email_from_address',    label: 'From Email Address',              hint: 'e.g. newsletter@rccdelhi.com — must be verified with your provider', secret: false, group: 'Newsletter Email' },
  { key: 'email_from_name',       label: 'From Name',                       hint: 'e.g. RCC Newsletter', secret: false, group: 'Newsletter Email' },
  { key: 'admin_email',           label: 'Admin Notification Email',        hint: 'Email address that receives contact form submissions & new membership applications', secret: false, group: 'Automation' },
  { key: 'site_url',              label: 'Site URL',                        hint: 'Production URL e.g. https://racquetsclubcommunity.com — used by DB webhook triggers', secret: false, group: 'Automation' },
  { key: 'webhook_secret',        label: 'Webhook Secret',                  hint: 'Secret token for DB → API webhook calls (welcome & confirmation emails). Also set as WEBHOOK_SECRET env var in Vercel.', secret: true, group: 'Automation' },
  { key: 'cron_secret',           label: 'Cron Secret',                     hint: 'Secret token for Vercel cron jobs (daily digest, weekly roundup). Also set as CRON_SECRET env var in Vercel.', secret: true, group: 'Automation' },
];

function SiteSettingsModule() {
  const [values, setValues] = useState<Record<SettingKey, string>>({
    recaptcha_site_key: '',
    recaptcha_secret_key: '',
    instagram_access_token: '',
    instagram_account_id: '',
    email_provider: 'resend',
    email_api_key: '',
    email_from_address: '',
    email_from_name: 'RCC Newsletter',
    admin_email: '',
    site_url: 'https://racquetsclubcommunity.com',
    webhook_secret: '',
    cron_secret: '',
  });
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(true);

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_settings').select('key, value');
      if (data) {
        const map: Record<string, string> = {};
        data.forEach(r => { map[r.key] = r.value ?? ''; });
        setValues(prev => ({ ...prev, ...map }));
      }
      setLoading(false);
    }
    load();
  }, []);

  async function saveSetting(key: SettingKey) {
    setSaving(prev => ({ ...prev, [key]: true }));
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value: values[key], updated_at: new Date().toISOString() }, { onConflict: 'key' });
    setSaving(prev => ({ ...prev, [key]: false }));
    if (error) showToast(`Failed to save ${key}`, 'error');
    else showToast('Saved!', 'success');
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 'clamp(20px,2.5vw,28px)', color: '#e8e8ec', margin: 0 }}>
          Site Settings
        </h2>
        <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 12, color: '#888899', marginTop: 4 }}>
          API keys for reCAPTCHA, Instagram, and Newsletter email. Stored securely in your database.
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-montserrat)', fontSize: 13, padding: 32 }}>Loading settings…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {SETTING_FIELDS.map((field, idx) => (<>
            {(idx === 0 || SETTING_FIELDS[idx - 1].group !== field.group) && (
              <div key={`group-${field.group}`} style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 13, color: '#D4AF37', marginTop: idx === 0 ? 0 : 8, marginBottom: -4, letterSpacing: '0.04em' }}>
                {field.group}
              </div>
            )}
            <div key={field.key} style={{ ...glassCard }}>
              <label style={labelStyle}>{field.label}</label>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, color: '#555566', marginBottom: 10 }}>{field.hint}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <input
                  type={field.secret && !reveal[field.key] ? 'password' : 'text'}
                  value={values[field.key]}
                  onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.secret ? '••••••••••••••••' : 'Enter value…'}
                  style={{ ...inputStyle, flex: 1, minWidth: 200 }}
                />
                {field.secret && (
                  <button
                    onClick={() => setReveal(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                    style={{ ...goldBtn, flexShrink: 0 }}
                  >
                    {reveal[field.key] ? 'Hide' : 'Show'}
                  </button>
                )}
                <button
                  onClick={() => saveSetting(field.key)}
                  disabled={saving[field.key]}
                  style={{ ...primaryBtn, flexShrink: 0, opacity: saving[field.key] ? 0.7 : 1 }}
                >
                  {saving[field.key] ? 'Saving…' : 'Save'}
                </button>
              </div>
              {values[field.key] && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, color: '#22c55e' }}>Configured</span>
                </div>
              )}
            </div>
          </>))}

          {/* Help card */}
          <div style={{ ...glassCard, background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)', marginTop: 8 }}>
            <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 14, color: '#D4AF37', marginBottom: 12 }}>
              Setup Guide
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { title: 'reCAPTCHA v3', steps: ['Go to google.com/recaptcha → Admin Console', 'Create a new site with reCAPTCHA v3', 'Add your domain (e.g. rccdelhi.com)', 'Copy the Site Key (public) and Secret Key (private) here'] },
                { title: 'Instagram Graph API', steps: ['Go to developers.facebook.com → My Apps', 'Create an app → Add Instagram Basic Display product', 'Generate an access token for your Instagram account', 'For Business accounts also paste your Business Account ID'] },
                { title: 'Newsletter Email (pick one free provider)', steps: ['Resend (resend.com) — 100 emails/day free, best API: sign up → API Keys → create key, set provider=resend', 'SendGrid (sendgrid.com) — 100 emails/day free: sign up → Settings → API Keys → Full Access, set provider=sendgrid', 'Brevo (brevo.com) — 300 emails/day free: sign up → SMTP & API → API Keys, set provider=brevo', 'Verify your From Address with the provider (DNS/DKIM setup) before sending'] },
              ].map(guide => (
                <div key={guide.title}>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 12, color: '#888899', marginBottom: 4 }}>{guide.title}</div>
                  <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {guide.steps.map((s, i) => (
                      <li key={i} style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#666677', lineHeight: 1.5 }}>{s}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type TabKey = 'overview' | 'members' | 'registrations' | 'contacts' | 'support' | 'events' | 'leaderboard' | 'announcements' | 'instagram' | 'spotlights' | 'partners' | 'chatlogs' | 'blog' | 'newsletter' | 'users' | 'aicontext' | 'settings';

type NavItem = {
  key: TabKey;
  label: string;
  icon: string;
  badge?: number | null;
  href?: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function BackendPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [pendingCount, setPendingCount] = useState(0);
  const [authChecked, setAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/enter/backend/login');
      } else {
        setUserEmail(data.session.user.email ?? null);
        setAuthChecked(true);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/enter/backend/login');
    });
    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    supabase
      .from('members')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .then(({ count }) => { if (count != null) setPendingCount(count); });
  }, [authChecked]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/enter/backend/login');
  }

  if (!authChecked) {
    return (
      <div style={{ background: '#080810', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 36,
            height: 36,
            border: '3px solid rgba(212,175,55,0.2)',
            borderTopColor: '#D4AF37',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <div style={{ fontFamily: 'var(--font-montserrat)', color: '#888899', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Loading...
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const navGroups: NavGroup[] = [
    {
      label: 'Content',
      items: [
        { key: 'members', label: 'Members', icon: '👥', badge: pendingCount > 0 ? pendingCount : undefined },
        { key: 'registrations', label: 'Registrations', icon: '📋' },
        { key: 'contacts', label: 'Contact Inbox', icon: '📩' },
        { key: 'support',  label: 'Support Tickets', icon: '🎫' },
        { key: 'events', label: 'Events', icon: '📅' },
        { key: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
      ],
    },
    {
      label: 'Engage',
      items: [
        { key: 'announcements', label: 'Announcements', icon: '📣' },
        { key: 'instagram', label: 'Instagram', icon: '📸' },
        { key: 'spotlights', label: 'Spotlights', icon: '⭐' },
        { key: 'blog', label: 'Blog', icon: '✍️' },
      ],
    },
    {
      label: 'Manage',
      items: [
        { key: 'aicontext', label: 'AI Knowledge', icon: '🤖' },
        { key: 'partners', label: 'Partners', icon: '🤝' },
        { key: 'chatlogs', label: 'Chat Logs', icon: '💬' },
        { key: 'newsletter', label: 'Newsletter', icon: '📧' },
        { key: 'users', label: 'Users & Access', icon: '🔐' },
        { key: 'settings', label: 'Site Settings', icon: '⚙️' },
      ],
    },
    {
      label: 'Tools',
      items: [
        { key: 'overview' as TabKey, label: 'Tournament Planner', icon: '🏸', href: '/admin/tournament' },
        { key: 'overview' as TabKey, label: 'Form Builder', icon: '📝', href: '/admin/forms' },
      ],
    },
  ];

  const allNavItems: NavItem[] = navGroups.flatMap(g => g.items);

  const activeLabel =
    activeTab === 'overview'
      ? 'Overview'
      : allNavItems.find(i => i.key === activeTab)?.label ?? activeTab;

  function NavItemButton({ item }: { item: NavItem }) {
    const isActive = activeTab === item.key;
    if (item.href) {
      return (
        <a href={item.href} style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
          padding: '9px 16px 9px 14px', background: 'transparent',
          borderLeft: '3px solid transparent', borderTop: 'none', borderRight: 'none', borderBottom: 'none',
          borderRadius: '0 6px 6px 0', color: 'rgba(255,255,255,0.45)',
          fontFamily: 'var(--font-montserrat)', fontWeight: 500, fontSize: 13,
          letterSpacing: '0.02em', textDecoration: 'none', whiteSpace: 'nowrap',
          transition: 'background 0.15s, color 0.15s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.75)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'; }}
        >
          <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
          <span style={{ flex: 1 }}>{item.label}</span>
          <span style={{ fontSize: 10, opacity: 0.4 }}>↗</span>
        </a>
      );
    }
    return (
      <button
        key={item.key}
        onClick={() => { setActiveTab(item.key); setMobileSidebarOpen(false); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          padding: '9px 16px 9px 14px',
          background: isActive ? 'rgba(212,175,55,0.1)' : 'transparent',
          border: 'none',
          borderLeft: isActive ? '3px solid #D4AF37' : '3px solid transparent',
          borderRadius: '0 6px 6px 0',
          color: isActive ? '#D4AF37' : 'rgba(255,255,255,0.45)',
          fontFamily: 'var(--font-montserrat)',
          fontWeight: isActive ? 700 : 500,
          fontSize: 13,
          letterSpacing: '0.02em',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.15s, color 0.15s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
      >
        <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.badge != null && (
          <span style={{
            background: '#C21818',
            color: '#fff',
            borderRadius: 10,
            padding: '1px 6px',
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1.5,
            flexShrink: 0,
          }}>
            {item.badge}
          </span>
        )}
      </button>
    );
  }

  const sidebarContent = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: 'auto',
    }}>
      {/* Logo area */}
      <div style={{ padding: '20px 16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/rcc-logo.png" alt="RCC" style={{ height: 36, width: 36, objectFit: 'contain', flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.15rem', color: '#D4AF37', letterSpacing: '0.08em', lineHeight: 1 }}>
              ADMIN PANEL
            </div>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 9, color: '#888899', letterSpacing: '0.1em', marginTop: 3, textTransform: 'uppercase' }}>
              Racquets Club Community
            </div>
          </div>
        </div>
      </div>

      {/* Overview nav item */}
      <div style={{ padding: '10px 0 4px' }}>
        <NavItemButton item={{ key: 'overview', label: 'Overview', icon: '📊' }} />
      </div>

      {/* Nav groups */}
      <div style={{ flex: 1, paddingBottom: 8 }}>
        {navGroups.map(group => (
          <div key={group.label} style={{ marginBottom: 4 }}>
            <div style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: 10,
              fontWeight: 700,
              color: '#888899',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '14px 16px 6px',
            }}>
              {group.label}
            </div>
            {group.items.map(item => (
              <NavItemButton key={item.key} item={item} />
            ))}
          </div>
        ))}
      </div>

      {/* Bottom: user info + sign out */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        {userEmail && (
          <div style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: '#888899',
            marginBottom: 10,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {userEmail}
          </div>
        )}
        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6,
            color: '#888899',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.06em',
            padding: '8px 0',
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)';
            (e.currentTarget as HTMLButtonElement).style.color = '#e8e8ec';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)';
            (e.currentTarget as HTMLButtonElement).style.color = '#888899';
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );

  // Mobile tab items (flat list for overflow-x scroll)
  const mobileTabItems: NavItem[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    ...navGroups.flatMap(g => g.items),
  ];

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* KPI + donut grids break to 2-col on tablet, 1-col on mobile */
        .kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
        .donut-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 24px; }
        .activity-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 16px; margin-bottom: 24px; }
        .sponsor-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        @media (max-width: 1100px) {
          .kpi-grid { grid-template-columns: repeat(2,1fr) !important; }
          .donut-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 700px) {
          .kpi-grid { grid-template-columns: 1fr !important; }
          .donut-grid { grid-template-columns: 1fr !important; }
          .activity-grid { grid-template-columns: 1fr !important; }
          .sponsor-grid { grid-template-columns: repeat(2,1fr) !important; }
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            z-index: 300;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .admin-sidebar.open {
            transform: translateX(0) !important;
          }
          .admin-main {
            margin-left: 0 !important;
            width: 100% !important;
          }
          .rcc-sidebar { display: flex !important; }
          .rcc-mobile-topbar { display: none !important; }
          .rcc-main-col { margin-left: 0 !important; }
          .rcc-desktop-topbar { display: flex !important; }
          .rcc-hamburger { display: block !important; }
        }
        @media (min-width: 769px) and (max-width: 1023px) {
          .rcc-sidebar { display: none !important; }
          .rcc-mobile-topbar { display: flex !important; }
          .rcc-main-col { margin-left: 0 !important; }
          .rcc-desktop-topbar { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .rcc-mobile-topbar { display: none !important; }
          .rcc-desktop-topbar { display: flex !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#080810', color: '#e8e8ec', fontFamily: 'var(--font-inter)' }}>

        {/* ── Mobile overlay backdrop ── */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(0,0,0,0.6)',
            }}
          />
        )}

        {/* ── Sidebar (desktop + mobile slide-in) ── */}
        <div
          className={`rcc-sidebar admin-sidebar${mobileSidebarOpen ? ' open' : ''}`}
          style={{
            width: 220,
            flexShrink: 0,
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            background: '#0d0d14',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            zIndex: 40,
          }}
        >
          {sidebarContent}
        </div>

        {/* ── Main content column ── */}
        <div
          className="rcc-main-col admin-main"
          style={{ flex: 1, marginLeft: 220, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
        >
          {/* Mobile top tab bar */}
          <div
            className="rcc-mobile-topbar"
            style={{
              display: 'none',
              background: '#0d0d14',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              overflowX: 'auto',
              gap: 0,
              flexShrink: 0,
            }}
          >
            {mobileTabItems.map(t => {
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                    color: isActive ? '#D4AF37' : '#888899',
                    fontFamily: 'var(--font-montserrat)',
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    padding: '13px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    flexShrink: 0,
                  }}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                  {t.badge != null && (
                    <span style={{ background: '#C21818', color: '#fff', borderRadius: 10, padding: '1px 5px', fontSize: 9, fontWeight: 700 }}>
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Top bar */}
          <div className="rcc-desktop-topbar" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 32px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: '#080810',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Hamburger button — only visible on mobile via CSS */}
              <button
                className="rcc-hamburger"
                onClick={() => setMobileSidebarOpen(v => !v)}
                style={{
                  display: 'none',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 6,
                  color: '#888899',
                  cursor: 'pointer',
                  padding: '6px 10px',
                  lineHeight: 1,
                  fontSize: 18,
                }}
              >
                ☰
              </button>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.6rem', color: '#e8e8ec', letterSpacing: '0.06em', lineHeight: 1 }}>
                {activeLabel}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {userEmail && (
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899' }}>{userEmail}</span>
              )}
              <button
                onClick={handleSignOut}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 6,
                  color: '#888899',
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Module content */}
          <div style={{ flex: 1, padding: 'clamp(24px,3vw,40px) clamp(20px,3vw,40px)', overflowY: 'auto' }}>
            {activeTab === 'overview'      && <OverviewModule />}
            {activeTab === 'members'       && <MembersModule />}
            {activeTab === 'registrations' && <RegistrationsModule />}
            {activeTab === 'contacts'      && <ContactsModule />}
            {activeTab === 'support'       && <SupportTicketsModule />}
            {activeTab === 'events'        && <EventsModule />}
            {activeTab === 'leaderboard'   && <LeaderboardModule />}
            {activeTab === 'announcements' && <AnnouncementsModule />}
            {activeTab === 'instagram'     && <InstagramModule />}
            {activeTab === 'spotlights'    && <SpotlightsModule />}
            {activeTab === 'partners'      && <PartnersModule />}
            {activeTab === 'newsletter'    && <NewsletterModule />}
            {activeTab === 'chatlogs'      && <ChatLogsModule />}
            {activeTab === 'blog'          && <BlogModule />}
            {activeTab === 'users'         && <UserManagementModule />}
            {activeTab === 'aicontext'      && <AiContextModule />}
            {activeTab === 'settings'       && <SiteSettingsModule />}
          </div>
        </div>
      </div>
    </>
  );
}
