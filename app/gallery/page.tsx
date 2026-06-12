'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Play } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

const categories = ['All', 'Tournaments', 'Sessions', 'Community', 'Court Aesthetics', 'Highlights'];

const galleryItems = [
  { id: 1, emoji: '🏆', title: 'Budget Badminton League Finals', category: 'Tournaments', type: 'image', span: 'col-span-2 row-span-2' },
  { id: 2, emoji: '🏸', title: 'Weekend Rally Session', category: 'Sessions', type: 'image', span: '' },
  { id: 3, emoji: '⚡', title: 'Champion Match Moment', category: 'Tournaments', type: 'image', span: '' },
  { id: 4, emoji: '🌙', title: 'Mixed Doubles Night', category: 'Sessions', type: 'image', span: 'row-span-2' },
  { id: 5, emoji: '🎯', title: 'Precision Smash', category: 'Highlights', type: 'image', span: '' },
  { id: 6, emoji: '🤝', title: 'Community Bonding', category: 'Community', type: 'image', span: '' },
  { id: 7, emoji: '🏟️', title: 'Court at Siri Fort', category: 'Court Aesthetics', type: 'image', span: 'col-span-2' },
  { id: 8, emoji: '🎬', title: 'Tournament Highlights Reel', category: 'Highlights', type: 'video', span: '' },
  { id: 9, emoji: '👥', title: 'Team Photo', category: 'Community', type: 'image', span: '' },
  { id: 10, emoji: '💫', title: 'Match Day Energy', category: 'Highlights', type: 'image', span: '' },
  { id: 11, emoji: '🌅', title: 'Morning Court Setup', category: 'Court Aesthetics', type: 'image', span: '' },
  { id: 12, emoji: '🥇', title: 'Award Ceremony', category: 'Tournaments', type: 'image', span: 'col-span-2' },
];

const colors = [
  'from-[#C21818]/30 to-[#8B0000]/30',
  'from-[#0B1F3A]/60 to-[#162B50]/60',
  'from-[#D4AF37]/20 to-[#B8960C]/20',
  'from-[#C21818]/20 to-[#D4AF37]/20',
  'from-[#0B1F3A]/40 to-[#C21818]/20',
  'from-[#D4AF37]/15 to-transparent',
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);

  const filtered = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-[#D4AF37]/8 to-transparent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.5em] font-bold uppercase">Media</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
          >
            The RCC{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#C21818]">
              Gallery
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-xl"
          >
            Moments from the court. Stories from the community.
          </motion.p>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#C21818] to-[#D4AF37] text-white shadow-[0_0_20px_rgba(194,24,24,0.4)]'
                    : 'glass text-white/60 hover:text-white'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]"
          >
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setSelectedItem(item)}
                  className={`${item.span} glass rounded-2xl overflow-hidden cursor-pointer group relative`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors[i % colors.length]}`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
                    <div className="text-center px-4">
                      <div className="text-xs text-[#D4AF37] tracking-widest uppercase font-bold">{item.category}</div>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#050810]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                    {item.type === 'video' ? (
                      <Play size={32} className="text-white" />
                    ) : (
                      <ZoomIn size={32} className="text-white" />
                    )}
                    <p className="text-white text-sm font-bold text-center leading-tight">{item.title}</p>
                  </div>

                  {item.type === 'video' && (
                    <div className="absolute top-3 right-3 bg-[#C21818] rounded-full p-1">
                      <Play size={12} className="text-white fill-current" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#050810]/95 backdrop-blur-xl"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-3xl p-12 max-w-2xl w-full text-center relative"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-10 h-10 glass rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="text-8xl mb-6">{selectedItem.emoji}</div>
              <span className="text-[#D4AF37] text-xs tracking-widest uppercase font-bold">{selectedItem.category}</span>
              <h3 className="text-2xl font-black text-white mt-2">{selectedItem.title}</h3>
              <p className="text-white/50 mt-4 text-sm">
                {selectedItem.type === 'video' ? 'Video content coming soon.' : 'Photo from the RCC gallery.'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
