'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={cn('flex flex-col gap-4', alignClass[align], className)}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="h-px w-8 bg-gradient-to-r from-[#C21818] to-[#D4AF37]" />
          <span className="text-[#D4AF37] text-xs tracking-[0.4em] font-bold uppercase">{eyebrow}</span>
          <div className="h-px w-8 bg-gradient-to-r from-[#D4AF37] to-[#C21818]" />
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight"
      >
        {title}{' '}
        {highlight && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37]">
            {highlight}
          </span>
        )}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/50 text-lg max-w-2xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
