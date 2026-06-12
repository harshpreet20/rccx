'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail, ExternalLink } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlowButton from '@/components/ui/GlowButton';
import { SOCIAL_LINKS } from '@/lib/utils';

const tiers = [
  {
    tier: 'Title Partner',
    color: '#D4AF37',
    description: 'The primary face of RCC events and community.',
    sponsors: [{ name: 'Racquets Club Community', tagline: 'Badminton Culture', icon: '🏸' }],
  },
  {
    tier: 'Community Partner',
    color: '#C21818',
    description: 'Organizations fostering sports culture in Delhi.',
    sponsors: [{ name: 'SUM India', tagline: 'Sports & Wellness', icon: '🌐' }],
  },
  {
    tier: 'Wellness Partner',
    color: '#D9FF00',
    description: 'Brands supporting player wellness and recovery.',
    sponsors: [{ name: 'Soul Stretch', tagline: 'Stretch. Recover. Grow.', icon: '🧘' }],
  },
  {
    tier: 'Equipment Partner',
    color: '#0B1F3A',
    borderColor: '#D4AF37',
    description: 'Suppliers of premium badminton equipment.',
    sponsors: [{ name: 'Portronics', tagline: 'Smart Accessories', icon: '📱' }],
  },
];

const benefits = [
  { icon: '🏆', title: 'Tournament Branding', desc: 'Prominent placement at all RCC tournaments and events.' },
  { icon: '📱', title: 'Social Media Reach', desc: 'Feature across RCC Instagram and WhatsApp community.' },
  { icon: '🤝', title: 'Community Access', desc: 'Direct engagement with 150+ passionate badminton players.' },
  { icon: '🌐', title: 'Network Growth', desc: 'Connect with Delhi\'s growing sports culture network.' },
  { icon: '📸', title: 'Content Creation', desc: 'Co-branded content from events and sessions.' },
  { icon: '⭐', title: 'Premium Placement', desc: 'Featured in RCC website, media, and communications.' },
];

export default function SponsorsPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-[#D4AF37]/8 to-transparent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.5em] font-bold uppercase">Partners</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
          >
            Sponsors &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#C21818]">
              Partners
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-xl leading-relaxed max-w-3xl mx-auto"
          >
            RCC collaborates not only with brands, but also with communities, wellness initiatives,
            and organizations aligned with sports culture and meaningful human connection.
          </motion.p>
        </div>
      </section>

      {/* Partner Tiers */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {tiers.map((tier, ti) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: ti * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-white/5" />
                <h2
                  className="text-sm font-black tracking-[0.4em] uppercase px-4"
                  style={{ color: tier.color }}
                >
                  {tier.tier}
                </h2>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              <p className="text-white/40 text-sm text-center mb-8">{tier.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {tier.sponsors.map((sponsor, i) => (
                  <motion.div
                    key={sponsor.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="glass rounded-3xl p-8 text-center group relative overflow-hidden"
                    style={{
                      border: `1px solid ${tier.color}20`,
                      boxShadow: `0 0 40px ${tier.color}08`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                      style={{ background: `radial-gradient(circle at center, ${tier.color}10, transparent)` }}
                    />
                    <div className="relative">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {sponsor.icon}
                      </div>
                      <h3 className="text-xl font-black text-white mb-2">{sponsor.name}</h3>
                      <p className="text-white/40 text-sm tracking-wider">{sponsor.tagline}</p>
                      <div
                        className="h-0.5 w-0 group-hover:w-full mx-auto mt-4 transition-all duration-700 rounded-full"
                        style={{ background: `linear-gradient(to right, ${tier.color}, transparent)` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 bg-[#0A0E1A]">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Why Partner"
            title="Partnership"
            highlight="Benefits"
            subtitle="Reach Delhi's most engaged badminton community with meaningful brand placement."
            className="mb-16"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-6 group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{b.icon}</div>
                <h3 className="text-white font-black mb-2">{b.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-gold rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-[#C21818]/5" />
            <div className="relative">
              <div className="text-5xl mb-6">🤝</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Partner With{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#C21818]">
                  RCC
                </span>
              </h2>
              <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
                Align your brand with Delhi's most passionate badminton community.
                Reach 150+ active players and a growing network.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <GlowButton href="/contact" variant="gold" size="lg">
                  <Mail size={18} />
                  GET IN TOUCH
                </GlowButton>
                <GlowButton
                  href={SOCIAL_LINKS.whatsapp}
                  variant="outline"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WHATSAPP US
                  <ArrowRight size={16} />
                </GlowButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
