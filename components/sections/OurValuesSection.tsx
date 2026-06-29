'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const VALUES = [
  {
    number: '01',
    title: 'Respect Comes First',
    description: 'No ego. No hierarchy. Every member is welcome, no matter their skill, gender, or background.',
  },
  {
    number: '02',
    title: 'Women First',
    description: 'Dedicated women admins. Safe reporting channels. Sessions designed for comfort. This isn\'t a policy — it\'s our culture.',
  },
  {
    number: '03',
    title: 'Beginners Welcome',
    description: 'Nobody is judged. Everyone starts somewhere. We\'ve helped hundreds of beginners fall in love with the game.',
  },
  {
    number: '04',
    title: 'Fair Play',
    description: 'No toxicity. No discrimination. The court is a level playing field.',
  },
  {
    number: '05',
    title: 'Real Friendships',
    description: 'Members celebrate birthdays together, have coffee, support each other. The community extends beyond sport.',
  },
];

function ValueCard({ value, index, inView }: { value: typeof VALUES[0]; index: number; inView: boolean }) {
  const isLast = index === VALUES.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
      style={{
        gridColumn: isLast ? 'span 1' : undefined,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(201,168,76,0.12)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: 'clamp(28px, 3vw, 40px)',
        position: 'relative',
        transition: 'border-color 0.25s, transform 0.25s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(201,168,76,0.4)';
        el.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(201,168,76,0.12)';
        el.style.transform = 'translateY(0)';
      }}
    >
      {/* Gold top accent */}
      <div style={{
        position: 'absolute',
        top: 0, left: 40,
        width: 40, height: 4,
        background: '#C9A84C',
      }} />

      {/* Faded number */}
      <div style={{
        fontFamily: 'var(--font-dm-mono)',
        fontSize: 48,
        color: '#C9A84C',
        opacity: 0.2,
        lineHeight: 1,
        marginBottom: 20,
        userSelect: 'none',
      }}>
        {value.number}
      </div>

      <h3 style={{
        fontFamily: 'var(--font-playfair)',
        fontSize: 28,
        fontWeight: 600,
        color: '#fff',
        margin: '0 0 14px 0',
        lineHeight: 1.25,
      }}>
        {value.title}
      </h3>

      <p style={{
        fontFamily: 'var(--font-montserrat)',
        fontSize: 16,
        color: 'rgba(245,240,232,0.65)',
        lineHeight: 1.75,
        margin: 0,
      }}>
        {value.description}
      </p>
    </motion.div>
  );
}

export default function OurValuesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' });

  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-5% 0px' });

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(72px, 10vw, 120px) clamp(20px, 6vw, 120px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden style={{
        position: 'absolute', top: 0, right: 0,
        width: 600, height: 600,
        background: 'radial-gradient(ellipse at top right, rgba(201,168,76,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 11,
            letterSpacing: '0.25em',
            color: '#C9A84C',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            OUR VALUES
          </div>
          <h2 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            color: '#fff',
            fontWeight: 400,
            margin: 0,
            lineHeight: 1.15,
          }}>
            What we stand for.
          </h2>
        </motion.div>

        {/* Values grid */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {VALUES.map((value, i) => (
            <ValueCard key={value.number} value={value} index={i} inView={gridInView} />
          ))}
        </div>

      </div>
    </section>
  );
}
