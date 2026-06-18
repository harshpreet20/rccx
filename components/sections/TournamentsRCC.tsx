'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RANKINGS = [
  { rank: 1, name: 'Arjun Mehta', wins: 24, matches: 28, rate: '86%', tier: 'champion', move: 0, streak: 'W3' },
  { rank: 2, name: 'Priya Sharma', wins: 21, matches: 26, rate: '81%', tier: 'gold', move: 1, streak: 'W5' },
  { rank: 3, name: 'Rohit Kapoor', wins: 19, matches: 24, rate: '79%', tier: 'gold', move: -1, streak: 'L1' },
  { rank: 4, name: 'Ananya Singh', wins: 16, matches: 22, rate: '73%', tier: 'active', move: 2, streak: 'W2' },
  { rank: 5, name: 'Vikram Bose', wins: 14, matches: 20, rate: '70%', tier: 'active', move: -1, streak: 'W1' },
];

const BRACKET_ROUNDS = [
  { name: 'Quarter-Finals', matches: ['MEHTA v SINGH', 'SHARMA v BOSE', 'KAPOOR v NAIR', 'DEV v IYER'] },
  { name: 'Semi-Finals', matches: ['TBD v TBD', 'TBD v TBD'] },
  { name: 'Final', matches: ['TBD v TBD'] },
];

export default function TournamentsRCC() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const vsCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll('.tournament-reveal');
    if (items) {
      gsap.fromTo(items,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
    }

    // VS card: fighters slide in from opposite corners
    const card = vsCardRef.current;
    if (card) {
      const left = card.querySelector('.fighter-left');
      const right = card.querySelector('.fighter-right');
      const vs = card.querySelector('.vs-mark');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: 'top 75%' },
      });
      tl.fromTo(left, { x: -90, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
      tl.fromTo(right, { x: 90, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '<');
      tl.fromTo(vs, { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.2)' }, '-=0.2');
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'linear-gradient(180deg, #0A1628 0%, #0D1E3A 100%)',
        padding: 'clamp(120px, 14vw, 180px) clamp(24px, 6vw, 80px) clamp(80px, 10vw, 140px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Upward light + speed lines */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: '40%',
        background: 'radial-gradient(ellipse at bottom, rgba(201,168,76,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="speed-lines" style={{ opacity: 0.6 }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="text-label tournament-reveal" style={{ color: 'rgba(201,168,76,0.65)', marginBottom: 16 }}>
            The Arena
          </div>
          <h2 className="text-h2 tournament-reveal" style={{ color: '#F5F0E8', marginBottom: 16 }}>
            Tournaments &amp; Rankings
          </h2>
          <div className="gold-rule tournament-reveal" style={{ maxWidth: 200, margin: '0 auto' }} />
        </div>

        {/* MATCH OF THE WEEK — VS card */}
        <div
          ref={vsCardRef}
          className="tournament-reveal"
          style={{
            background: 'linear-gradient(100deg, rgba(15,32,64,0.95) 0%, rgba(28,12,20,0.92) 50%, rgba(15,32,64,0.95) 100%)',
            border: '1px solid rgba(155,35,53,0.4)',
            borderRadius: 4,
            padding: 'clamp(28px, 4vw, 48px)',
            marginBottom: 40,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 0 60px rgba(155,35,53,0.12)',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(115deg, transparent 0 120px, rgba(155,35,53,0.05) 120px 122px, transparent 122px 300px)',
            pointerEvents: 'none',
          }} />

          <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
            <span style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: '0.35em',
              color: '#9B2335',
              textTransform: 'uppercase',
              border: '1px solid rgba(155,35,53,0.5)',
              padding: '6px 16px',
              borderRadius: 2,
              background: 'rgba(155,35,53,0.1)',
            }}>
              ⚡ Match of the Week
            </span>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(16px, 4vw, 48px)', flexWrap: 'wrap', position: 'relative',
          }}>
            {/* Fighter left */}
            <div className="fighter-left" style={{ textAlign: 'center', flex: '1 1 200px', maxWidth: 300 }}>
              <div style={{
                fontFamily: 'var(--font-anton), Impact, sans-serif',
                fontSize: 'clamp(26px, 4vw, 44px)',
                color: '#F5F0E8',
                letterSpacing: '0.03em',
                lineHeight: 1,
                textTransform: 'uppercase',
              }}>Arjun Mehta</div>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 12, color: '#C9A84C' }}>#1 · 86%</span>
                <span className="streak-badge"><span className="flame">🔥</span>W3</span>
              </div>
            </div>

            {/* VS */}
            <div className="vs-mark" style={{ fontSize: 'clamp(40px, 6vw, 72px)', flexShrink: 0 }}>VS</div>

            {/* Fighter right */}
            <div className="fighter-right" style={{ textAlign: 'center', flex: '1 1 200px', maxWidth: 300 }}>
              <div style={{
                fontFamily: 'var(--font-anton), Impact, sans-serif',
                fontSize: 'clamp(26px, 4vw, 44px)',
                color: '#F5F0E8',
                letterSpacing: '0.03em',
                lineHeight: 1,
                textTransform: 'uppercase',
              }}>Priya Sharma</div>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 12, color: '#C9A84C' }}>#2 · 81%</span>
                <span className="streak-badge"><span className="flame">🔥</span>W5</span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: 28, textAlign: 'center', position: 'relative',
            fontFamily: 'var(--font-dm-mono), monospace', fontSize: 12,
            letterSpacing: '0.12em', color: '#C8BFA8',
          }}>
            HEAD-TO-HEAD 3–2 · COURT 1 · SATURDAY 7:00 AM
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 32,
        }}>
          {/* Rankings board */}
          <div className="glass-panel tournament-reveal" style={{ padding: 32 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 28, paddingBottom: 16,
              borderBottom: '1px solid rgba(201,168,76,0.15)',
            }}>
              <h3 className="text-h3" style={{ fontSize: 18, color: '#F5F0E8' }}>Season Rankings</h3>
              <span style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 10, color: 'rgba(201,168,76,0.6)', letterSpacing: '0.1em' }}>WK 24</span>
            </div>

            {RANKINGS.map((player, i) => (
              <div key={player.rank} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '13px 0',
                borderBottom: i < RANKINGS.length - 1 ? '1px solid rgba(201,168,76,0.08)' : 'none',
              }}>
                <div style={{
                  fontFamily: 'var(--font-anton), Impact, sans-serif',
                  fontSize: i < 3 ? 26 : 18,
                  color: i === 0 ? '#C9A84C' : i < 3 ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.15)',
                  width: 34, textAlign: 'center', flexShrink: 0,
                }}>
                  {player.rank}
                </div>

                {/* Rank movement */}
                <div style={{ width: 28, flexShrink: 0, textAlign: 'center' }}>
                  {player.move > 0 && <span className="rank-up">▲{player.move}</span>}
                  {player.move < 0 && <span className="rank-down">▼{Math.abs(player.move)}</span>}
                  {player.move === 0 && <span className="rank-hold">—</span>}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14,
                    color: '#F5F0E8', textTransform: 'uppercase', letterSpacing: '0.04em',
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3,
                  }}>
                    {player.name}
                    {player.tier === 'champion' && (
                      <span style={{
                        fontSize: 9, padding: '1px 6px',
                        background: 'rgba(201,168,76,0.12)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        borderRadius: 2, color: '#C9A84C', letterSpacing: '0.1em',
                        fontFamily: 'var(--font-head)', fontWeight: 700,
                      }}>CHAMPION</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 11, color: '#C8BFA8' }}>
                    {player.wins}W · {player.matches}M · {player.rate}
                  </div>
                </div>

                {player.streak.startsWith('W') && Number(player.streak.slice(1)) >= 2 ? (
                  <span className="streak-badge"><span className="flame">🔥</span>{player.streak}</span>
                ) : (
                  <span style={{
                    fontFamily: 'var(--font-dm-mono), monospace', fontSize: 10,
                    color: player.streak.startsWith('L') ? '#C75B6B' : 'rgba(200,191,168,0.5)',
                  }}>{player.streak}</span>
                )}
              </div>
            ))}

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <a href="/community" style={{
                fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 11,
                color: 'rgba(201,168,76,0.7)', letterSpacing: '0.18em',
                textDecoration: 'none', textTransform: 'uppercase',
              }}>
                Full Rankings →
              </a>
            </div>
          </div>

          {/* Bracket */}
          <div className="glass-panel tournament-reveal" style={{ padding: 32 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 28, paddingBottom: 16,
              borderBottom: '1px solid rgba(201,168,76,0.15)',
            }}>
              <span style={{ fontSize: 18 }}>🏆</span>
              <h3 className="text-h3" style={{ fontSize: 18, color: '#F5F0E8' }}>Live Bracket</h3>
            </div>

            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
              {BRACKET_ROUNDS.map(round => (
                <div key={round.name} style={{ flex: 1, minWidth: 120 }}>
                  <div style={{
                    fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 9,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'rgba(201,168,76,0.65)', textAlign: 'center', marginBottom: 12,
                  }}>
                    {round.name}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {round.matches.map((match, i) => (
                      <div key={i} style={{
                        background: 'rgba(201,168,76,0.04)',
                        border: '1px solid rgba(201,168,76,0.15)',
                        borderRadius: 2,
                        padding: '9px 10px',
                        fontFamily: 'var(--font-dm-mono), monospace',
                        fontSize: 10,
                        letterSpacing: '0.06em',
                        color: match.includes('TBD') ? 'rgba(200,191,168,0.4)' : '#C8BFA8',
                        textAlign: 'center',
                        animation: round.name === 'Final' ? 'bracket-pulse 3s ease-in-out infinite' : 'none',
                      }}>
                        {match}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <a href="/tournaments" className="btn-ghost" style={{ fontSize: 11, padding: '12px 26px' }}>
                Full Tournament Page
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bracket-pulse {
          0%, 100% { border-color: rgba(201,168,76,0.15); }
          50% { border-color: rgba(201,168,76,0.45); box-shadow: 0 0 12px rgba(201,168,76,0.1); }
        }
      `}</style>
    </section>
  );
}
