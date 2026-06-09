'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Announcement {
  id: string;
  title: string;
  body: string;
  category: string;
  author: string;
  pinned: boolean;
  image_url?: string;
  created_at: string;
}

const FALLBACK: Announcement[] = [
  {
    id: '1', pinned: true, category: 'match_result', author: 'RCC Admin',
    title: '🏆 Smash Night #11 Results',
    body: 'Arjun Mehta & Dev Malhotra claimed the doubles title after a nail-biting 21-19 final game. Full bracket results pinned below.',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '2', pinned: true, category: 'event', author: 'RCC Admin',
    title: '📅 Summer Ladder League Registration Open',
    body: 'Spots are filling fast for our 6-week ladder league starting June 1st. Register before May 28th to secure your seed.',
    image_url: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=700&q=80',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: '3', pinned: false, category: 'achievement', author: 'RCC Admin',
    title: '🌟 Sneha Gupta reaches Advanced tier',
    body: 'After an incredible 6-match winning streak, Sneha has officially crossed the 1600 ELO threshold. Welcome to Advanced tier!',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: '4', pinned: false, category: 'announcement', author: 'RCC Admin',
    title: '📍 New Venue: Thyagraj Sports Complex',
    body: 'Weekend Open 2026 will be hosted at Thyagraj for the first time. World-class courts, ample parking, full cafeteria.',
    image_url: 'https://images.unsplash.com/photo-1544717684-1e5e0a8cf519?w=700&q=80',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: '5', pinned: false, category: 'general', author: 'RCC Admin',
    title: '🎯 Monthly Court Booking Now Open',
    body: 'June court slots are now available. Members get 48-hour early access before public booking opens.',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  match_result: { bg: 'rgba(212,175,55,0.12)', text: '#D4AF37', border: 'rgba(212,175,55,0.3)' },
  event: { bg: 'rgba(194,24,24,0.12)', text: '#ef4444', border: 'rgba(194,24,24,0.3)' },
  announcement: { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  achievement: { bg: 'rgba(139,92,246,0.12)', text: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
  general: { bg: 'rgba(255,255,255,0.08)', text: '#888899', border: 'rgba(255,255,255,0.15)' },
};

function timeAgo(d: string) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function CommunityFeed({ limit }: { limit?: number }) {
  const [items, setItems] = useState<Announcement[]>(FALLBACK);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });
      if (data && data.length > 0) setItems(data);
    }
    fetch();
  }, []);

  const displayed = limit ? items.slice(0, limit) : items;

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
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}
      >
        <div>
          <h2 style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            color: '#e8e8ec',
            transform: 'skewX(-4deg)',
            display: 'inline-block',
            lineHeight: 1,
            marginBottom: '12px',
          }}>
            COMMUNITY <span className="text-gradient-gold">FEED</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: '#888899' }}>
            Latest news, results, and moments from the RCC community.
          </p>
        </div>
        {limit && (
          <a
            href="/community"
            style={{
              fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11,
              letterSpacing: '0.12em', color: '#D4AF37', textDecoration: 'none',
              border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8,
              padding: '10px 20px', whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
          >
            VIEW ALL →
          </a>
        )}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{ columns: 2, columnGap: '20px' }}
        className="community-columns"
      >
        {displayed.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </motion.div>

      <style>{`
        @media (max-width: 640px) {
          .community-columns { columns: 1 !important; }
        }
      `}</style>
    </section>
  );
}

function FeedCard({ item }: { item: Announcement }) {
  const [hovered, setHovered] = useState(false);
  const cat = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.general;
  const hasImage = Boolean(item.image_url);

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        breakInside: 'avoid',
        marginBottom: '20px',
        background: 'rgba(17,17,24,0.7)',
        backdropFilter: 'blur(20px)',
        border: hovered ? `1px solid ${cat.border}` : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '14px',
        overflow: 'hidden',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? `0 0 30px ${cat.bg}` : 'none',
      }}
    >
      {/* Photo strip */}
      {hasImage && (
        <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image_url}
            alt={item.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(17,17,24,0.9) 0%, transparent 60%)',
          }} />
          {item.pinned && (
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              padding: '3px 8px',
              background: 'rgba(212,175,55,0.9)',
              borderRadius: '4px',
              fontFamily: 'var(--font-montserrat)', fontSize: '9px', fontWeight: 800,
              letterSpacing: '0.1em', color: '#0a0a0f',
            }}>
              📌 PINNED
            </div>
          )}
        </div>
      )}

      {/* Text content */}
      <div style={{ padding: '18px 20px 20px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '12px', flexWrap: 'wrap', gap: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {!hasImage && item.pinned && (
              <span style={{
                padding: '3px 8px', background: 'rgba(212,175,55,0.15)',
                border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px',
                fontFamily: 'var(--font-montserrat)', fontSize: '9px', fontWeight: 700,
                letterSpacing: '0.1em', color: '#D4AF37',
              }}>
                📌 PINNED
              </span>
            )}
            <span style={{
              padding: '3px 10px', background: cat.bg, border: `1px solid ${cat.border}`,
              borderRadius: '4px', fontFamily: 'var(--font-montserrat)', fontSize: '9px',
              fontWeight: 700, letterSpacing: '0.1em', color: cat.text, textTransform: 'uppercase',
            }}>
              {item.category?.replace('_', ' ')}
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#888899' }}>
            {timeAgo(item.created_at)}
          </span>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-montserrat)', fontSize: '15px', fontWeight: 700,
          color: '#e8e8ec', marginBottom: '8px', lineHeight: 1.4,
        }}>
          {item.title}
        </h3>

        <p style={{
          fontFamily: 'var(--font-inter)', fontSize: '13px',
          color: '#888899', lineHeight: 1.7, marginBottom: '12px',
        }}>
          {item.body}
        </p>

        <div style={{
          fontFamily: 'var(--font-montserrat)', fontSize: '11px',
          color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.06em',
        }}>
          {item.author}
        </div>
      </div>
    </motion.div>
  );
}
