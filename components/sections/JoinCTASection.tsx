'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CTA_BUTTONS = [
  {
    label: 'Join WhatsApp',
    href: 'https://chat.whatsapp.com/rcc',
    variant: 'gold' as const,
  },
  {
    label: 'Book on Hudle',
    href: 'https://hudle.in',
    variant: 'ghost-gold' as const,
  },
  {
    label: 'Follow Instagram',
    href: 'https://instagram.com/racquetsclubcommunity',
    variant: 'ghost-white' as const,
  },
];

export default function JoinCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px' });

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(72px, 10vw, 120px) clamp(20px, 6vw, 80px)',
        textAlign: 'center',
      }}
    >
      {/* Gold radial glow */}
      <div aria-hidden style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120%', height: '120%',
        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top rule */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 1,
        background: 'rgba(201,168,76,0.2)',
      }} />

      {/* Bottom rule */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 1,
        background: 'rgba(201,168,76,0.2)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, width: '100%' }}>

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 12,
            letterSpacing: '0.3em',
            color: '#C9A84C',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          READY TO PLAY?
        </motion.div>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(40px, 8vw, 72px)',
            color: '#fff',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            margin: '0 0 20px 0',
          }}
        >
          Join Delhi&apos;s most respected<br />badminton community.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 18,
            color: 'rgba(245,240,232,0.45)',
            lineHeight: 1.7,
            margin: '0 0 48px 0',
          }}
        >
          First session jitters are normal. We&apos;ve got you.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          {CTA_BUTTONS.map((btn) => {
            const isGold = btn.variant === 'gold';
            const isGhostGold = btn.variant === 'ghost-gold';

            const baseStyle: React.CSSProperties = {
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px 28px',
              borderRadius: 2,
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'opacity 0.2s, transform 0.2s, background 0.2s',
              cursor: 'pointer',
              ...(isGold
                ? {
                    background: '#C9A84C',
                    color: '#000',
                    border: '1px solid #C9A84C',
                  }
                : isGhostGold
                ? {
                    background: 'transparent',
                    color: '#C9A84C',
                    border: '1px solid rgba(201,168,76,0.6)',
                  }
                : {
                    background: 'transparent',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.35)',
                  }),
            };

            return (
              <a
                key={btn.label}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                style={baseStyle}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.opacity = '0.85';
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.opacity = '1';
                  el.style.transform = 'translateY(0)';
                }}
              >
                {btn.label}
              </a>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
