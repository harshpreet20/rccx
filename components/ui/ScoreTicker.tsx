'use client';

const TICKER_ITEMS = [
  { kind: 'result', text: 'MEHTA def. KAPOOR 21-15 / 21-18' },
  { kind: 'streak', text: 'SHARMA ON A 5-MATCH WIN STREAK' },
  { kind: 'event', text: 'THE RCC OPEN — DELHI · JULY 2025 · 500+ PLAYERS' },
  { kind: 'result', text: 'BOSE/NAIR def. DEV/IYER 21-19 / 19-21 / 21-14' },
  { kind: 'rank', text: 'SINGH CLIMBS TO #4 ▲2' },
  { kind: 'result', text: 'SHARMA def. SINGH 21-12 / 21-16' },
  { kind: 'event', text: 'SATURDAY LEAGUE R5 — COURTS 1-4 · 6:00 AM' },
  { kind: 'rank', text: 'KAPOOR HOLDS #3 — 79% WIN RATE' },
];

const KIND_COLOR: Record<string, string> = {
  result: '#F5F0E8',
  streak: '#E8853D',
  event: '#C9A84C',
  rank: '#4ADE80',
};

function TickerRun() {
  return (
    <>
      {TICKER_ITEMS.map((item, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: 11,
            letterSpacing: '0.12em',
            color: KIND_COLOR[item.kind],
            padding: '0 28px',
          }}>
            {item.kind === 'streak' && <span className="flame" style={{ marginRight: 6 }}>🔥</span>}
            {item.text}
          </span>
          <span style={{ color: 'rgba(201,168,76,0.35)', fontSize: 10 }}>◆</span>
        </span>
      ))}
    </>
  );
}

export default function ScoreTicker() {
  return (
    <div style={{
      position: 'relative',
      zIndex: 5,
      background: 'rgba(6,14,28,0.96)',
      borderTop: '1px solid rgba(201,168,76,0.15)',
      borderBottom: '1px solid rgba(201,168,76,0.15)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      height: 38,
    }}>
      {/* LIVE tag */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 18px',
        height: '100%',
        background: 'rgba(155,35,53,0.18)',
        borderRight: '1px solid rgba(201,168,76,0.2)',
        zIndex: 2,
      }}>
        <span className="live-dot" />
        <span style={{
          fontFamily: 'var(--font-head)',
          fontWeight: 800,
          fontSize: 10,
          letterSpacing: '0.28em',
          color: '#F5F0E8',
        }}>LIVE</span>
      </div>

      {/* Marquee */}
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div className="ticker-track">
          <TickerRun />
          <TickerRun />
        </div>
      </div>
    </div>
  );
}
