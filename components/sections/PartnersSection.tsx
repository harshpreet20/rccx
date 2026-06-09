'use client';

/* ─────────────────────────────────────────────────────────────────────────────
   PartnersSection — fetches from public.sponsors Supabase table.
   Manage logos, links and display order from /enter/backend → Partners tab.
───────────────────────────────────────────────────────────────────────────── */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string | null;
  display_order: number;
}

const FALLBACK: Sponsor[] = [
  { id: '1', name: 'Siri Fort Sports Complex', logo_url: null, website_url: '#', tier: 'Venue Partner', display_order: 1 },
  { id: '2', name: 'DDA Vasant Kunj',           logo_url: null, website_url: '#', tier: 'Venue Partner', display_order: 2 },
  { id: '3', name: 'Yonex',                     logo_url: null, website_url: 'https://www.yonex.com', tier: 'Gold Partner', display_order: 3 },
  { id: '4', name: 'Li-Ning',                   logo_url: null, website_url: '#', tier: 'Silver Partner', display_order: 4 },
  { id: '5', name: 'Victor',                    logo_url: null, website_url: '#', tier: 'Silver Partner', display_order: 5 },
  { id: '6', name: 'HotBot Studios',            logo_url: null, website_url: 'https://www.hotbotstudios.com', tier: 'Technology Partner', display_order: 6 },
];

export default function PartnersSection() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(FALLBACK);

  useEffect(() => {
    supabase
      .from('sponsors')
      .select('id, name, logo_url, website_url, tier, display_order')
      .eq('active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => { if (data && data.length > 0) setSponsors(data); });
  }, []);

  const doubled = [...sponsors, ...sponsors];

  return (
    <section style={{
      background: '#080810',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      padding: '32px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)',
      }} />

      <div style={{
        display: 'flex', alignItems: 'center', gap: '32px',
        padding: '0 clamp(16px, 5vw, 80px)', marginBottom: '20px',
      }}>
        <div style={{ width: '28px', height: '1px', background: '#C21818', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>
          OUR PARTNERS
        </span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
      </div>

      <div style={{ overflow: 'hidden', width: '100%' }}>
        <div className="animate-marquee" style={{ display: 'flex', alignItems: 'center', gap: '72px', width: 'max-content' }}>
          {doubled.map((p, i) => {
            const inner = p.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={p.logo_url}
                alt={p.name}
                style={{ height: '72px', maxWidth: '180px', objectFit: 'contain', filter: 'grayscale(1) brightness(0.65)', transition: 'filter 0.3s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0) brightness(1)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(1) brightness(0.65)'; }}
              />
            ) : (
              <span
                style={{
                  fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '13px',
                  letterSpacing: '0.18em', color: 'rgba(255,255,255,0.28)',
                  textTransform: 'uppercase', whiteSpace: 'nowrap',
                  padding: '12px 24px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  transition: 'color 0.3s, border-color 0.3s',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLSpanElement; el.style.color = '#D4AF37'; el.style.borderColor = 'rgba(212,175,55,0.3)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLSpanElement; el.style.color = 'rgba(255,255,255,0.28)'; el.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                {p.name}
              </span>
            );

            const href = p.website_url && p.website_url !== '#' ? p.website_url : null;
            return href ? (
              <a key={`${p.id}-${i}`} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                {inner}
              </a>
            ) : (
              <div key={`${p.id}-${i}`} style={{ display: 'flex', alignItems: 'center' }}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
