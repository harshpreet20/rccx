'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/SocialIcons';
import { SOCIAL_LINKS } from '@/lib/utils';
import SectionHeading from '@/components/ui/SectionHeading';

const posts = [
  { id: 1, emoji: '🏸', caption: 'Weekend smash session — intense rallies, great vibes!', likes: 124, type: 'session' },
  { id: 2, emoji: '🏆', caption: 'Budget Badminton League champions crowned! Epic tournament.', likes: 248, type: 'tournament' },
  { id: 3, emoji: '⚡', caption: 'Shuttlecock trails and court lights — pure badminton joy.', likes: 189, type: 'highlight' },
  { id: 4, emoji: '🤝', caption: 'New partners joined the RCC family. Welcome aboard!', likes: 156, type: 'community' },
  { id: 5, emoji: '🎯', caption: 'Skill-based doubles pairings creating perfect matches.', likes: 201, type: 'session' },
  { id: 6, emoji: '🌟', caption: 'RCC players pushing limits every single weekend.', likes: 173, type: 'highlight' },
];

export default function SocialHighlights() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#C21818]/8 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Social"
          title="Follow the"
          highlight="Movement"
          subtitle="Stay connected with RCC on Instagram and WhatsApp."
          className="mb-16"
        />

        {/* Social CTA Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16 max-w-2xl mx-auto">
          <motion.a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass rounded-3xl p-8 flex flex-col items-center gap-4 group hover:glow-crimson transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center">
              <InstagramIcon size={28} className="text-white" />
            </div>
            <div className="text-center">
              <div className="text-white font-black text-lg">Follow on Instagram</div>
              <div className="text-white/50 text-sm mt-1">@racquetsclubcommunity</div>
            </div>
            <div className="px-6 py-2 rounded-full bg-gradient-to-r from-[#833AB4] to-[#FD1D1D] text-white text-sm font-bold tracking-wider">
              FOLLOW
            </div>
          </motion.a>

          <motion.a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass rounded-3xl p-8 flex flex-col items-center gap-4 group hover:glow-gold transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
              <MessageCircle size={28} className="text-white" />
            </div>
            <div className="text-center">
              <div className="text-white font-black text-lg">Join WhatsApp</div>
              <div className="text-white/50 text-sm mt-1">Community Group</div>
            </div>
            <div className="px-6 py-2 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-sm font-bold tracking-wider">
              JOIN NOW
            </div>
          </motion.a>
        </div>

        {/* Mock post grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post, i) => (
            <motion.a
              key={post.id}
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-2xl aspect-square flex flex-col items-center justify-center p-6 group hover:glow-gold transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#C21818]/5 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-5xl mb-4">{post.emoji}</div>
              <p className="text-white/60 text-xs text-center leading-relaxed line-clamp-2">{post.caption}</p>
              <div className="mt-3 flex items-center gap-1 text-[#D4AF37]/60 text-xs">
                <span>❤️</span>
                <span>{post.likes}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
