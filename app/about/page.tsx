import Navbar from '@/components/layout/Navbar';
import {
  Shield, Clock, Zap, Users, Trophy, CalendarCheck,
  BadgeCheck, AlertCircle, CreditCard,
  MapPin, ChevronRight, Star,
} from 'lucide-react';

function InstagramIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
    </svg>
  );
}

/* ─── Stat card ─────────────────────────────────────────────────── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 24px' }}>
      <div style={{
        fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
        fontWeight: 900,
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        color: '#D4AF37',
        lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
        fontWeight: 400,
        fontSize: '11px',
        color: 'rgba(255,255,255,0.45)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginTop: '6px',
      }}>
        {label}
      </div>
    </div>
  );
}

/* ─── Section label ─────────────────────────────────────────────── */
function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      <div style={{ width: '28px', height: '2px', background: '#C21818', borderRadius: '1px' }} />
      <span style={{
        fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.3em',
        color: '#D4AF37',
        textTransform: 'uppercase',
      }}>
        {text}
      </span>
    </div>
  );
}

/* ─── Offer card ────────────────────────────────────────────────── */
function OfferCard({
  Icon, title, description, accent = '#D4AF37',
}: {
  Icon: React.ElementType;
  title: string;
  description: string;
  accent?: string;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px',
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: `${accent}18`,
        border: `1px solid ${accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={20} color={accent} />
      </div>
      <div style={{
        fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
        fontWeight: 700,
        fontSize: '15px',
        color: '#ffffff',
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
        fontWeight: 400,
        fontSize: '13px',
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 1.65,
      }}>
        {description}
      </div>
    </div>
  );
}

/* ─── Rule item ─────────────────────────────────────────────────── */
function RuleItem({
  Icon, title, body, accent = '#D4AF37',
}: {
  Icon: React.ElementType;
  title: string;
  body: string;
  accent?: string;
}) {
  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      padding: '20px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: `${accent}15`,
        border: `1px solid ${accent}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '2px',
      }}>
        <Icon size={16} color={accent} />
      </div>
      <div>
        <div style={{
          fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
          fontWeight: 700,
          fontSize: '15px',
          color: '#ffffff',
          marginBottom: '4px',
          lineHeight: 1.3,
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
          fontWeight: 400,
          fontSize: '13px',
          color: 'rgba(255,255,255,0.48)',
          lineHeight: 1.65,
        }}>
          {body}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: '#e8e8ec' }}>
      <Navbar />

      {/* ── Hero ── */}
      <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '72px' }}>
        {/* Background fire glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(194,24,24,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 48px) clamp(50px, 8vw, 80px)',
          textAlign: 'center',
          position: 'relative',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(194,24,24,0.12)',
            border: '1px solid rgba(194,24,24,0.25)',
            borderRadius: '999px',
            padding: '6px 16px',
            marginBottom: '28px',
          }}>
            <MapPin size={12} color="#C21818" />
            <span style={{
              fontFamily: "'Arial', 'Helvetica Neue', sans-serif", fontSize: '11px',
              color: '#C21818', fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              Delhi, India
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(2.4rem, 7vw, 5.5rem)',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: '8px',
          }}>
            RACQUETS CLUB
          </h1>
          <h1 style={{
            fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(2.4rem, 7vw, 5.5rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: '28px',
            background: 'linear-gradient(135deg, #C21818, #D4AF37)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            COMMUNITY
          </h1>

          <p style={{
            fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
            fontSize: 'clamp(14px, 2vw, 17px)',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.75,
            maxWidth: '640px',
            margin: '0 auto 20px',
          }}>
            Delhi&apos;s closed, invite-only badminton community for sincere players,
            from beginners to advanced. We don&apos;t just play the game; we live it.
          </p>

          <p style={{
            fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#D4AF37',
          }}>
            &ldquo;In Delhi, badminton is more than a game. It&apos;s a community.&rdquo;
          </p>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <style>{`
        @media (max-width: 480px) {
          .about-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-stats-grid > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); }
        }
      `}</style>
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div className="about-stats-grid" style={{
          maxWidth: '900px', margin: '0 auto',
          padding: '32px clamp(20px,5vw,48px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0',
        }}>
          {[
            { value: '300+', label: 'Members' },
            { value: '50+',  label: 'Events hosted' },
            { value: '200+', label: 'Weekend sessions' },
            { value: '2022', label: 'Founded' },
          ].map((s, i) => (
            <div key={i} style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <Stat value={s.value} label={s.label} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(20px,5vw,48px)' }}>

        {/* ── What we offer ── */}
        <section style={{ padding: 'clamp(48px,8vw,80px) 0' }}>
          <SectionLabel text="What We Offer" />
          <h2 style={{
            fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
            color: '#ffffff',
            marginBottom: '36px',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}>
            Everything you need to play,<br />
            <span style={{ color: '#D4AF37' }}>nothing you don&apos;t.</span>
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
          }}>
            <OfferCard
              Icon={CalendarCheck}
              title="Regular & Weekend Games"
              description="Structured weekly sessions with consistent scheduling so you never miss a game. Weekend slots fill fast, first come, first served."
              accent="#D4AF37"
            />
            <OfferCard
              Icon={Zap}
              title="Skill-Based Pairings"
              description="We match players by actual ability, not just availability. Every game is competitive, fair, and worth showing up for."
              accent="#C21818"
            />
            <OfferCard
              Icon={MapPin}
              title="Court Booking Handled"
              description="We take care of booking the courts — you just show up and play. No logistics headaches, no scrambles."
              accent="#D4AF37"
            />
            <OfferCard
              Icon={Star}
              title="Shuttles Provided"
              description="Quality shuttles included at every session. The fixed-cost formula keeps it transparent and fair for everyone."
              accent="#C21818"
            />
            <OfferCard
              Icon={Trophy}
              title="Friendly Tournaments"
              description="From internal rivalries to the Budget Badminton League, there's always something to compete for and something to win."
              accent="#D4AF37"
            />
            <OfferCard
              Icon={Users}
              title="Genuine Community"
              description="This isn't a booking platform or a WhatsApp group for spamming. It's a trusted circle of players who show up, respect the game, and each other."
              accent="#C21818"
            />
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* ── Community guidelines ── */}
        <section style={{ padding: 'clamp(48px,8vw,80px) 0' }}>
          <SectionLabel text="Community Guidelines" />
          <h2 style={{
            fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
            color: '#ffffff',
            marginBottom: '8px',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}>
            How we keep the community <span style={{ color: '#D4AF37' }}>strong.</span>
          </h2>
          <p style={{
            fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
            fontSize: '14px',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '36px',
            lineHeight: 1.6,
          }}>
            These aren&apos;t rules for the sake of rules. They&apos;re what keeps RCC worth being part of.
          </p>

          <RuleItem
            Icon={BadgeCheck}
            title="Invite-Only Membership"
            body="RCC is a closed community. Members are vetted and vouched for. This isn't an open forum and is not for selling, spamming, or poaching players into other groups without admin approval."
            accent="#D4AF37"
          />
          <RuleItem
            Icon={Shield}
            title="Respect on and off the Court"
            body="Play hard, stay respectful. Any rivalry, personal discomfort, or history with another member must be disclosed to the admins in advance so we can avoid pairings or overlap."
            accent="#C21818"
          />
          <RuleItem
            Icon={Clock}
            title="Advance Booking & Payment"
            body="All bookings are confirmed against advance payment only. Weekend slots are limited and strictly first-come, first-served. Do not hold a slot without paying."
            accent="#D4AF37"
          />
          <RuleItem
            Icon={AlertCircle}
            title="No Back-Outs"
            body="Backouts are fully payable. If you can't make it, arrange a timely substitute. Advance payments are non-refundable unless a replacement is organized."
            accent="#C21818"
          />
          <RuleItem
            Icon={Users}
            title="No Poaching or Promotion"
            body="Promoting personal services, other groups, or pulling RCC members into outside communities without admin approval is not allowed."
            accent="#D4AF37"
          />
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* ── Pricing ── */}
        <section style={{ padding: 'clamp(48px,8vw,80px) 0' }}>
          <SectionLabel text="Transparent Pricing" />
          <h2 style={{
            fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
            color: '#ffffff',
            marginBottom: '32px',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}>
            Simple. Fair. <span style={{ color: '#D4AF37' }}>No surprises.</span>
          </h2>

          <div style={{
            background: 'rgba(212,175,55,0.06)',
            border: '1px solid rgba(212,175,55,0.18)',
            borderRadius: '20px',
            padding: 'clamp(24px, 4vw, 40px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            {/* Formula */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
                fontSize: '12px',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                Cost per session
              </div>
              <div style={{
                fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
                color: '#D4AF37',
                letterSpacing: '-0.01em',
              }}>
                (Court Fee ÷ Players) + ₹20
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(212,175,55,0.12)' }} />

            {/* Breakdown points */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}>
              {[
                { icon: CreditCard, text: 'Court fee split equally among all players on the day' },
                { icon: Star, text: '₹20 per person covers quality shuttles for the session' },
                { icon: Users, text: 'More players = lower cost per head. Bring your friends.' },
                { icon: BadgeCheck, text: 'All charges are advance only, confirmed on payment' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Icon size={15} color="#D4AF37" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{
                    fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: 1.55,
                  }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* ── Instagram CTA ── */}
        <section style={{ padding: 'clamp(48px,8vw,80px) 0', textAlign: 'center' }}>
          <div style={{
            background: 'rgba(194,24,24,0.07)',
            border: '1px solid rgba(194,24,24,0.18)',
            borderRadius: '24px',
            padding: 'clamp(32px, 6vw, 56px) clamp(24px, 4vw, 48px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'rgba(194,24,24,0.15)',
              border: '1px solid rgba(194,24,24,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <InstagramIcon size={24} color="#C21818" />
            </div>
            <div>
              <h3 style={{
                fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.3rem, 3vw, 2rem)',
                color: '#ffffff',
                marginBottom: '8px',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}>
                Follow us on Instagram
              </h3>
              <p style={{
                fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
                fontSize: '14px',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.6,
                maxWidth: '440px',
              }}>
                Match highlights, community moments, and session updates. See what RCC is about before you apply.
              </p>
            </div>
            <a
              href="https://www.instagram.com/racquetsclubcommunity/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 28px',
                background: 'linear-gradient(135deg, #C21818, #8B0000)',
                borderRadius: '8px',
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 800,
                fontSize: '12px',
                letterSpacing: '0.18em',
                color: '#ffffff',
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              @racquetsclubcommunity
              <ChevronRight size={14} />
            </a>
          </div>
        </section>

      </div>

      {/* ── Footer strip ── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '24px clamp(20px,5vw,48px)',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
          fontSize: '12px',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.1em',
        }}>
          © 2025 Racquets Club Community · Delhi · Invite Only
        </p>
      </div>
    </div>
  );
}
