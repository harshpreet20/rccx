'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RANKINGS = [
  { rank: 1, name: 'Arjun Mehta', wins: 24, matches: 28, rate: '86%', tier: 'champion' },
  { rank: 2, name: 'Priya Sharma', wins: 21, matches: 26, rate: '81%', tier: 'gold' },
  { rank: 3, name: 'Rohit Kapoor', wins: 19, matches: 24, rate: '79%', tier: 'gold' },
  { rank: 4, name: 'Ananya Singh', wins: 16, matches: 22, rate: '73%', tier: 'active' },
  { rank: 5, name: 'Vikram Bose', wins: 14, matches: 20, rate: '70%', tier: 'active' },
];

const BRACKET_ROUNDS = [
  { name: 'Quarter-Finals', matches: ['A1 v B2', 'B1 v A2', 'C1 v D2', 'D1 v C2'] },
  { name: 'Semi-Finals', matches: ['TBD v TBD', 'TBD v TBD'] },
  { name: 'Final', matches: ['TBD v TBD'] },
];

export default function TournamentsRCC() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll('.tournament-reveal');
    if (items) {
      gsap.fromTo(items,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'linear-gradient(180deg, #0A1628 0%, #0D1E3A 100%)',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Upward light source */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '40%',
        background: 'radial-gradient(ellipse at bottom, rgba(201,168,76,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="text-label tournament-reveal" style={{ color: 'rgba(201,168,76,0.6)', marginBottom: 16 }}>
            The Arena
          </div>
          <h2 className="text-h2 tournament-reveal" style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            color: '#F5F0E8',
            marginBottom: 16,
          }}>
            Tournaments & Rankings
          </h2>
          <div className="gold-rule tournament-reveal" style={{ maxWidth: 200, margin: '0 auto' }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 32,
        }}>
          {/* Rankings board */}
          <div className="glass-panel tournament-reveal" style={{ padding: 32 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 28,
              paddingBottom: 16,
              borderBottom: '1px solid rgba(201,168,76,0.15)',
            }}>
              <span style={{ fontSize: 18 }}>★</span>
              <h3 style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 20,
                color: '#F5F0E8',
                letterSpacing: '0.05em',
              }}>
                Season Rankings
              </h3>
            </div>

            {RANKINGS.map((player, i) => (
              <div key={player.rank} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 0',
                borderBottom: i < RANKINGS.length - 1 ? '1px solid rgba(201,168,76,0.08)' : 'none',
                transform: `translateZ(${i < 3 ? (3 - i) * 8 : 0}px)`,
              }}>
                {/* Rank number */}
                <div style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: i < 3 ? 28 : 18,
                  color: i < 3 ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.06)',
                  width: 36,
                  textAlign: 'center',
                  flexShrink: 0,
                  fontWeight: 400,
                }}>
                  {player.rank}
                </div>

                {/* Player info */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: 16,
                    color: '#F5F0E8',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 2,
                  }}>
                    {player.name}
                    {player.tier === 'champion' && (
                      <span style={{
                        fontSize: 10,
                        padding: '1px 6px',
                        background: 'rgba(201,168,76,0.12)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        borderRadius: 2,
                        color: '#C9A84C',
                        letterSpacing: '0.08em',
                        fontFamily: 'var(--font-body)',
                        fontVariant: 'small-caps',
                      }}>Champion</span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-dm-mono), monospace',
                    fontSize: 11,
                    color: '#C8BFA8',
                  }}>
                    {player.wins}W · {player.matches}M · {player.rate}
                  </div>
                </div>

                {/* Stars for top 3 */}
                {i < 3 && (
                  <div style={{ color: '#C9A84C', fontSize: 12 }}>
                    {'★'.repeat(3 - i)}
                  </div>
                )}
              </div>
            ))}

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <a href="/community" style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'rgba(201,168,76,0.6)',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}>
                View Full Rankings →
              </a>
            </div>
          </div>

          {/* Bracket */}
          <div className="glass-panel tournament-reveal" style={{ padding: 32 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 28,
              paddingBottom: 16,
              borderBottom: '1px solid rgba(201,168,76,0.15)',
            }}>
              <span style={{ fontSize: 18 }}>🏆</span>
              <h3 style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 20,
                color: '#F5F0E8',
                letterSpacing: '0.05em',
              }}>
                Live Bracket
              </h3>
            </div>

            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
              {BRACKET_ROUNDS.map(round => (
                <div key={round.name} style={{ flex: 1, minWidth: 110 }}>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(201,168,76,0.6)',
                    textAlign: 'center',
                    marginBottom: 12,
                  }}>
                    {round.name}
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    justifyContent: 'space-around',
                    height: '100%',
                  }}>
                    {round.matches.map((match, i) => (
                      <div key={i} style={{
                        background: 'rgba(201,168,76,0.04)',
                        border: '1px solid rgba(201,168,76,0.15)',
                        borderRadius: 2,
                        padding: '8px 10px',
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
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
              <a href="/tournaments" className="btn-ghost" style={{
                fontSize: 11,
                padding: '10px 24px',
              }}>
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
