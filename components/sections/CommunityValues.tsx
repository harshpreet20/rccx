'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const values = [
  {
    icon: '🏸',
    title: 'Respect First',
    description: 'Every player deserves dignity. We play hard on court, but remain respectful off it.',
    color: '#C21818',
  },
  {
    icon: '🎯',
    title: 'Serious Craft',
    description: 'This is not casual. We care about improvement, fair play, and meaningful competition.',
    color: '#D4AF37',
  },
  {
    icon: '🤝',
    title: 'Invite Only',
    description: 'Quality over quantity. Every member is vouched for by the community they join.',
    color: '#D9FF00',
  },
  {
    icon: '⚡',
    title: 'Regular Play',
    description: 'Weekend sessions, skill-based pairings, and court support to keep you in the game.',
    color: '#C21818',
  },
  {
    icon: '🏆',
    title: 'Compete',
    description: 'From friendly rallies to the Budget Badminton League — there\'s always something to win.',
    color: '#D4AF37',
  },
  {
    icon: '🌐',
    title: 'Community',
    description: 'More than badminton — meaningful connections, networking, and lifelong friendships.',
    color: '#D9FF00',
  },
];

export default function CommunityValues() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C21818]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
      </div>

      {/* Court pattern background */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Our Values"
          title="Built on"
          highlight="Principles"
          subtitle="RCC isn't just about badminton. It's a culture built on mutual respect, dedication, and community."
          className="mb-20"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass rounded-3xl p-8 group hover:glow-gold transition-all duration-500"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ background: `${value.color}15`, border: `1px solid ${value.color}30` }}
              >
                {value.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-3">{value.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{value.description}</p>
              <div
                className="h-px mt-6 w-0 group-hover:w-full transition-all duration-700"
                style={{ background: `linear-gradient(to right, ${value.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Big quote */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="glass-gold rounded-3xl p-12 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #D4AF37 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            />
            <div className="relative">
              <div className="text-6xl text-[#D4AF37] opacity-30 font-serif mb-4">"</div>
              <p className="text-2xl md:text-3xl font-black text-white leading-tight mb-4">
                In Delhi, badminton is more than a game —
              </p>
              <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37]">
                it's a community.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
