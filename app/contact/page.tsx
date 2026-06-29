'use client';

import NavbarRCC from '@/components/layout/NavbarRCC';
import FooterRCC from '@/components/layout/FooterRCC';
import { SoftAurora } from '@/components/ui/SoftAurora';
import { useEffect, useRef, useState } from 'react';

type ContactType = 'general' | 'partner' | 'venue' | 'sponsor' | 'volunteer' | 'media';

const contactTypes: { key: ContactType; label: string }[] = [
  { key: 'general', label: 'General Enquiry' },
  { key: 'partner', label: 'Become a Partner' },
  { key: 'venue', label: 'Venue Collaboration' },
  { key: 'sponsor', label: 'Sponsor RCC' },
  { key: 'volunteer', label: 'Volunteer' },
  { key: 'media', label: 'Media / Press' },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(201,168,76,0.2)',
  borderRadius: 8,
  padding: '14px 16px',
  color: '#F5F0E8',
  fontFamily: '"Montserrat", sans-serif',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: '"Montserrat", sans-serif',
  fontSize: 13,
  fontWeight: 600,
  color: 'rgba(245,240,232,0.7)',
  marginBottom: 8,
  letterSpacing: '0.04em',
};

const partnerTypes = ['Sponsor', 'Venue', 'Food', 'Fitness', 'Equipment', 'Wellness', 'Other'];
const volunteerSkills = ['Photography', 'Management', 'Social Media', 'Coaching'];

function GenericForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div><label style={labelStyle}>Name *</label><input required type="text" name="name" style={inputStyle} /></div>
      <div><label style={labelStyle}>Email *</label><input required type="email" name="email" style={inputStyle} /></div>
      <div><label style={labelStyle}>Message *</label><textarea required name="message" rows={4} style={{ ...inputStyle, resize: 'vertical' }} /></div>
      <SubmitBtn />
    </form>
  );
}

function SubmitBtn() {
  return (
    <button
      type="submit"
      style={{
        background: '#C9A84C',
        color: '#050810',
        fontFamily: '"Montserrat", sans-serif',
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: '0.08em',
        padding: '16px',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        width: '100%',
      }}
    >
      Send Message
    </button>
  );
}

function GeneralForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        <div><label style={labelStyle}>Name *</label><input required type="text" name="name" style={inputStyle} /></div>
        <div><label style={labelStyle}>Email *</label><input required type="email" name="email" style={inputStyle} /></div>
      </div>
      <div><label style={labelStyle}>Phone</label><input type="tel" name="phone" style={inputStyle} /></div>
      <div><label style={labelStyle}>Message *</label><textarea required name="message" rows={4} style={{ ...inputStyle, resize: 'vertical' }} /></div>
      <SubmitBtn />
    </form>
  );
}

function PartnerForm({ onSubmit }: { onSubmit: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (v: string) => setSelected((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        <div><label style={labelStyle}>Company *</label><input required type="text" name="company" style={inputStyle} /></div>
        <div><label style={labelStyle}>Brand</label><input type="text" name="brand" style={inputStyle} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        <div><label style={labelStyle}>Contact Person *</label><input required type="text" name="contact" style={inputStyle} /></div>
        <div><label style={labelStyle}>Email *</label><input required type="email" name="email" style={inputStyle} /></div>
      </div>
      <div>
        <label style={labelStyle}>Type of Partnership</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {partnerTypes.map((pt) => (
            <label key={pt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: '"Montserrat", sans-serif', fontSize: 14, color: 'rgba(245,240,232,0.7)' }}>
              <input type="checkbox" checked={selected.includes(pt)} onChange={() => toggle(pt)} style={{ accentColor: '#C9A84C' }} />
              {pt}
            </label>
          ))}
        </div>
      </div>
      <div><label style={labelStyle}>Message</label><textarea name="message" rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
      <SubmitBtn />
    </form>
  );
}

function VenueForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        <div><label style={labelStyle}>Venue Name *</label><input required type="text" name="venueName" style={inputStyle} /></div>
        <div><label style={labelStyle}>Number of Courts</label><input type="number" name="courts" min={1} style={inputStyle} /></div>
      </div>
      <div><label style={labelStyle}>Address *</label><input required type="text" name="address" style={inputStyle} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        <div><label style={labelStyle}>Surface Type</label><input type="text" name="surface" style={inputStyle} placeholder="e.g. Synthetic, Wooden" /></div>
        <div><label style={labelStyle}>Available Times</label><input type="text" name="availableTimes" style={inputStyle} placeholder="e.g. 6am–10pm" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        <div><label style={labelStyle}>Contact *</label><input required type="text" name="contact" style={inputStyle} /></div>
        <div><label style={labelStyle}>Google Maps Link</label><input type="url" name="mapsLink" style={inputStyle} placeholder="https://maps.google.com/…" /></div>
      </div>
      <SubmitBtn />
    </form>
  );
}

function VolunteerForm({ onSubmit }: { onSubmit: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (v: string) => setSelected((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        <div><label style={labelStyle}>Name *</label><input required type="text" name="name" style={inputStyle} /></div>
        <div><label style={labelStyle}>Email *</label><input required type="email" name="email" style={inputStyle} /></div>
      </div>
      <div>
        <label style={labelStyle}>Skills</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {volunteerSkills.map((sk) => (
            <label key={sk} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: '"Montserrat", sans-serif', fontSize: 14, color: 'rgba(245,240,232,0.7)' }}>
              <input type="checkbox" checked={selected.includes(sk)} onChange={() => toggle(sk)} style={{ accentColor: '#C9A84C' }} />
              {sk}
            </label>
          ))}
        </div>
      </div>
      <div><label style={labelStyle}>Availability</label><input type="text" name="availability" style={inputStyle} placeholder="e.g. Weekends, evenings" /></div>
      <SubmitBtn />
    </form>
  );
}

export default function ContactPage() {
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeType, setActiveType] = useState<ContactType>('general');
  const [submitted, setSubmitted] = useState(false);

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

  const handleSuccess = () => setSubmitted(true);

  const renderForm = () => {
    if (submitted) {
      return (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, color: '#F5F0E8', marginBottom: 12 }}>
            Message received.
          </h3>
          <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 15, color: 'rgba(245,240,232,0.6)' }}>
            We'll be in touch soon.
          </p>
        </div>
      );
    }
    switch (activeType) {
      case 'general': return <GeneralForm onSubmit={handleSuccess} />;
      case 'partner': return <PartnerForm onSubmit={handleSuccess} />;
      case 'venue': return <VenueForm onSubmit={handleSuccess} />;
      case 'volunteer': return <VolunteerForm onSubmit={handleSuccess} />;
      default: return <GenericForm onSubmit={handleSuccess} />;
    }
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
            Contact
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
            Let's talk.
          </h1>
        </div>
      </section>

      {/* Contact Type Selector */}
      <section style={{ padding: '0 24px 60px', maxWidth: 900, margin: '0 auto' }}>
        <div
          ref={(el) => addRef(el, 2)}
          style={{
            ...fadeStyle,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
            marginBottom: 48,
          }}
        >
          {contactTypes.map((ct) => (
            <button
              key={ct.key}
              onClick={() => { setActiveType(ct.key); setSubmitted(false); }}
              style={{
                padding: '10px 20px',
                borderRadius: 6,
                border: activeType === ct.key ? '1px solid #C9A84C' : '1px solid rgba(201,168,76,0.2)',
                background: activeType === ct.key ? '#C9A84C' : 'transparent',
                color: activeType === ct.key ? '#050810' : 'rgba(245,240,232,0.65)',
                fontFamily: '"Montserrat", sans-serif',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {ct.label}
            </button>
          ))}
        </div>

        {/* Form Panel */}
        <div
          ref={(el) => addRef(el, 3)}
          style={{
            ...fadeStyle,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 16,
            padding: 'clamp(32px, 6vw, 52px)',
            maxWidth: 740,
            margin: '0 auto',
          }}
        >
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, color: '#F5F0E8', marginBottom: 32 }}>
            {contactTypes.find((c) => c.key === activeType)?.label}
          </h2>
          {renderForm()}
        </div>
      </section>

      <FooterRCC />
    </main>
  );
}
