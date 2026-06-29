'use client';
import { useState, useEffect, useRef } from 'react';
import { SoftAurora } from '@/components/ui/SoftAurora';
import { useCountUp } from '@/lib/useCountUp';

const STATS = {
  Community: [
    { value: 353, suffix: '+', label: 'Community Members', caption: 'Active players across Delhi NCR' },
    { value: 90.9, suffix: '%', label: 'Member Retention Rate', caption: 'More than 9 in 10 members keep playing', isRetention: true },
    { value: 321, suffix: '', label: 'Retained Members', caption: 'Players who came and stayed' },
    { value: 4, suffix: '', label: 'Active Groups', caption: 'Dedicated community groups' },
    { value: 150, suffix: '+', label: 'Weekly Conversations', caption: 'Daily match coordination' },
  ],
  Gameplay: [
    { value: 500, suffix: '+', label: 'Courts Booked', caption: 'Across 11 partner venues' },
    { value: 4500, suffix: '+', label: 'Hours Played', caption: '270,000+ minutes on court' },
    { value: 1000, suffix: '+', label: 'Games Played', caption: 'Every rally counted' },
    { value: 187, suffix: '+', label: 'Active Playing Days', caption: 'Since founding' },
  ],
  Venues: [
    { value: 11, suffix: '', label: 'Partner Venues', caption: 'Across Delhi NCR' },
    { value: 5, suffix: '', label: 'Zones Covered', caption: 'West Delhi and beyond' },
    { value: 500, suffix: '+', label: 'Court Hours Booked', caption: 'Via Hudle' },
  ],
  'Community Impact': [
    { value: 500000, suffix: '+', prefix: '₹', label: 'Invested Into Community', caption: '₹5 Lakhs+ back into badminton' },
    { value: 353, suffix: '+', label: 'Members Served', caption: 'Every session, every booking' },
    { value: 90.9, suffix: '%', label: 'Retention Rate', caption: 'Community that stays together', isRetention: true },
    { value: 269, suffix: '+', label: 'Community Bookings', caption: 'Coordinated sessions' },
  ],
  Ecosystem: [
    { value: 11, suffix: '', label: 'Partner Venues', caption: 'One community, many courts' },
    { value: 353, suffix: '', label: 'Community Members', caption: 'The people behind the movement' },
    { value: 1000, suffix: '+', label: 'Games Played', caption: 'Building players, not just games' },
  ],
};

type TabKey = keyof typeof STATS;
const TABS: TabKey[] = ['Community', 'Gameplay', 'Venues', 'Community Impact', 'Ecosystem'];

interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  caption: string;
  isRetention?: boolean;
}

function RetentionDonut({ percentage = 90.9 }: { percentage?: number }) {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const svgRef = useRef<SVGCircleElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated) {
          setAnimated(true);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animated]);

  const offset = animated
    ? circumference - (percentage / 100) * circumference
    : circumference;

  return (
    <div ref={wrapperRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke="rgba(201,168,76,0.15)"
          strokeWidth="10"
        />
        <circle
          ref={svgRef}
          cx="50" cy="50" r={r}
          fill="none"
          stroke="#C9A84C"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{
            transition: animated ? 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          }}
        />
        <text
          x="50" y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#C9A84C"
          fontSize="14"
          fontWeight="700"
          fontFamily="Anton, sans-serif"
        >
          {percentage}%
        </text>
      </svg>
    </div>
  );
}

interface StatCardProps {
  stat: StatItem;
  index: number;
}

function StatCard({ stat, index }: StatCardProps) {
  const decimals = stat.value % 1 !== 0 ? 1 : 0;
  const [count, ref] = useCountUp(stat.value, decimals);

  return (
    <div
      className="stat-card"
      style={{
        animationDelay: `${index * 80}ms`,
      }}
    >
      {stat.isRetention ? (
        <>
          <RetentionDonut percentage={stat.value} />
          <div className="stat-label">{stat.label}</div>
          <div className="stat-caption">{stat.caption}</div>
        </>
      ) : (
        <>
          <div className="stat-number">
            <span ref={ref as React.RefObject<HTMLSpanElement>}>
              {stat.prefix || ''}{decimals > 0 ? count.toFixed(decimals) : count}{stat.suffix}
            </span>
          </div>
          <div className="stat-label">{stat.label}</div>
          <div className="stat-caption">{stat.caption}</div>
        </>
      )}
    </div>
  );
}

export function RCCByTheNumbers() {
  const [activeTab, setActiveTab] = useState<TabKey>('Community');
  const [visible, setVisible] = useState(true);

  const handleTabChange = (tab: TabKey) => {
    setVisible(false);
    setTimeout(() => {
      setActiveTab(tab);
      setVisible(true);
    }, 150);
  };

  const currentStats = STATS[activeTab];

  return (
    <>
      <style>{`
        .rcc-numbers-section {
          background: #050810;
          position: relative;
          padding: 100px 24px;
          overflow: hidden;
        }
        .rcc-numbers-inner {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }
        .rcc-numbers-eyebrow {
          font-family: 'Anton', sans-serif;
          font-size: clamp(36px, 6vw, 72px);
          color: #F5F0E8;
          text-align: center;
          letter-spacing: 0.04em;
          line-height: 1;
          margin: 0 0 16px;
        }
        .rcc-numbers-subtitle {
          font-size: 16px;
          color: rgba(245,240,232,0.5);
          text-align: center;
          margin: 0 0 48px;
          font-style: italic;
        }
        .rcc-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin-bottom: 48px;
        }
        .rcc-tab {
          padding: 8px 20px;
          border-radius: 999px;
          border: 1px solid rgba(201,168,76,0.3);
          background: transparent;
          color: rgba(245,240,232,0.5);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .rcc-tab:hover {
          border-color: rgba(201,168,76,0.6);
          color: rgba(245,240,232,0.8);
        }
        .rcc-tab.active {
          background: #C9A84C;
          border-color: #C9A84C;
          color: #050810;
          font-weight: 700;
        }
        .rcc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
          transition: opacity 0.3s ease;
        }
        .rcc-grid.hidden {
          opacity: 0;
        }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(201,168,76,0.15);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: transform 0.3s ease, border-color 0.3s ease;
          animation: fadeUp 0.5s ease both;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(201,168,76,0.4);
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .stat-number {
          font-family: 'Anton', sans-serif;
          font-size: 64px;
          color: #C9A84C;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .stat-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #F5F0E8;
          margin-top: 8px;
        }
        .stat-caption {
          font-size: 12px;
          color: rgba(245,240,232,0.5);
          line-height: 1.5;
        }
      `}</style>
      <section className="rcc-numbers-section">
        <SoftAurora />
        <div className="rcc-numbers-inner">
          <h2 className="rcc-numbers-eyebrow">RCC BY THE NUMBERS</h2>
          <p className="rcc-numbers-subtitle">Every rally. Every booking. Every friendship. Measured.</p>

          <div className="rcc-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`rcc-tab${activeTab === tab ? ' active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={`rcc-grid${!visible ? ' hidden' : ''}`}>
            {currentStats.map((stat, i) => (
              <StatCard key={`${activeTab}-${stat.label}`} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
