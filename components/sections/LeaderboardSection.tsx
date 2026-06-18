'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { TrendingUp, Shield, Award } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  player_name: string;
  avatar_url: string | null;
  elo_rating: number;
  wins: number;
  losses: number;
  streak: number;
  best_streak: number;
  badges: string[];
  skill_level: string;
  rank_change: number;
}

type TabOption = 'WEEKLY' | 'MONTHLY' | 'ALL-TIME';

const TABS: TabOption[] = ['WEEKLY', 'MONTHLY', 'ALL-TIME'];

const SKILL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  elite: { bg: 'rgba(201,168,76,0.15)', text: '#C9A84C', border: 'rgba(201,168,76,0.4)' },
  advanced: { bg: 'rgba(194,24,24,0.15)', text: '#ef4444', border: 'rgba(194,24,24,0.4)' },
  intermediate: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', border: 'rgba(59,130,246,0.4)' },
  beginner: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80', border: 'rgba(34,197,94,0.4)' },
};

function getSkillColor(level: string) {
  return SKILL_COLORS[level?.toLowerCase()] || SKILL_COLORS['intermediate'];
}

const MEDAL_STYLES = [
  { border: 'rgba(201,168,76,0.6)', text: '#C9A84C', bg: 'rgba(201,168,76,0.12)', label: '1st' },
  { border: 'rgba(160,160,180,0.6)', text: '#a0a0b4', bg: 'rgba(160,160,180,0.1)', label: '2nd' },
  { border: 'rgba(180,100,40,0.6)', text: '#c06030', bg: 'rgba(180,100,40,0.1)', label: '3rd' },
];

function RankChangeArrow({ change }: { change: number }) {
  if (change > 0) {
    return (
      <span style={{ color: '#4ade80', fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 700 }}>
        ▲ {change}
      </span>
    );
  }
  if (change < 0) {
    return (
      <span style={{ color: '#ef4444', fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 700 }}>
        ▼ {Math.abs(change)}
      </span>
    );
  }
  return (
    <span style={{ color: '#888899', fontFamily: 'var(--font-montserrat)', fontSize: '12px' }}>—</span>
  );
}

function StreakIndicator({ streak }: { streak: number }) {
  if (streak <= 0) return null;
  const flames = Math.min(streak, 5);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {Array.from({ length: flames }).map((_, i) => (
        <span key={i} style={{ fontSize: '12px', opacity: 0.7 + i * 0.06 }}>🔥</span>
      ))}
      <span
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '11px',
          color: '#C9A84C',
          fontWeight: 600,
          marginLeft: '2px',
        }}
      >
        {streak}
      </span>
    </div>
  );
}

export default function LeaderboardSection() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<TabOption>('ALL-TIME');
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data } = await supabase
        .from('leaderboard')
        .select('*')
        .order('elo_rating', { ascending: false });
      if (data) setEntries(data);
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '80px clamp(16px, 5vw, 120px)',
        background: '#0A1628',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(194,24,24,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Player silhouette — deception lunge pose */}
      <svg aria-hidden style={{ position: 'absolute', bottom: 0, right: '3%', width: 120, height: 220, opacity: 0.07, pointerEvents: 'none' }} viewBox="0 0 80 160" fill="#C9A84C">
        {/* Head */}
        <circle cx="48" cy="12" r="8" />
        {/* Torso */}
        <rect x="38" y="20" width="14" height="36" rx="3" />
        {/* Right arm extended overhead (racket swing) */}
        <line x1="52" y1="24" x2="72" y2="4" stroke="#C9A84C" strokeWidth="5" strokeLinecap="round" />
        {/* Racket head */}
        <ellipse cx="74" cy="2" rx="7" ry="5" fill="none" stroke="#C9A84C" strokeWidth="2.5" />
        {/* Left arm */}
        <line x1="38" y1="26" x2="22" y2="38" stroke="#C9A84C" strokeWidth="5" strokeLinecap="round" />
        {/* Right leg — lunge forward */}
        <line x1="48" y1="56" x2="60" y2="100" stroke="#C9A84C" strokeWidth="5" strokeLinecap="round" />
        <line x1="60" y1="100" x2="78" y2="110" stroke="#C9A84C" strokeWidth="5" strokeLinecap="round" />
        {/* Left leg — back leg */}
        <line x1="42" y1="56" x2="30" y2="100" stroke="#C9A84C" strokeWidth="5" strokeLinecap="round" />
        <line x1="30" y1="100" x2="20" y2="108" stroke="#C9A84C" strokeWidth="5" strokeLinecap="round" />
      </svg>

      {/* Drifting shuttle */}
      <svg aria-hidden style={{ position: 'absolute', top: '8%', right: '18%', width: 22, height: 30, opacity: 0.15, animation: 'shuttle-drift-lb 20s linear infinite', pointerEvents: 'none' }} viewBox="0 0 32 40">
        <circle cx="16" cy="7" r="6" fill="#C9A84C" />
        <path d="M10 13 Q16 32 22 13 Q16 18 10 13Z" fill="#C9A84C" opacity="0.7" />
        {[0,1,2,3,4,5,6,7].map(i => <line key={i} x1="16" y1="13" x2={16 + Math.cos((i/8)*Math.PI*2)*11} y2={13 + Math.sin((i/8)*Math.PI*2)*14} stroke="#C9A84C" strokeWidth="0.8" opacity="0.5" />)}
      </svg>
      <style>{`@keyframes shuttle-drift-lb { 0%{transform:translate(0,0) rotate(-20deg)} 50%{transform:translate(-30vw,40px) rotate(-20deg)} 100%{transform:translate(0,0) rotate(-20deg)} }`}</style>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '48px',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              color: '#e8e8ec',
              transform: 'skewX(-4deg)',
              display: 'inline-block',
              lineHeight: 1,
              marginBottom: '12px',
            }}
          >
            RCC{' '}
            <span className="text-gradient-gold">LEADERBOARD</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: '#888899' }}>
            Climb the ranks. Earn your place at the top.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 18px',
                borderRadius: '6px',
                border: activeTab === tab ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.1)',
                background: activeTab === tab ? 'rgba(201,168,76,0.1)' : 'transparent',
                color: activeTab === tab ? '#C9A84C' : '#888899',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      <div
        style={{
          background: 'rgba(17,17,24,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          overflowX: 'auto',
          boxShadow: '0 0 80px rgba(194,24,24,0.05)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '56px 1fr auto auto auto auto',
            gap: '0 16px',
            padding: '12px 24px',
            background: 'rgba(0,0,0,0.3)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
          className="lb-header"
        >
          {['RANK', 'PLAYER', 'ELO', 'W/L', 'STREAK', 'BADGES'].map((h) => (
            <div
              key={h}
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#888899',
                textTransform: 'uppercase',
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888899', fontFamily: 'var(--font-inter)' }}>
            Loading leaderboard...
          </div>
        ) : (
          <div>
            {entries.map((entry, index) => (
              <LeaderboardRow
                key={entry.id}
                entry={entry}
                rank={index + 1}
                isInView={isInView}
                delay={index * 0.06}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .lb-header { grid-template-columns: 40px 1fr auto !important; }
          .lb-row { grid-template-columns: 40px 1fr auto !important; }
          .lb-hide { display: none !important; }
          .lb-hide-sm { display: none !important; }
        }
      `}</style>
    </section>
  );
}

function LeaderboardRow({
  entry,
  rank,
  isInView,
  delay,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isInView: boolean;
  delay: number;
}) {
  const medal = rank <= 3 ? MEDAL_STYLES[rank - 1] : null;
  const skillColor = getSkillColor(entry.skill_level);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 1fr auto auto auto auto',
        gap: '0 16px',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: hovered
          ? 'rgba(255,255,255,0.02)'
          : medal
          ? `${medal.bg}`
          : 'transparent',
        transition: 'background 0.2s',
        alignItems: 'center',
      }}
      className="lb-row"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {medal ? (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: `2px solid ${medal.border}`,
              background: medal.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-bebas)',
              fontSize: '1rem',
              color: medal.text,
            }}
          >
            {rank}
          </div>
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: '1.3rem',
              color: '#888899',
            }}
          >
            {rank}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {entry.avatar_url ? (
          <img
            src={entry.avatar_url}
            alt={entry.player_name}
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Shield size={16} color="#D4AF37" />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '14px',
              fontWeight: 700,
              color: '#e8e8ec',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {entry.player_name}
          </div>
          <span
            style={{
              padding: '2px 8px',
              background: skillColor.bg,
              border: `1px solid ${skillColor.border}`,
              borderRadius: '3px',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: skillColor.text,
              textTransform: 'uppercase',
            }}
          >
            {entry.skill_level}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }} className="lb-hide">
        <span
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: '1.4rem',
            color: medal ? medal.text : '#C9A84C',
            lineHeight: 1,
          }}
        >
          {entry.elo_rating}
        </span>
        <div style={{ marginTop: '2px' }}>
          <RankChangeArrow change={entry.rank_change ?? 0} />
        </div>
      </div>

      <div style={{ textAlign: 'right' }} className="lb-hide">
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '13px', color: '#4ade80', fontWeight: 600 }}>
          {entry.wins}W
        </span>
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '13px', color: '#ef4444', fontWeight: 600 }}>
          /{entry.losses}L
        </span>
      </div>

      <div className="lb-hide">
        <StreakIndicator streak={entry.streak ?? 0} />
      </div>

      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '120px' }}>
        {(entry.badges || []).slice(0, 3).map((badge, i) => (
          <span key={i} style={{ fontSize: '16px' }} title={badge}>
            {badge}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
