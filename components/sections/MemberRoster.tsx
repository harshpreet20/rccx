'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MEMBERS = [
  { name: 'Arjun Mehta', role: 'Committee Member', level: 'Champion', matches: 28, wins: 24, rate: '86%', tier: 'champion', initial: 'AM' },
  { name: 'Priya Sharma', role: 'Gold Member', level: 'Advanced', matches: 26, wins: 21, rate: '81%', tier: 'gold', initial: 'PS' },
  { name: 'Rohit Kapoor', role: 'Founding Member', level: 'Advanced', matches: 24, wins: 19, rate: '79%', tier: 'founding', initial: 'RK' },
  { name: 'Ananya Singh', role: 'Active Member', level: 'Intermediate', matches: 22, wins: 16, rate: '73%', tier: 'active', initial: 'AS' },
  { name: 'Vikram Bose', role: 'Active Member', level: 'Intermediate', matches: 20, wins: 14, rate: '70%', tier: 'active', initial: 'VB' },
  { name: 'Sneha Nair', role: 'Gold Member', level: 'Advanced', matches: 18, wins: 13, rate: '72%', tier: 'gold', initial: 'SN' },
];

const TIER_STYLES: Record<string, { badge: string; badgeColor: string; badgeBg: string; borderColor: string }> = {
  champion: { badge: '★ Champion', badgeColor: '#C9A84C', badgeBg: 'rgba(201,168,76,0.12)', borderColor: 'rgba(201,168,76,0.35)' },
  gold:     { badge: '⭐ Gold Member', badgeColor: '#E2C97E', badgeBg: 'rgba(226,201,126,0.08)', borderColor: 'rgba(201,168,76,0.2)' },
  founding: { badge: '🌿 Founding', badgeColor: '#9B2335', badgeBg: 'rgba(155,35,53,0.08)', borderColor: 'rgba(155,35,53,0.2)' },
  active:   { badge: '◎ Active', badgeColor: '#C8BFA8', badgeBg: 'rgba(200,191,168,0.06)', borderColor: 'rgba(200,191,168,0.12)' },
};

export default function MemberRoster() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.member-card');
    if (cards) {
      cards.forEach((card, i) => {
        // 3D tilt on hover
        const el = card as HTMLElement;
        const onEnter = (e: Event) => {
          const me = e as MouseEvent;
          const rect = el.getBoundingClientRect();
          const x = (me.clientX - rect.left) / rect.width - 0.5;
          const y = (me.clientY - rect.top) / rect.height - 0.5;
          gsap.to(el, {
            rotateY: x * 8,
            rotateX: -y * 8,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 1000,
          });
        };
        const onLeave = () => {
          gsap.to(el, {
            rotateY: 0, rotateX: 0, scale: 1,
            duration: 0.5, ease: 'power2.out',
          });
        };
        el.addEventListener('mousemove', onEnter as EventListener);
        el.addEventListener('mouseleave', onLeave);
      });

      gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          stagger: 0.1,
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
        background: 'linear-gradient(180deg, #0D1E3A 0%, #0A1628 100%)',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="text-label" style={{ color: 'rgba(201,168,76,0.6)', marginBottom: 16 }}>
            The Roster
          </div>
          <h2 className="text-h2" style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            color: '#F5F0E8',
            marginBottom: 16,
          }}>
            Our Members
          </h2>
          <div className="gold-rule" style={{ maxWidth: 200, margin: '0 auto 12px' }} />
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: '#C8BFA8',
            fontWeight: 300,
          }}>
            A curated directory of 300+ distinguished players
          </p>
        </div>

        {/* Member grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 24,
          marginBottom: 48,
        }}>
          {MEMBERS.map(member => {
            const style = TIER_STYLES[member.tier];
            return (
              <div
                key={member.name}
                className="member-card"
                style={{
                  background: 'rgba(15,32,64,0.7)',
                  border: `1px solid ${style.borderColor}`,
                  borderRadius: 4,
                  padding: 28,
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'rgba(201,168,76,0.08)',
                  border: `1px solid ${style.borderColor}`,
                  boxShadow: `0 0 0 4px rgba(201,168,76,0.04), 0 0 0 6px ${style.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 24,
                  color: '#C9A84C',
                  fontWeight: 600,
                }}>
                  {member.initial}
                </div>

                {/* Name */}
                <div style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 20,
                  color: '#F5F0E8',
                  textAlign: 'center',
                  marginBottom: 6,
                  fontWeight: 500,
                }}>
                  {member.name}
                </div>

                {/* Role */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: 16,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    padding: '2px 8px',
                    background: style.badgeBg,
                    border: `1px solid ${style.borderColor}`,
                    borderRadius: 2,
                    color: style.badgeColor,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}>
                    {style.badge}
                  </span>
                </div>

                {/* Stats */}
                <div style={{
                  borderTop: '1px solid rgba(201,168,76,0.08)',
                  paddingTop: 16,
                  display: 'flex',
                  justifyContent: 'space-around',
                }}>
                  {[
                    { label: 'Matches', value: member.matches },
                    { label: 'Wins', value: member.wins },
                    { label: 'Rate', value: member.rate },
                  ].map(stat => (
                    <div key={stat.label} style={{ textAlign: 'center' }}>
                      <div style={{
                        fontFamily: 'var(--font-dm-mono), monospace',
                        fontSize: 18,
                        color: '#E2C97E',
                        fontWeight: 400,
                        marginBottom: 2,
                      }}>
                        {stat.value}
                      </div>
                      <div className="text-label" style={{ fontSize: 9 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <a href="/community" className="btn-ghost">
            View Full Directory
          </a>
        </div>
      </div>
    </section>
  );
}
