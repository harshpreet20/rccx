'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'crimson' | 'gold' | 'neon' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  target?: string;
  rel?: string;
}

export default function GlowButton({
  children,
  href,
  onClick,
  variant = 'crimson',
  size = 'md',
  className,
  target,
  rel,
}: GlowButtonProps) {
  const sizeClasses = {
    sm: 'px-5 py-2.5 text-xs',
    md: 'px-7 py-3.5 text-sm',
    lg: 'px-10 py-5 text-base',
  };

  const variantClasses = {
    crimson: 'bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white hover:shadow-[0_0_30px_rgba(194,24,24,0.6)]',
    gold: 'bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-[#050810] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]',
    neon: 'bg-[#D9FF00] text-[#050810] hover:shadow-[0_0_30px_rgba(217,255,0,0.6)]',
    outline: 'bg-transparent border border-[#D4AF37]/30 text-[#D4AF37] hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]',
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 font-bold tracking-widest rounded-full transition-all duration-300 hover:scale-105 cursor-pointer',
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const content = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={baseClasses}
      onClick={onClick}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className="inline-block">
        {content}
      </a>
    );
  }

  return content;
}
