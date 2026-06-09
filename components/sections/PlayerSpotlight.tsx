'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Play, Award, Target, TrendingUp } from 'lucide-react';

interface PlayerStats {
  elo?: number;
  wins?: number;
  winRate?: number;
  [key: string]: number | undefined;
}

interface Player {
  id: string;
  player_name: string;
  tagline: string;
  bio: string;
  skill_level: string;
  achievements: string[];
  youtube_url: string | null;
  avatar_url: string | null;
  stats: PlayerStats;
  featured: boolean;
  display_order: number;
}

const SKILL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  elite: { bg: 'rgba(212,175,55,0.15)', text: '#D4AF37', border: 'rgba(212,175,55,0.4)' },
  advanced: { bg: 'rgba(194,24,24,0.15)', text: '#C21818', border: 'rgba(194,24,24,0.4)' },
  intermediate: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', border: 'rgba(59,130,246,0.4)' },
  beginner: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80', border: 'rgba(34,197,94,0.4)' },
};

function getSkillColor(level: string) {
  return SKILL_COLORS[level?.toLowerCase()] || SKILL_COLORS['intermediate'];
}

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

export default function PlayerSpotlight() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });

  useEffect(() => {
    async function fetchPlayers() {
      const { data } = await supabase
        .from('player_spotlights')
        .select('*')
        .order('display_order', { ascending: true });
      if (data) setPlayers(data);
      setLoading(false);
    }
    fetchPlayers();
  }, []);

  function goNext() {
    setDirection('right');
    setCurrentIndex((i) => (i + 1) % players.length);
  }

  function goPrev() {
    setDirection('left');
    setCurrentIndex((i) => (i - 1 + players.length) % players.length);
  }

  const slideVariants = {
    enter: (dir: string) => ({
      x: dir === 'right' ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
    exit: (dir: string) => ({
      x: dir === 'right' ? -80 : 80,
      opacity: 0,
      transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
    }),
  };

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
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '-100px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
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
            marginBottom: '12px',
          }}
        >
          PLAYER{' '}
          <span className="text-gradient-gold">SPOTLIGHT</span>
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '15px',
            color: '#888899',
          }}
        >
          Meet the players shaping RCC's legacy on the court.
        </p>
      </motion.div>

      {loading ? (
        <div
          style={{
            height: '520px',
            background: 'rgba(17,17,24,0.7)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        />
      ) : players.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#888899', fontFamily: 'var(--font-inter)' }}>
          No player spotlights available yet.
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={players[currentIndex].id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '40px',
                background: 'rgba(17,17,24,0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                overflow: 'hidden',
                minHeight: '480px',
              }}
              className="spotlight-grid"
            >
              <PlayerInfoPanel player={players[currentIndex]} />
              <PlayerMediaPanel player={players[currentIndex]} />
            </motion.div>
          </AnimatePresence>

          {players.length > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '24px',
              }}
            >
              <button
                onClick={goPrev}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  minWidth: '44px',
                  minHeight: '44px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#888899',
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.4)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#D4AF37';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#888899';
                }}
              >
                <ChevronLeft size={16} /> PREV
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                {players.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > currentIndex ? 'right' : 'left');
                      setCurrentIndex(i);
                    }}
                    style={{
                      width: i === currentIndex ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: i === currentIndex ? '#D4AF37' : 'rgba(255,255,255,0.2)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  minWidth: '44px',
                  minHeight: '44px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#888899',
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.4)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#D4AF37';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#888899';
                }}
              >
                NEXT <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .spotlight-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function PlayerInfoPanel({ player }: { player: Player }) {
  const skillColor = getSkillColor(player.skill_level);

  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {player.avatar_url && (
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(212,175,55,0.3)',
              marginBottom: '20px',
            }}
          >
            <img
              src={player.avatar_url}
              alt={player.player_name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        <span
          style={{
            padding: '4px 12px',
            background: skillColor.bg,
            border: `1px solid ${skillColor.border}`,
            borderRadius: '4px',
            fontFamily: 'var(--font-montserrat)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: skillColor.text,
            textTransform: 'uppercase',
            marginBottom: '16px',
            display: 'inline-block',
          }}
        >
          {player.skill_level}
        </span>

        <h3
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            color: '#e8e8ec',
            lineHeight: 1,
            marginBottom: '8px',
            marginTop: '8px',
          }}
        >
          {player.player_name}
        </h3>

        {player.tagline && (
          <p
            style={{
              fontFamily: 'var(--font-dancing)',
              fontSize: '1.2rem',
              color: '#D4AF37',
              fontStyle: 'italic',
              marginBottom: '16px',
            }}
          >
            {player.tagline}
          </p>
        )}

        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '14px',
            color: '#888899',
            lineHeight: 1.7,
            marginBottom: '24px',
          }}
        >
          {player.bio}
        </p>

        {player.achievements && player.achievements.length > 0 && (
          <div>
            <div
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                color: '#888899',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              Achievements
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {player.achievements.slice(0, 4).map((a, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={13} color="#D4AF37" />
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#e8e8ec' }}>
                    {a}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {player.stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '28px',
          }}
        >
          <StatBox icon={<TrendingUp size={14} color="#D4AF37" />} label="ELO" value={player.stats.elo?.toString() ?? '—'} />
          <StatBox icon={<Target size={14} color="#D4AF37" />} label="Wins" value={player.stats.wins?.toString() ?? '—'} />
          <StatBox icon={<Award size={14} color="#D4AF37" />} label="Win Rate" value={player.stats.winRate ? `${player.stats.winRate}%` : '—'} />
        </div>
      )}
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '12px',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', color: '#e8e8ec', lineHeight: 1 }}>
        {value}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '9px',
          color: '#888899',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginTop: '4px',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function PlayerMediaPanel({ player }: { player: Player }) {
  const embedUrl = player.youtube_url ? getYouTubeEmbedUrl(player.youtube_url) : '';

  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {embedUrl ? (
        <iframe
          src={embedUrl}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '300px',
            border: 'none',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={`${player.player_name} highlight`}
        />
      ) : player.avatar_url ? (
        <div style={{ width: '100%', height: '100%', minHeight: '300px', position: 'relative', overflow: 'hidden' }}>
          <img
            src={player.avatar_url}
            alt={player.player_name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(17,17,24,0.8) 0%, transparent 50%)',
            }}
          />
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '40px',
            color: '#888899',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(212,175,55,0.1)',
              border: '1px solid rgba(212,175,55,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Play size={32} color="#D4AF37" />
          </div>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', textAlign: 'center' }}>
            Highlight video coming soon
          </p>
        </div>
      )}
    </div>
  );
}
