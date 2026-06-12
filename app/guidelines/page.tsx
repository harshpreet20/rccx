'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

const guidelines = [
  {
    id: 1,
    category: 'Conduct',
    icon: '🤝',
    color: '#D4AF37',
    title: 'Respectful Conduct is Mandatory',
    content: 'All RCC members must maintain respectful conduct at all times — on court and in community communications. Disrespectful behavior, bullying, or intimidation of any form will result in immediate removal from the community.',
    type: 'required',
  },
  {
    id: 2,
    category: 'Conduct',
    icon: '🚫',
    color: '#C21818',
    title: 'Zero Tolerance for Harassment',
    content: 'Any form of harassment — verbal, written, or physical — is strictly prohibited. This includes discrimination based on gender, skill level, age, or background. RCC is a safe space for all sincere players.',
    type: 'warning',
  },
  {
    id: 3,
    category: 'Community',
    icon: '💬',
    color: '#C21818',
    title: 'No Spamming the Community',
    content: 'Unnecessary messages, promotional content (without admin approval), or off-topic discussions are not permitted in community channels. Keep communications relevant and respectful.',
    type: 'warning',
  },
  {
    id: 4,
    category: 'Community',
    icon: '🔒',
    color: '#C21818',
    title: 'No Poaching Members',
    content: 'Attempting to solicit, recruit, or poach RCC members for competing groups, services, or communities without explicit admin approval is strictly prohibited and grounds for immediate removal.',
    type: 'warning',
  },
  {
    id: 5,
    category: 'Community',
    icon: '📢',
    color: '#C21818',
    title: 'No Unauthorized Promotions',
    content: 'Personal services, products, or external businesses must not be promoted in RCC channels without admin permission. Partnership and sponsorship inquiries must go through official channels.',
    type: 'warning',
  },
  {
    id: 6,
    category: 'Sessions',
    icon: '💳',
    color: '#D4AF37',
    title: 'Advance Payment Required',
    content: 'Session slots are confirmed only upon advance payment. Unpaid slots may be reallocated. Payment deadlines are communicated by admins and must be respected to secure your spot.',
    type: 'required',
  },
  {
    id: 7,
    category: 'Sessions',
    icon: '⏰',
    color: '#D4AF37',
    title: 'Weekend Slots are Limited',
    content: 'Weekend session slots fill up fast. Members should register early. Waitlist spots are offered in order of registration. Walk-in players are not guaranteed entry without prior confirmation.',
    type: 'info',
  },
  {
    id: 8,
    category: 'Sessions',
    icon: '💸',
    color: '#C21818',
    title: 'Late Backouts are Payable',
    content: 'Cancellations within 24 hours of a confirmed session are payable. If your slot cannot be filled by another member, you are responsible for the court cost associated with your spot.',
    type: 'warning',
  },
  {
    id: 9,
    category: 'Disputes',
    icon: '⚖️',
    color: '#D4AF37',
    title: 'Disclose Rivalries to Admins',
    content: 'Any existing rivalries, disputes, or personal issues with other RCC members must be disclosed to admins before participating in shared sessions or tournaments. Admins will make appropriate arrangements to ensure fair, comfortable gameplay for all.',
    type: 'required',
  },
];

const typeConfig = {
  required: { bg: 'bg-[#D4AF37]/10', border: 'border-[#D4AF37]/20', badge: 'bg-[#D4AF37]/20 text-[#D4AF37]', label: 'REQUIRED' },
  warning: { bg: 'bg-[#C21818]/10', border: 'border-[#C21818]/20', badge: 'bg-[#C21818]/20 text-[#C21818]', label: 'IMPORTANT' },
  info: { bg: 'bg-white/5', border: 'border-white/10', badge: 'bg-white/10 text-white/60', label: 'INFO' },
};

const categories = ['All', 'Conduct', 'Community', 'Sessions', 'Disputes'];

export default function GuidelinesPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? guidelines
    : guidelines.filter((g) => g.category === activeCategory);

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-[#0B1F3A]/30 to-transparent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.5em] font-bold uppercase">The Code</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
          >
            Community{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#C21818]">
              Guidelines
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-xl leading-relaxed"
          >
            RCC is built on mutual respect. These guidelines ensure every member has an excellent experience.
          </motion.p>
        </div>
      </section>

      {/* Quote */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="glass-gold rounded-3xl p-10 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #D4AF37 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            />
            <div className="relative">
              <Shield size={40} className="text-[#D4AF37] mx-auto mb-4 opacity-60" />
              <p className="text-2xl md:text-3xl font-black text-white">
                "In Delhi, badminton is more than a game —
              </p>
              <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37]">
                it's a community."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category filters */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#C21818] to-[#D4AF37] text-white'
                    : 'glass text-white/60 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion Guidelines */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto space-y-4">
          <AnimatePresence>
            {filtered.map((guideline, i) => {
              const config = typeConfig[guideline.type as keyof typeof typeConfig];
              const isOpen = openId === guideline.id;

              return (
                <motion.div
                  key={guideline.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className={`rounded-2xl border overflow-hidden ${config.border} ${config.bg}`}
                >
                  <button
                    className="w-full p-6 flex items-center gap-4 text-left group"
                    onClick={() => setOpenId(isOpen ? null : guideline.id)}
                  >
                    <span className="text-2xl flex-shrink-0">{guideline.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-black tracking-widest ${config.badge}`}>
                          {config.label}
                        </span>
                        <span className="text-white/30 text-xs tracking-wider uppercase">{guideline.category}</span>
                      </div>
                      <h3 className="text-white font-black text-base group-hover:text-[#D4AF37] transition-colors">
                        {guideline.title}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 text-white/40"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pl-16">
                          <div className="h-px bg-white/5 mb-4" />
                          <p className="text-white/70 leading-relaxed">{guideline.content}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
