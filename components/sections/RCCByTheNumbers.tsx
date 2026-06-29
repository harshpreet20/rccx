'use client';

import { useState } from 'react';

const STATS = {
  Community: [
    { display: '353+', label: 'Community Members', caption: 'Active players across Delhi NCR' },
    { display: '90.9%', label: 'Member Retention Rate', caption: 'More than 9 in 10 members keep playing' },
    { display: '321', label: 'Retained Members', caption: 'Players who came and stayed' },
    { display: '4', label: 'Active Groups', caption: 'Dedicated community groups' },
    { display: '150+', label: 'Weekly Conversations', caption: 'Daily match coordination' },
  ],
  Gameplay: [
    { display: '500+', label: 'Courts Booked', caption: 'Across 11 partner venues' },
    { display: '4,500+', label: 'Hours Played', caption: '270,000+ minutes on court' },
    { display: '1,000+', label: 'Games Played', caption: 'Every rally counted' },
    { display: '187+', label: 'Active Playing Days', caption: 'Since founding' },
  ],
  Venues: [
    { display: '11', label: 'Partner Venues', caption: 'Across Delhi NCR' },
    { display: '5', label: 'Zones Covered', caption: 'West Delhi and beyond' },
    { display: '500+', label: 'Court Hours Booked', caption: 'Via Hudle' },
  ],
  'Community Impact': [
    { display: '₹5L+', label: 'Invested Into Community', caption: '₹5 Lakhs+ back into badminton' },
    { display: '353+', label: 'Members Served', caption: 'Every session, every booking' },
    { display: '90.9%', label: 'Retention Rate', caption: 'Community that stays together' },
    { display: '269+', label: 'Community Bookings', caption: 'Coordinated sessions' },
  ],
  Ecosystem: [
    { display: '11', label: 'Partner Venues', caption: 'One community, many courts' },
    { display: '353', label: 'Community Members', caption: 'The people behind the movement' },
    { display: '1,000+', label: 'Games Played', caption: 'Building players, not just games' },
  ],
};

type TabKey = keyof typeof STATS;
const TABS: TabKey[] = ['Community', 'Gameplay', 'Venues', 'Community Impact', 'Ecosystem'];

export default function RCCByTheNumbers() {
  const [activeTab, setActiveTab] = useState<TabKey>('Community');

  return (
    <>
      <style>{`
        .rcc-tab { padding: 8px 20px; border-radius: 999px; border: 1px solid rgba(201,168,76,0.3); background: transparent; color: rgba(245,240,232,0.5); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .rcc-tab:hover { border-color: rgba(201,168,76,0.6); color: rgba(245,240,232,0.8); }
        .rcc-tab.active { background: #C9A84C; border-color: #C9A84C; color: #050810; font-weight: 700; }
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(201,168,76,0.15); border-radius: 16px; padding: 32px; display: flex; flex-direction: column; gap: 8px; transition: transform 0.25s ease, border-color 0.25s ease; }
        .stat-card:hover { transform: translateY(-4px); border-color: rgba(201,168,76,0.4); }
      `}</style>
      <section style={{ background: '#050810', position: 'relative', padding: 'clamp(72px, 10vw, 120px) clamp(24px, 6vw, 80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.25em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>
            By The Numbers
          </div>
          <h2 style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(36px, 6vw, 72px)', color: '#F5F0E8', textAlign: 'center', letterSpacing: '0.04em', lineHeight: 1, margin: '0 0 16px' }}>
            RCC BY THE NUMBERS
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(245,240,232,0.45)', textAlign: 'center', margin: '0 0 48px', fontStyle: 'italic', fontFamily: 'var(--font-montserrat)' }}>
            Every rally. Every booking. Every friendship. Measured.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 48 }}>
            {TABS.map((tab) => (
              <button key={tab} className={`rcc-tab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {STATS[activeTab].map((stat) => (
              <div key={stat.label} className="stat-card">
                <div style={{ fontFamily: 'var(--font-anton)', fontSize: 64, color: '#C9A84C', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {stat.display}
                </div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#F5F0E8', marginTop: 8 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(245,240,232,0.5)', lineHeight: 1.5, fontFamily: 'var(--font-montserrat)' }}>
                  {stat.caption}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
