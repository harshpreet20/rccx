'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

const sponsors = [
  { name: 'Racquets Club Community', category: 'Title Partner' },
  { name: 'SUM India', category: 'Community Partner' },
  { name: 'Soul Stretch', category: 'Wellness Partner' },
  { name: 'Portronics', category: 'Equipment Partner' },
];

const duplicated = [...sponsors, ...sponsors, ...sponsors];

export default function SponsorStrip() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050810] via-[#0A0E1A] to-[#050810]" />

      <div className="relative max-w-7xl mx-auto mb-16">
        <SectionHeading
          eyebrow="Partners"
          title="Our"
          highlight="Partners"
          subtitle="Brands and communities aligned with sports culture and meaningful human connection."
        />
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden mb-16">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050810] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050810] to-transparent z-10" />
        <div className="flex animate-marquee">
          {duplicated.map((sponsor, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-8 glass rounded-2xl px-8 py-6 text-center min-w-[200px] group hover:glow-gold transition-all duration-500"
            >
              <div className="text-white font-black text-lg group-hover:text-[#D4AF37] transition-colors">{sponsor.name}</div>
              <div className="text-white/40 text-xs tracking-widest mt-1 uppercase">{sponsor.category}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/sponsors"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-[#050810] font-black tracking-widest text-sm rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300"
        >
          BECOME A PARTNER
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
