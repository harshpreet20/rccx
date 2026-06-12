import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Privacy Policy | Racquets Club Community',
  description: 'How RCC collects, uses, and protects your personal data.',
};

const LAST_UPDATED = 'June 2026';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#050810', minHeight: '100vh', paddingTop: 80 }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(212,175,55,0.06) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: 'clamp(48px,6vw,96px) clamp(20px,8vw,160px)',
        }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: 20, padding: '4px 14px', marginBottom: 20,
              fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11,
              letterSpacing: '0.14em', color: '#D4AF37', textTransform: 'uppercase',
            }}>
              Legal
            </div>
            <h1 style={{
              fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(28px,4vw,48px)',
              color: '#fff', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 16,
            }}>
              Privacy Policy
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, lineHeight: 1.6 }}>
              Last updated: {LAST_UPDATED}. This policy explains how Racquets Club Community (&quot;RCC&quot;, &quot;we&quot;, &quot;our&quot;) collects, uses, and protects your personal information when you register for, participate in, or interact with our events, platform, and services.
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(40px,5vw,80px) clamp(20px,8vw,160px)' }}>
          <Section title="1. Information We Collect">
            <p>When you register for RCC events, apply for membership, or interact with our platform, we collect the following categories of information:</p>
            <SubSection heading="Personal Information">
              <ul>
                <li>Full name, email address, and phone number</li>
                <li>Date of birth and gender</li>
                <li>City, area/neighbourhood of residence</li>
                <li>Occupation and employer</li>
                <li>Instagram handle and other social media identifiers (where voluntarily provided)</li>
                <li>Emergency contact details</li>
              </ul>
            </SubSection>
            <SubSection heading="Athletic &amp; Player Profile Data">
              <ul>
                <li>Skill level and years of playing experience</li>
                <li>Preferred playing hand and racket brand</li>
                <li>Play frequency and franchise/community affiliation</li>
                <li>Match results, ELO ratings, and tournament participation records</li>
              </ul>
            </SubSection>
            <SubSection heading="Technical Information">
              <ul>
                <li>Device and browser information when you use our website</li>
                <li>Chat interactions with our AI assistant</li>
                <li>Newsletter subscription records</li>
                <li>Form submissions and event registrations</li>
              </ul>
            </SubSection>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use collected data to:</p>
            <ul>
              <li>Register and manage your membership and event participation</li>
              <li>Communicate event announcements, schedule updates, and important notices</li>
              <li>Compile leaderboards, player spotlights, and community statistics</li>
              <li>Improve our platform, events, and community experience</li>
              <li>Comply with legal and regulatory obligations</li>
              <li>Share relevant data with brand partners and sponsors, as described below</li>
            </ul>
          </Section>

          <Section title="3. Data Sharing with Brand Partners and Sponsors">
            <div style={{
              background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)',
              borderRadius: 10, padding: '16px 20px', marginBottom: 20,
            }}>
              <p style={{ color: '#D4AF37', fontWeight: 600, marginBottom: 8 }}>Important: Sponsor Data Sharing</p>
              <p>By registering for any RCC event or becoming an RCC member, you acknowledge that RCC may share your data with our official brand partners and sponsors for purposes including marketing, talent scouting, sponsorship communications, and partnership activations.</p>
            </div>
            <SubSection heading="What may be shared">
              <ul>
                <li>Name, skill level, city, franchise affiliation, and athletic profile with brand partners for talent identification and co-marketing</li>
                <li>Anonymised aggregate statistics (e.g., skill distribution, city demographics) for sponsorship reporting</li>
                <li>Identified data only where you have explicitly granted &quot;sponsor share consent&quot; during registration</li>
              </ul>
            </SubSection>
            <SubSection heading="Who we share with">
              <p>Our brand partners are companies that sponsor RCC tournaments and events. A current list of active sponsors is available at rccdelhi.com/partners. We do not sell your data to third parties unaffiliated with our events.</p>
            </SubSection>
            <SubSection heading="Your choices">
              <p>During registration, you may opt out of identified sponsor data sharing by setting your &quot;sponsor share consent&quot; preference to No. You can update this preference at any time by contacting us at <a href="mailto:rcc@rccdelhi.com" style={{ color: '#D4AF37', textDecoration: 'none' }}>rcc@rccdelhi.com</a>.</p>
            </SubSection>
          </Section>

          <Section title="4. Data Storage and Security">
            <p>Your data is stored securely on Supabase infrastructure, which is hosted on AWS and complies with industry-standard security practices including:</p>
            <ul>
              <li>Encryption at rest and in transit (TLS 1.2+)</li>
              <li>Row-level security (RLS) policies restricting data access</li>
              <li>Access limited to authorised RCC administrators only</li>
              <li>Regular security audits and access reviews</li>
            </ul>
            <p>While we implement appropriate technical measures, no system is completely secure. If you become aware of any security concern, please contact us immediately.</p>
          </Section>

          <Section title="5. Data Retention">
            <p>We retain your personal data for as long as you remain a member of the RCC community, or as long as necessary to fulfil the purposes described in this policy. If you request deletion of your account, we will remove your personally identifiable information within 30 days, except where retention is required by law or for legitimate dispute resolution purposes.</p>
          </Section>

          <Section title="6. Your Rights">
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong>Correction</strong> — request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion</strong> — request deletion of your data (subject to legal obligations)</li>
              <li><strong>Opt-out of sponsor sharing</strong> — withdraw consent for identified data sharing with sponsors at any time</li>
              <li><strong>Data portability</strong> — request your data in a machine-readable format</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:rcc@rccdelhi.com" style={{ color: '#D4AF37', textDecoration: 'none' }}>rcc@rccdelhi.com</a>.</p>
          </Section>

          <Section title="7. Cookies and Tracking">
            <p>Our website uses essential cookies for authentication and session management. We do not currently use advertising or tracking cookies. Analytics, if any, are used solely to improve our platform and are not shared with third parties for advertising purposes.</p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>RCC events and membership are intended for individuals aged 16 and above. We do not knowingly collect personal data from minors under 16. If you believe we have inadvertently collected such data, please contact us for prompt removal.</p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>We may update this privacy policy from time to time to reflect changes in our practices or applicable law. We will notify active members of material changes via email or prominent notice on our website. Your continued participation in RCC events following any update constitutes acceptance of the revised policy.</p>
          </Section>

          <Section title="10. Contact Us">
            <p>For any questions, concerns, or requests related to this privacy policy:</p>
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, padding: '20px 24px', marginTop: 16,
            }}>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>Racquets Club Community</p>
              <p>Email: <a href="mailto:rcc@rccdelhi.com" style={{ color: '#D4AF37', textDecoration: 'none' }}>rcc@rccdelhi.com</a></p>
              <p>Phone: <a href="tel:+919876543210" style={{ color: '#D4AF37', textDecoration: 'none' }}>+91 98765 43210</a></p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 8 }}>New Delhi, India</p>
            </div>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{
        fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 18,
        color: '#fff', letterSpacing: '0.04em', marginBottom: 16,
        paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        {title}
      </h2>
      <div style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>
        {children}
      </div>
    </section>
  );
}

function SubSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 20, marginBottom: 16 }}>
      <h3 style={{
        fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 13,
        color: 'rgba(255,255,255,0.8)', letterSpacing: '0.06em', marginBottom: 10,
      }}>
        {heading}
      </h3>
      <div style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}
