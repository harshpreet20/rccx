'use client';

import NavbarRCC from '@/components/layout/NavbarRCC';
import FooterRCC from '@/components/layout/FooterRCC';
import { SoftAurora } from '@/components/ui/SoftAurora';
import { useEffect, useRef } from 'react';

const faqs = [
  {
    q: 'How do I join RCC?',
    a: 'Apply via our website\'s Join page or message us on Instagram. We review applications and reach out within 48 hours.',
  },
  {
    q: 'Can complete beginners join?',
    a: 'Absolutely. Many of our members had never picked up a racket before RCC. Sessions are skill-grouped so you\'ll always be playing at your level.',
  },
  {
    q: 'Can women attend alone?',
    a: 'Yes — and they do, regularly. RCC has dedicated women admins, a women-first policy, and a zero-tolerance culture. Many of our members specifically joined because of this.',
  },
  {
    q: 'Do I need my own racket?',
    a: 'You don\'t need one to start. We can help you borrow one for your first session. We recommend getting your own once you\'ve played a few times.',
  },
  {
    q: 'Is there a fee?',
    a: 'Session costs are shared among attendees via Hudle. There\'s no monthly membership fee — you pay only for the sessions you attend.',
  },
  {
    q: 'How do bookings work?',
    a: 'All bookings are done through Hudle, our official venue partner. Once you\'re in the community, you\'ll get session polls and booking links via WhatsApp.',
  },
  {
    q: 'Can I come to just one session?',
    a: 'Yes. Come to one session, see if you love it. Most people do.',
  },
  {
    q: 'What skill level is required?',
    a: 'None. We welcome complete beginners through to competitive players. Sessions are curated by skill level.',
  },
];

export default function FAQPage() {
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const fadeStyle: React.CSSProperties = {
    opacity: 0,
    transform: 'translateY(32px)',
    transition: 'opacity 0.7s ease, transform 0.7s ease',
  };

  const addRef = (el: HTMLElement | null, i: number) => {
    fadeRefs.current[i] = el;
  };

  return (
    <main style={{ background: '#050810', minHeight: '100vh', paddingTop: 69 }}>
      <NavbarRCC />

      {/* Hero */}
      <section style={{ position: 'relative', padding: '100px 24px 80px', textAlign: 'center', overflow: 'hidden' }}>
        <SoftAurora />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <p
            ref={(el) => addRef(el, 0)}
            style={{
              ...fadeStyle,
              fontFamily: '"DM Mono", monospace',
              fontSize: 13,
              letterSpacing: '0.2em',
              color: '#C9A84C',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            FAQ
          </p>
          <h1
            ref={(el) => addRef(el, 1)}
            style={{
              ...fadeStyle,
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(34px, 5vw, 56px)',
              color: '#F5F0E8',
              lineHeight: 1.15,
            }}
          >
            Questions we get asked.
          </h1>
        </div>
      </section>

      {/* Accordion */}
      <section style={{ padding: '40px 24px 120px', maxWidth: 800, margin: '0 auto' }}>
        <style>{`
          details summary {
            list-style: none;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            font-family: "Montserrat", sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: rgba(245, 240, 232, 0.9);
            transition: color 0.2s;
            user-select: none;
          }
          details summary::-webkit-details-marker { display: none; }
          details[open] summary {
            color: #C9A84C;
          }
          details summary .faq-icon {
            font-size: 22px;
            color: #C9A84C;
            font-weight: 300;
            flex-shrink: 0;
            margin-left: 16px;
            line-height: 1;
          }
          details[open] summary .faq-icon::after { content: '−'; }
          details:not([open]) summary .faq-icon::after { content: '+'; }
          .faq-answer {
            padding: 0 0 20px;
            font-family: "Montserrat", sans-serif;
            font-size: 15px;
            color: rgba(245, 240, 232, 0.65);
            line-height: 1.75;
          }
        `}</style>

        <div
          ref={(el) => addRef(el, 2)}
          style={{
            ...fadeStyle,
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {faqs.map((faq, i) => (
            <details
              key={faq.q}
              style={{
                borderBottom: i < faqs.length - 1 ? '1px solid rgba(201,168,76,0.1)' : 'none',
                padding: '0 24px',
              }}
            >
              <summary>
                {faq.q}
                <span className="faq-icon" />
              </summary>
              <div className="faq-answer">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      <FooterRCC />
    </main>
  );
}
