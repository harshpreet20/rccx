'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, TrendingUp, Gift, Heart, Star, ArrowRight } from 'lucide-react';

const PILLARS = [
  {
    icon: <Users size={24} color="#D4AF37" />,
    accent: '#D4AF37',
    title: 'Collaborative Environment',
    body: "No egos, no gatekeeping. Every session is a chance to play with, learn from, and push each other. Senior players mentor newer ones. Everyone's game rises when we train together.",
    tags: ['Peer coaching', 'Partner rotation', 'Open doubles'],
  },
  {
    icon: <TrendingUp size={24} color="#60a5fa" />,
    accent: '#60a5fa',
    title: 'Real Growth Opportunities',
    body: 'Tracked ELO ratings, structured ladder leagues, and skill-tiered sessions mean you always know exactly where you stand — and what it takes to get to the next level.',
    tags: ['ELO tracking', 'Ladder leagues', 'Tier progression'],
  },
  {
    icon: <Gift size={24} color="#4ade80" />,
    accent: '#4ade80',
    title: 'Giveaways & Rewards',
    body: 'Equipment drops, branded merchandise, event entries — we reward participation, improvement, and community spirit. You show up consistently, RCC looks after you.',
    tags: ['Equipment drops', 'RCC merch', 'Event prizes'],
  },
  {
    icon: <Heart size={24} color="#C21818" />,
    accent: '#C21818',
    title: 'Morale-First Gameplay',
    body: "Formats built so every player walks off court feeling the game was worth it. Skill-matched pairs, round robins, and consolation brackets — because your best game deserves to be seen.",
    tags: ['Skill-matched pairs', 'Round robins', 'Consolation draws'],
  },
];

const PROMISE_STATS = [
  { value: '100%', label: 'Skill-matched sessions' },
  { value: 'Every event', label: 'Has a giveaway or prize' },
  { value: 'Zero', label: 'Inactive members left behind' },
  { value: 'Always', label: "Your growth is our goal" },
];

export default function CommunityEthosSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <section
      ref={ref}
      style={{
        background: '#050810',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 6vw, 120px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(212,175,55,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: 0, right: 0, width: 500, height: 400, background: 'radial-gradient(ellipse at bottom right, rgba(194,24,24,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Central promise statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '6px 18px', background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: 30 }}>
            <Star size={12} color="#D4AF37" fill="#D4AF37" />
            <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', color: '#D4AF37', textTransform: 'uppercase' }}>
              The RCC Promise
            </span>
            <Star size={12} color="#D4AF37" fill="#D4AF37" />
          </div>

          <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(26px, 4.5vw, 48px)', color: '#fff', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 20 }}>
            We Want Nothing But{' '}
            <span style={{ color: '#D4AF37', WebkitTextStroke: '1px #b8932a' }}>The Best</span>
            {' '}For Our Players
          </h2>

          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
            RCC is not just a booking system. It&apos;s a community that invests in you — your game, your confidence, your friendships. Every decision we make starts with one question: is this good for our players?
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, marginBottom: 56 }}>
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.1 }}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid rgba(255,255,255,0.07)`,
                borderRadius: 16,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${p.accent}35`;
                (e.currentTarget as HTMLDivElement).style.background = `rgba(255,255,255,0.038)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)';
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${p.accent}14`, border: `1px solid ${p.accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.icon}
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 8, letterSpacing: '0.02em' }}>{p.title}</div>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: 0 }}>{p.body}</p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
                {p.tags.map(tag => (
                  <span key={tag} style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 20, background: `${p.accent}12`, color: p.accent, border: `1px solid ${p.accent}25` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Promise stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 16, padding: 'clamp(20px, 3vw, 32px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 24 }}
        >
          {PROMISE_STATS.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(16px, 2vw, 22px)', color: '#D4AF37', marginBottom: 5, letterSpacing: '0.02em' }}>{value}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.65 }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}
        >
          <a
            href="/membership"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #C21818, #8B0000)',
              border: 'none', borderRadius: 10, color: '#fff',
              fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 12,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              textDecoration: 'none', cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(194,24,24,0.3)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 36px rgba(194,24,24,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 30px rgba(194,24,24,0.3)'; }}
          >
            Become Part of This <ArrowRight size={15} />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
