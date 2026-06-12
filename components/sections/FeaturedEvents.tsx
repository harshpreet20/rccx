'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, MapPin, Users, ArrowRight, Trophy } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

const events = [
  {
    id: 1,
    title: 'Budget Badminton League',
    venue: 'Delhi Sports Complex',
    date: 'Past Event',
    type: 'Tournament',
    slots: 'Sold Out',
    level: 'All Levels',
    highlight: 'Portronics stands & RCC racket gifted!',
    color: 'from-[#C21818] to-[#8B0000]',
    icon: '🏆',
  },
  {
    id: 2,
    title: 'Weekend Smash Session',
    venue: 'Siri Fort Sports Complex',
    date: 'Saturdays',
    type: 'Regular Session',
    slots: '8 slots left',
    level: 'Intermediate',
    highlight: 'Skill-based pairings every weekend',
    color: 'from-[#0B1F3A] to-[#162B50]',
    icon: '⚡',
  },
  {
    id: 3,
    title: 'Mixed Doubles Night',
    venue: 'RCC Partner Courts',
    date: 'Monthly',
    type: 'Community Game',
    slots: '6 slots left',
    level: 'All Levels',
    highlight: 'Community bonding over doubles',
    color: 'from-[#D4AF37]/20 to-[#B8960C]/10',
    icon: '🌙',
  },
];

export default function FeaturedEvents() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0B1F3A]/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Events"
          title="Where Champions"
          highlight="Compete"
          subtitle="Regular sessions, intense tournaments, and community games designed for serious badminton lovers."
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass rounded-3xl overflow-hidden group cursor-pointer"
            >
              {/* Card header */}
              <div className={`bg-gradient-to-br ${event.color} p-8 relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />
                <div className="relative">
                  <span className="text-4xl">{event.icon}</span>
                  <div className="mt-4">
                    <span className="text-xs tracking-widest text-white/60 uppercase font-medium">{event.type}</span>
                    <h3 className="text-xl font-black text-white mt-1 leading-tight">{event.title}</h3>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <MapPin size={14} className="text-[#C21818]" />
                  {event.venue}
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Calendar size={14} className="text-[#D4AF37]" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Users size={14} className="text-[#D9FF00]" />
                  {event.slots} • {event.level}
                </div>

                <div className="h-px bg-white/5" />

                <p className="text-white/50 text-sm italic">{event.highlight}</p>

                <div className="flex items-center justify-between">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold tracking-wider ${
                    event.slots === 'Sold Out'
                      ? 'bg-[#C21818]/20 text-[#C21818]'
                      : 'bg-[#D9FF00]/10 text-[#D9FF00]'
                  }`}>
                    {event.slots}
                  </span>
                  <span className="text-[#D4AF37] group-hover:text-white flex items-center gap-1 text-sm transition-colors">
                    Details <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-3 px-8 py-4 border border-[#D4AF37]/30 text-[#D4AF37] font-bold tracking-widest text-sm rounded-full hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300"
          >
            VIEW ALL EVENTS
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
