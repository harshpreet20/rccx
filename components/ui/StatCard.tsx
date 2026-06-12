'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  value: number;
  suffix?: string;
  label: string;
  icon?: string;
  delay?: number;
  className?: string;
}

function useCountUp(target: number, duration = 2000, delay = 0) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => {
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [started, target, duration, delay]);

  return { count, setStarted };
}

export default function StatCard({ value, suffix = '+', label, icon, delay = 0, className }: StatCardProps) {
  const { count, setStarted } = useCountUp(value, 2000, delay * 200);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: delay * 0.1 }}
      onViewportEnter={() => setStarted(true)}
      className={cn(
        'glass rounded-2xl p-6 text-center group hover:glow-gold transition-all duration-500 cursor-default animate-float',
        className
      )}
      style={{ animationDelay: `${delay * 0.5}s` }}
    >
      {icon && (
        <div className="text-3xl mb-3">{icon}</div>
      )}
      <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37] mb-2">
        {count}{suffix}
      </div>
      <div className="text-white/60 text-sm tracking-widest uppercase font-medium">{label}</div>
    </motion.div>
  );
}
