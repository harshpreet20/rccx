'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Plus, Trash2, Save, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────

interface Partner {
  id: string;
  name: string;
  fee: number;
  pairsPerPartner: number;
  confirmedPlayers: number;
}

interface OneTimeCost {
  id: string;
  label: string;
  amount: number;
  deletable: boolean;
}

interface PerDayCost {
  id: string;
  label: string;
  amount: number;
}

interface TournamentState {
  eventName: string;
  eventDays: number;
  targetEarnings: number;
  brandPartners: Partner[];
  communityPartners: Partner[];
  playerFee: number;
  sponsorship: {
    paidSponsor: { enabled: boolean; name: string; amount: number };
    barterShuttle: { enabled: boolean; name: string; value: number };
  };
  vendorStalls: { count: number; feePerStall: number };
  sundowner: {
    enabled: boolean;
    generalTicketPrice: number;
    generalAttendees: number;
    vipEnabled: boolean;
    vipTicketPrice: number;
    vipAttendees: number;
  };
  costs: {
    oneTime: OneTimeCost[];
    perDay: PerDayCost[];
    contingencyPct: number;
  };
}

// ── Default State ──────────────────────────────────────────────────────────

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const defaultState: TournamentState = {
  eventName: 'New Tournament',
  eventDays: 2,
  targetEarnings: 150000,
  brandPartners: [{ id: '1', name: 'Brand Partner 1', fee: 150000, pairsPerPartner: 3, confirmedPlayers: 6 }],
  communityPartners: [{ id: '2', name: 'Community Partner 1', fee: 40000, pairsPerPartner: 1, confirmedPlayers: 2 }],
  playerFee: 1000,
  sponsorship: {
    paidSponsor: { enabled: false, name: '', amount: 0 },
    barterShuttle: { enabled: false, name: '', value: 0 },
  },
  vendorStalls: { count: 0, feePerStall: 5000 },
  sundowner: { enabled: false, generalTicketPrice: 500, generalAttendees: 50, vipEnabled: false, vipTicketPrice: 1500, vipAttendees: 10 },
  costs: {
    oneTime: [
      { id: 'printables', label: 'Printables & Branding', amount: 15000, deletable: true },
      { id: 'prizes', label: 'Prize Pool', amount: 45000, deletable: false },
      { id: 'mgmtFee', label: 'Management Fee', amount: 50000, deletable: false },
    ],
    perDay: [
      { id: 'courts', label: 'Court Booking', amount: 20000 },
      { id: 'catering', label: 'Catering', amount: 15000 },
      { id: 'photography', label: 'Photography', amount: 8000 },
    ],
    contingencyPct: 8,
  },
};

// ── Compute Metrics ────────────────────────────────────────────────────────

function computeMetrics(s: TournamentState) {
  const brandRev = s.brandPartners.reduce((a, p) => a + p.fee, 0);
  const commRev = s.communityPartners.reduce((a, p) => a + p.fee, 0);
  const totalPlayers = s.brandPartners.reduce((a, p) => a + p.confirmedPlayers, 0) + s.communityPartners.reduce((a, p) => a + p.confirmedPlayers, 0);
  const playerFeeRev = totalPlayers * Math.min(s.playerFee, 1000);
  const regFeeRev = (s.brandPartners.length + s.communityPartners.length) * 5000;
  const sponsorRev = s.sponsorship.paidSponsor.enabled ? s.sponsorship.paidSponsor.amount : 0;
  const barterVal = s.sponsorship.barterShuttle.enabled ? s.sponsorship.barterShuttle.value : 0;
  const vendorRev = s.vendorStalls.count * s.vendorStalls.feePerStall;
  const sd = s.sundowner;
  const sundownerRev = sd.enabled ? sd.generalTicketPrice * sd.generalAttendees + (sd.vipEnabled ? sd.vipTicketPrice * sd.vipAttendees : 0) : 0;
  const totalRevenue = brandRev + commRev + playerFeeRev + regFeeRev + sponsorRev + barterVal + vendorRev + sundownerRev;
  const perDaySub = s.costs.perDay.reduce((a, c) => a + c.amount, 0) * s.eventDays;
  const oneTimeSub = s.costs.oneTime.reduce((a, c) => a + c.amount, 0);
  const preConting = perDaySub + oneTimeSub;
  const contingAmt = preConting * (s.costs.contingencyPct / 100);
  const totalCosts = preConting + contingAmt;
  const grossSurplus = totalRevenue - totalCosts;
  const prizePool = s.costs.oneTime.find(c => c.id === 'prizes')?.amount ?? 45000;
  const mgmtFee = s.costs.oneTime.find(c => c.id === 'mgmtFee')?.amount ?? 50000;
  const rrcEarnings = mgmtFee + grossSurplus;
  return { brandRev, commRev, playerFeeRev, regFeeRev, sponsorRev, barterVal, vendorRev, sundownerRev, totalRevenue, perDaySub, oneTimeSub, contingAmt, totalCosts, grossSurplus, prizePool, mgmtFee, rrcEarnings, totalPlayers };
}

function fmt(n: number): string {
  if (isNaN(n)) return '₹0';
  const abs = Math.abs(Math.round(n));
  const s = abs.toString();
  let r = '';
  if (s.length <= 3) r = s;
  else {
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    const g: string[] = [];
    for (let i = rest.length; i > 0; i -= 2) g.unshift(rest.slice(Math.max(0, i - 2), i));
    r = g.join(',') + ',' + last3;
  }
  return (n < 0 ? '-₹' : '₹') + r;
}

// ── Shared input styles ─────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none',
  boxSizing: 'border-box', fontFamily: 'var(--font-inter)', transition: 'border-color 0.15s',
};

function SInput({ value, onChange, type = 'text', placeholder }: {
  value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={inp}
      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.45)')}
      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
    />
  );
}

function SLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, letterSpacing: '0.13em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 6 }}>{children}</div>;
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px', marginBottom: 12, ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ flex: 1 }}>{children}</span>
      <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.07)' }} />
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!on)} style={{
      position: 'relative', width: 38, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer', flexShrink: 0,
      background: on ? '#C21818' : 'rgba(255,255,255,0.1)', transition: 'background 0.2s',
    }}>
      <span style={{
        position: 'absolute', top: 2, width: 16, height: 16, background: '#fff', borderRadius: '50%',
        transition: 'left 0.2s', left: on ? 20 : 2,
      }} />
    </button>
  );
}

function PartnerCard({ partner, onChange, onDelete }: { partner: Partner; onChange: (p: Partner) => void; onDelete: () => void }) {
  const maxPlayers = partner.pairsPerPartner * 2;
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px', marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input type="text" value={partner.name} placeholder="Partner name"
          onChange={e => onChange({ ...partner, name: e.target.value })}
          style={{ ...inp, flex: 1 }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.45)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
        <button type="button" onClick={onDelete} style={{
          width: 34, height: 34, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)',
          background: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
          onMouseOver={e => { e.currentTarget.style.color = '#C21818'; e.currentTarget.style.borderColor = 'rgba(194,24,24,0.3)'; }}
          onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        >
          <Trash2 size={12} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div><SLabel>Fee</SLabel><SInput type="number" value={partner.fee} onChange={v => onChange({ ...partner, fee: Number(v) })} /></div>
        <div><SLabel>Pairs</SLabel><SInput type="number" value={partner.pairsPerPartner} onChange={v => onChange({ ...partner, pairsPerPartner: Number(v), confirmedPlayers: Math.min(partner.confirmedPlayers, Number(v) * 2) })} /></div>
      </div>
      <div style={{ marginTop: 8 }}>
        <SLabel>Confirmed Players (max {maxPlayers})</SLabel>
        <SInput type="number" value={partner.confirmedPlayers} onChange={v => onChange({ ...partner, confirmedPlayers: Math.min(Number(v), maxPlayers) })} />
      </div>
      <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
        {partner.pairsPerPartner} pair{partner.pairsPerPartner !== 1 ? 's' : ''} · {partner.confirmedPlayers}/{maxPlayers} confirmed
      </div>
    </div>
  );
}

function AddBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} style={{
      width: '100%', padding: '9px', borderRadius: 8, border: '1px dashed rgba(255,255,255,0.15)',
      background: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 11,
      fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s',
    }}
      onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; e.currentTarget.style.color = '#D4AF37'; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
    >
      <Plus size={12} />{children}
    </button>
  );
}

function MetaRow({ label, value, color, bold }: { label: string; value: string; color?: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{label}</span>
      <span style={{ color: color ?? (bold ? '#fff' : 'rgba(255,255,255,0.7)'), fontWeight: bold ? 700 : 500, fontSize: 13, fontFamily: bold ? 'var(--font-montserrat)' : undefined }}>{value}</span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function TournamentPlannerPage() {
  const params = useParams();
  const id = params.id as string;

  const [state, setState] = useState<TournamentState>(defaultState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('rcc_tournament_configs').select('*').eq('id', id).single();
      if (data) {
        const cfg = data.config as Partial<TournamentState>;
        if (cfg && Object.keys(cfg).length > 0) {
          setState({ ...defaultState, ...cfg, eventName: data.config_name });
        } else {
          setState(s => ({ ...s, eventName: data.config_name }));
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function update(updater: (s: TournamentState) => TournamentState) {
    setState(updater);
    setDirty(true);
  }

  const m = computeMetrics(state);
  const meetsTarget = m.rrcEarnings >= state.targetEarnings;
  const progressPct = Math.min(Math.max((m.rrcEarnings / (state.targetEarnings || 1)) * 100, 0), 100);

  const updateBP = useCallback((id: string, p: Partner) => update(s => ({ ...s, brandPartners: s.brandPartners.map(x => x.id === id ? p : x) })), []);
  const deleteBP = useCallback((id: string) => update(s => ({ ...s, brandPartners: s.brandPartners.filter(x => x.id !== id) })), []);
  const addBP = useCallback(() => update(s => ({ ...s, brandPartners: [...s.brandPartners, { id: newId(), name: `Brand Partner ${s.brandPartners.length + 1}`, fee: 150000, pairsPerPartner: 3, confirmedPlayers: 6 }] })), []);
  const updateCP = useCallback((id: string, p: Partner) => update(s => ({ ...s, communityPartners: s.communityPartners.map(x => x.id === id ? p : x) })), []);
  const deleteCP = useCallback((id: string) => update(s => ({ ...s, communityPartners: s.communityPartners.filter(x => x.id !== id) })), []);
  const addCP = useCallback(() => update(s => ({ ...s, communityPartners: [...s.communityPartners, { id: newId(), name: `Community Partner ${s.communityPartners.length + 1}`, fee: 40000, pairsPerPartner: 1, confirmedPlayers: 2 }] })), []);

  async function handleSave() {
    setSaving(true);
    setSaveError('');
    try {
      const { error } = await supabase.from('rcc_tournament_configs').update({
        config_name: state.eventName,
        config: state as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'rgba(255,255,255,0.3)' }} />
      </div>
    );
  }

  return (
    <div>
      {/* ── Sticky top bar ── */}
      <div style={{
        position: 'sticky', top: 56, zIndex: 30,
        background: 'rgba(5,8,16,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        margin: '-28px -24px 28px', padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      }}>
        <Link href="/admin/tournament" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 12, marginRight: 4 }}>
          <ArrowLeft size={14} /> Back
        </Link>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />

        {/* Editable name */}
        <input type="text" value={state.eventName}
          onChange={e => update(s => ({ ...s, eventName: e.target.value }))}
          style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 15, letterSpacing: '0.06em', minWidth: 120 }}
        />

        <div style={{ flex: 1 }} />

        {/* Metric chips */}
        {[
          { label: 'Revenue', value: fmt(m.totalRevenue), color: '#4ade80' },
          { label: 'Costs', value: fmt(m.totalCosts), color: '#f87171' },
          { label: 'Earnings', value: fmt(m.rrcEarnings), color: meetsTarget ? '#D4AF37' : '#f87171' },
        ].map(chip => (
          <div key={chip.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '6px 14px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{chip.label}</span>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 14, color: chip.color }}>{chip.value}</span>
          </div>
        ))}

        {/* Save */}
        <button onClick={handleSave} disabled={saving} style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px',
          background: saved ? 'rgba(74,222,128,0.15)' : 'linear-gradient(135deg, #C21818, #8B0000)',
          border: saved ? '1px solid rgba(74,222,128,0.3)' : 'none',
          borderRadius: 9, color: saved ? '#4ade80' : '#fff', cursor: saving ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          boxShadow: saved ? 'none' : '0 4px 16px rgba(194,24,24,0.3)', opacity: saving ? 0.7 : 1,
          whiteSpace: 'nowrap',
        }}>
          {saved ? <><CheckCircle size={13} /> Saved</> : saving ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : <><Save size={13} />{dirty ? 'Save *' : 'Save'}</>}
        </button>
      </div>

      {saveError && <div style={{ background: 'rgba(194,24,24,0.1)', border: '1px solid rgba(194,24,24,0.25)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 16 }}>{saveError}</div>}

      {/* ── Two-column layout ── */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* ── LEFT: inputs ── */}
        <div style={{ flex: '0 0 42%', minWidth: 0 }}>

          {/* Event Settings */}
          <Card>
            <SectionTitle>Event Settings</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <SLabel>Event Name</SLabel>
                <SInput value={state.eventName} onChange={v => update(s => ({ ...s, eventName: v }))} />
              </div>
              <div>
                <SLabel>Target Earnings (₹)</SLabel>
                <SInput type="number" value={state.targetEarnings} onChange={v => update(s => ({ ...s, targetEarnings: Number(v) }))} />
              </div>
              <div>
                <SLabel>Player Fee (max ₹1,000)</SLabel>
                <SInput type="number" value={state.playerFee} onChange={v => update(s => ({ ...s, playerFee: Math.min(Number(v), 1000) }))} />
              </div>
            </div>
            <SLabel>Duration</SLabel>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3].map(d => (
                <button key={d} type="button" onClick={() => update(s => ({ ...s, eventDays: d }))} style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12,
                  fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.15s',
                  background: state.eventDays === d ? 'linear-gradient(135deg, #C21818, #8B0000)' : 'rgba(255,255,255,0.05)',
                  color: state.eventDays === d ? '#fff' : 'rgba(255,255,255,0.4)',
                  boxShadow: state.eventDays === d ? '0 4px 12px rgba(194,24,24,0.3)' : 'none',
                }}>
                  {d} Day{d > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </Card>

          {/* Brand Partners */}
          <Card>
            <SectionTitle>Brand Partners ({state.brandPartners.length})</SectionTitle>
            {state.brandPartners.map(p => (
              <PartnerCard key={p.id} partner={p} onChange={u => updateBP(p.id, u)} onDelete={() => deleteBP(p.id)} />
            ))}
            <AddBtn onClick={addBP}>Add Brand Partner</AddBtn>
          </Card>

          {/* Community Partners */}
          <Card>
            <SectionTitle>Community Partners ({state.communityPartners.length})</SectionTitle>
            {state.communityPartners.map(p => (
              <PartnerCard key={p.id} partner={p} onChange={u => updateCP(p.id, u)} onDelete={() => deleteCP(p.id)} />
            ))}
            <AddBtn onClick={addCP}>Add Community Partner</AddBtn>
          </Card>

          {/* Sponsorship */}
          <Card>
            <SectionTitle>Sponsorship</SectionTitle>
            {/* Paid Sponsor */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: state.sponsorship.paidSponsor.enabled ? 12 : 0 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600 }}>Paid Sponsor</span>
              <Toggle on={state.sponsorship.paidSponsor.enabled} onChange={v => update(s => ({ ...s, sponsorship: { ...s.sponsorship, paidSponsor: { ...s.sponsorship.paidSponsor, enabled: v } } }))} />
            </div>
            {state.sponsorship.paidSponsor.enabled && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingLeft: 10, borderLeft: '2px solid rgba(194,24,24,0.3)', marginBottom: 14 }}>
                <div><SLabel>Name</SLabel><SInput value={state.sponsorship.paidSponsor.name} onChange={v => update(s => ({ ...s, sponsorship: { ...s.sponsorship, paidSponsor: { ...s.sponsorship.paidSponsor, name: v } } }))} /></div>
                <div><SLabel>Amount</SLabel><SInput type="number" value={state.sponsorship.paidSponsor.amount} onChange={v => update(s => ({ ...s, sponsorship: { ...s.sponsorship, paidSponsor: { ...s.sponsorship.paidSponsor, amount: Number(v) } } }))} /></div>
              </div>
            )}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: state.sponsorship.barterShuttle.enabled ? 12 : 0 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600 }}>Barter Shuttle Sponsor</span>
              <Toggle on={state.sponsorship.barterShuttle.enabled} onChange={v => update(s => ({ ...s, sponsorship: { ...s.sponsorship, barterShuttle: { ...s.sponsorship.barterShuttle, enabled: v } } }))} />
            </div>
            {state.sponsorship.barterShuttle.enabled && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingLeft: 10, borderLeft: '2px solid rgba(212,175,55,0.3)' }}>
                <div><SLabel>Name</SLabel><SInput value={state.sponsorship.barterShuttle.name} onChange={v => update(s => ({ ...s, sponsorship: { ...s.sponsorship, barterShuttle: { ...s.sponsorship.barterShuttle, name: v } } }))} /></div>
                <div><SLabel>Barter Value</SLabel><SInput type="number" value={state.sponsorship.barterShuttle.value} onChange={v => update(s => ({ ...s, sponsorship: { ...s.sponsorship, barterShuttle: { ...s.sponsorship.barterShuttle, value: Number(v) } } }))} /></div>
              </div>
            )}
          </Card>

          {/* Vendors & Sundowner */}
          <Card>
            <SectionTitle>Vendors & Sundowner</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              <div><SLabel>Vendor Stalls</SLabel><SInput type="number" value={state.vendorStalls.count} onChange={v => update(s => ({ ...s, vendorStalls: { ...s.vendorStalls, count: Number(v) } }))} /></div>
              <div><SLabel>Fee per Stall</SLabel><SInput type="number" value={state.vendorStalls.feePerStall} onChange={v => update(s => ({ ...s, vendorStalls: { ...s.vendorStalls, feePerStall: Number(v) } }))} /></div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: state.sundowner.enabled ? 12 : 0 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600 }}>Sundowner Event</span>
              <Toggle on={state.sundowner.enabled} onChange={v => update(s => ({ ...s, sundowner: { ...s.sundowner, enabled: v } }))} />
            </div>
            {state.sundowner.enabled && (
              <div style={{ paddingLeft: 10, borderLeft: '2px solid rgba(217,255,0,0.2)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div><SLabel>Ticket Price</SLabel><SInput type="number" value={state.sundowner.generalTicketPrice} onChange={v => update(s => ({ ...s, sundowner: { ...s.sundowner, generalTicketPrice: Number(v) } }))} /></div>
                  <div><SLabel>Attendees</SLabel><SInput type="number" value={state.sundowner.generalAttendees} onChange={v => update(s => ({ ...s, sundowner: { ...s.sundowner, generalAttendees: Number(v) } }))} /></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: state.sundowner.vipEnabled ? 10 : 0 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>VIP Tickets</span>
                  <Toggle on={state.sundowner.vipEnabled} onChange={v => update(s => ({ ...s, sundowner: { ...s.sundowner, vipEnabled: v } }))} />
                </div>
                {state.sundowner.vipEnabled && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div><SLabel>VIP Price</SLabel><SInput type="number" value={state.sundowner.vipTicketPrice} onChange={v => update(s => ({ ...s, sundowner: { ...s.sundowner, vipTicketPrice: Number(v) } }))} /></div>
                    <div><SLabel>VIP Attendees</SLabel><SInput type="number" value={state.sundowner.vipAttendees} onChange={v => update(s => ({ ...s, sundowner: { ...s.sundowner, vipAttendees: Number(v) } }))} /></div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Costs */}
          <Card>
            <SectionTitle>One-Time Costs</SectionTitle>
            {state.costs.oneTime.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input type="text" value={item.label} onChange={e => update(s => ({ ...s, costs: { ...s.costs, oneTime: s.costs.oneTime.map(c => c.id === item.id ? { ...c, label: e.target.value } : c) } }))}
                  style={{ ...inp, flex: 2 }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.45)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <input type="number" value={item.amount} onChange={e => update(s => ({ ...s, costs: { ...s.costs, oneTime: s.costs.oneTime.map(c => c.id === item.id ? { ...c, amount: Number(e.target.value) } : c) } }))}
                  style={{ ...inp, flex: 1, minWidth: 0 }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.45)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                {item.deletable ? (
                  <button type="button" onClick={() => update(s => ({ ...s, costs: { ...s.costs, oneTime: s.costs.oneTime.filter(c => c.id !== item.id) } }))}
                    style={{ width: 34, height: 34, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    onMouseOver={e => { e.currentTarget.style.color = '#C21818'; e.currentTarget.style.borderColor = 'rgba(194,24,24,0.3)'; }}
                    onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  ><Trash2 size={12} /></button>
                ) : <div style={{ width: 34, flexShrink: 0 }} />}
              </div>
            ))}
            <AddBtn onClick={() => update(s => ({ ...s, costs: { ...s.costs, oneTime: [...s.costs.oneTime, { id: newId(), label: 'New Cost', amount: 0, deletable: true }] } }))}>Add Cost</AddBtn>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 16, paddingTop: 16 }}>
              <SectionTitle>Per-Day Costs (×{state.eventDays})</SectionTitle>
              {state.costs.perDay.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input type="text" value={item.label} onChange={e => update(s => ({ ...s, costs: { ...s.costs, perDay: s.costs.perDay.map(c => c.id === item.id ? { ...c, label: e.target.value } : c) } }))}
                    style={{ ...inp, flex: 2 }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.45)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                  <input type="number" value={item.amount} onChange={e => update(s => ({ ...s, costs: { ...s.costs, perDay: s.costs.perDay.map(c => c.id === item.id ? { ...c, amount: Number(e.target.value) } : c) } }))}
                    style={{ ...inp, flex: 1, minWidth: 0 }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.45)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                  <button type="button" onClick={() => update(s => ({ ...s, costs: { ...s.costs, perDay: s.costs.perDay.filter(c => c.id !== item.id) } }))}
                    style={{ width: 34, height: 34, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    onMouseOver={e => { e.currentTarget.style.color = '#C21818'; e.currentTarget.style.borderColor = 'rgba(194,24,24,0.3)'; }}
                    onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  ><Trash2 size={12} /></button>
                </div>
              ))}
              <AddBtn onClick={() => update(s => ({ ...s, costs: { ...s.costs, perDay: [...s.costs.perDay, { id: newId(), label: 'New Per-Day Cost', amount: 0 }] } }))}>Add Per-Day Cost</AddBtn>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 16, paddingTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <SLabel>Contingency Buffer</SLabel>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 14, color: '#fff' }}>{state.costs.contingencyPct}%</span>
              </div>
              <input type="range" min={0} max={25} step={1} value={state.costs.contingencyPct}
                onChange={e => update(s => ({ ...s, costs: { ...s.costs, contingencyPct: Number(e.target.value) } }))}
                style={{ width: '100%', accentColor: '#C21818' }}
              />
            </div>
          </Card>
        </div>

        {/* ── RIGHT: live results ── */}
        <div style={{ flex: 1, minWidth: 0, position: 'sticky', top: 112, maxHeight: 'calc(100vh - 130px)', overflowY: 'auto', paddingRight: 4 }}>

          {/* Target progress */}
          <Card style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Target Progress</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 16, color: meetsTarget ? '#D4AF37' : '#f87171' }}>{Math.round(progressPct)}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ height: '100%', borderRadius: 3, transition: 'width 0.4s', width: `${progressPct}%`, background: meetsTarget ? 'linear-gradient(90deg, #D4AF37, #F0CC55)' : 'linear-gradient(90deg, #C21818, #ff4444)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>₹0</span>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>{fmt(state.targetEarnings)}</span>
            </div>
          </Card>

          {/* Revenue */}
          <Card style={{ marginBottom: 12 }}>
            <SectionTitle>Revenue Breakdown</SectionTitle>
            <MetaRow label="Brand Partnerships" value={fmt(m.brandRev)} />
            <MetaRow label="Community Partnerships" value={fmt(m.commRev)} />
            <MetaRow label={`Player Fees (${m.totalPlayers} players)`} value={fmt(m.playerFeeRev)} />
            <MetaRow label="Registration Fees" value={fmt(m.regFeeRev)} />
            {m.sponsorRev > 0 && <MetaRow label="Paid Sponsor" value={fmt(m.sponsorRev)} />}
            {m.barterVal > 0 && <MetaRow label="Barter Value" value={fmt(m.barterVal)} />}
            {m.vendorRev > 0 && <MetaRow label={`Vendor Stalls (${state.vendorStalls.count})`} value={fmt(m.vendorRev)} />}
            {m.sundownerRev > 0 && <MetaRow label="Sundowner" value={fmt(m.sundownerRev)} />}
            <div style={{ marginTop: 8, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total Revenue</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 18, color: '#4ade80' }}>{fmt(m.totalRevenue)}</span>
            </div>
          </Card>

          {/* Costs */}
          <Card style={{ marginBottom: 12 }}>
            <SectionTitle>Cost Breakdown</SectionTitle>
            {state.costs.oneTime.map(item => <MetaRow key={item.id} label={item.label} value={fmt(item.amount)} />)}
            {state.costs.perDay.map(item => <MetaRow key={item.id} label={`${item.label} ×${state.eventDays}`} value={fmt(item.amount * state.eventDays)} />)}
            <MetaRow label={`Contingency (${state.costs.contingencyPct}%)`} value={fmt(m.contingAmt)} />
            <div style={{ marginTop: 8, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total Costs</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 18, color: '#f87171' }}>{fmt(m.totalCosts)}</span>
            </div>
          </Card>

          {/* Earnings summary */}
          <Card style={{ background: meetsTarget ? 'rgba(212,175,55,0.05)' : 'rgba(194,24,24,0.05)', border: meetsTarget ? '1px solid rgba(212,175,55,0.2)' : '1px solid rgba(194,24,24,0.2)', marginBottom: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '12px' }}>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Gross Surplus</div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 18, color: m.grossSurplus >= 0 ? '#4ade80' : '#f87171' }}>{fmt(m.grossSurplus)}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '12px' }}>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Management Fee</div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 18, color: '#D4AF37' }}>{fmt(m.mgmtFee)}</div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>RCC Earnings</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 22, color: meetsTarget ? '#D4AF37' : '#f87171' }}>{fmt(m.rrcEarnings)}</span>
            </div>
            <div style={{ marginTop: 6, textAlign: 'right', fontSize: 11, color: meetsTarget ? 'rgba(212,175,55,0.6)' : 'rgba(248,113,113,0.6)' }}>
              {meetsTarget ? `↑ ${fmt(m.rrcEarnings - state.targetEarnings)} above target` : `↓ ${fmt(state.targetEarnings - m.rrcEarnings)} below target`}
            </div>
          </Card>

          {/* Prize distribution */}
          <Card>
            <SectionTitle>Prize Distribution</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[
                { pos: '1st', pct: 0.56, color: '#D4AF37', bg: 'rgba(212,175,55,0.08)', border: 'rgba(212,175,55,0.2)' },
                { pos: '2nd', pct: 0.33, color: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)' },
                { pos: '3rd', pct: 0.11, color: '#CD7F32', bg: 'rgba(205,127,50,0.08)', border: 'rgba(205,127,50,0.2)' },
              ].map(({ pos, pct, color, bg, border }) => (
                <div key={pos} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '10px 0', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 14, color }}>{pos}</div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: '#fff', marginTop: 3 }}>{fmt(Math.round(m.prizePool * pct / 1000) * 1000)}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Prize Pool</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 14, color: '#fff' }}>{fmt(m.prizePool)}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
