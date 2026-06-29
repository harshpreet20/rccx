'use client';

import { useEffect, useRef } from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Join RCC',
    desc: 'Apply via our website or WhatsApp',
  },
  {
    number: '02',
    title: 'Find Players',
    desc: 'Get matched by skill level and availability',
  },
  {
    number: '03',
    title: 'Book via Hudle',
    desc: 'Secure your court through our Hudle partnership',
  },
  {
    number: '04',
    title: 'Play',
    desc: 'Show up. Rally. Compete.',
  },
  {
    number: '05',
    title: 'Make Friends',
    desc: 'The community extends beyond badminton',
  },
  {
    number: '06',
    title: 'Become Part of RCC',
    desc: "You're not just a member. You're RCC.",
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>('.step-card');
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(32px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observers: IntersectionObserver[] = [];

    cards.forEach((card, i) => {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 60);
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(card);
      observers.push(obs);
    });

    const headerItems = section.querySelectorAll<HTMLElement>('.header-item');
    headerItems.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    });

    const headerObs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          headerItems.forEach((el, i) => {
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, i * 100);
          });
          headerObs.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (section) headerObs.observe(section);

    return () => {
      observers.forEach(o => o.disconnect());
      headerObs.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{
        background: 'transparent',
        position: 'relative',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 120px)',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,500&family=Montserrat:wght@300;400;600;700&family=DM+Mono:wght@400;500&display=swap');

        @media (min-width: 768px) {
          .timeline-step:nth-child(odd) .step-card-wrapper {
            padding-left: calc(50% + 40px);
            padding-right: 0;
          }
          .timeline-step:nth-child(even) .step-card-wrapper {
            padding-right: calc(50% + 40px);
            padding-left: 0;
            text-align: right;
          }
          .timeline-step:nth-child(even) .step-dot {
            left: auto !important;
            right: calc(50% - 6px);
          }
          .timeline-step:nth-child(odd) .step-dot {
            left: calc(50% - 6px);
          }
          .timeline-step:nth-child(even) .step-number {
            right: calc(50% + 48px) !important;
            left: auto !important;
            text-align: right;
          }
          .timeline-step:nth-child(odd) .step-number {
            left: calc(50% + 48px);
          }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ marginBottom: 80 }}>
          <div className="header-item" style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: 24,
          }}>
            The RCC Experience
          </div>
          <h2 className="header-item" style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(36px, 5vw, 56px)',
            color: '#ffffff',
            lineHeight: 1.15,
            maxWidth: 580,
          }}>
            From first rally to lifelong community.
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>

          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 1,
            background: 'linear-gradient(180deg, transparent 0%, rgba(201,168,76,0.5) 15%, rgba(201,168,76,0.3) 85%, transparent 100%)',
            transform: 'translateX(-50%)',
            display: 'none',
          }}
          className="timeline-line"
          />

          <style>{`
            @media (min-width: 768px) {
              .timeline-line { display: block !important; }
            }
          `}</style>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className="timeline-step"
                style={{
                  position: 'relative',
                  paddingBottom: i < STEPS.length - 1 ? 48 : 0,
                }}
              >
                {/* Dot on line */}
                <div className="step-dot" style={{
                  position: 'absolute',
                  top: 32,
                  left: 0,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#C9A84C',
                  border: '3px solid rgba(201,168,76,0.25)',
                  zIndex: 2,
                  boxShadow: '0 0 12px rgba(201,168,76,0.4)',
                }} />

                {/* Ghost number */}
                <div className="step-number" style={{
                  position: 'absolute',
                  top: -16,
                  left: 24,
                  fontFamily: '"Anton", "Impact", sans-serif',
                  fontSize: 80,
                  color: 'rgba(201,168,76,0.08)',
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}>
                  {step.number}
                </div>

                {/* Card wrapper */}
                <div className="step-card-wrapper" style={{ paddingLeft: 32 }}>
                  <div className="step-card" style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(201,168,76,0.12)',
                    borderRadius: 16,
                    padding: 32,
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: 420,
                  }}>
                    <div style={{
                      fontFamily: '"DM Mono", monospace',
                      fontSize: 11,
                      color: 'rgba(201,168,76,0.5)',
                      letterSpacing: '0.12em',
                      marginBottom: 10,
                    }}>
                      Step {step.number}
                    </div>
                    <div style={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: 20,
                      fontWeight: 600,
                      color: '#ffffff',
                      marginBottom: 10,
                      letterSpacing: '0.01em',
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: 15,
                      fontWeight: 300,
                      color: 'rgba(255,255,255,0.45)',
                      lineHeight: 1.6,
                    }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
