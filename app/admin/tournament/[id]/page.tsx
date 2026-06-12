'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Plus, Trash2, Save, CheckCircle, ArrowLeft, Loader2, LayoutDashboard, Users, Wallet, UserCheck, Calendar, Trophy, Settings as SettingsIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────

interface Partner {
  id: string;
  name: string;
  fee: number;
  pairsPerPartner: number;
  confirmedPlayers: number;
}

interface BrandPartner {
  id: string;
  name: string;
  fee: number;
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

interface ScheduleDay {
  day: number;
  date: string;
  notes: string;
}

interface PrizeDistribution {
  first: number;
  second: number;
  third: number;
}

type Mode = 'financial' | 'tournament' | 'casual';

type TabKey = 'overview' | 'partners' | 'finance' | 'players' | 'schedule' | 'prizes' | 'settings';

interface TournamentState {
  eventName: string;
  mode: Mode;
  eventDays: number;
  targetEarnings: number;
  schedule: ScheduleDay[];
  prizeDistribution: PrizeDistribution;
  brandPartners: BrandPartner[];
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
    generalConversionPct: number;
    vipEnabled: boolean;
    vipTicketPrice: number;
    vipAttendees: number;
    vipConversionPct: number;
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
  mode: 'financial',
  eventDays: 2,
  targetEarnings: 150000,
  schedule: [
    { day: 1, date: '', notes: '' },
    { day: 2, date: '', notes: '' },
    { day: 3, date: '', notes: '' },
  ],
  prizeDistribution: { first: 56, second: 33, third: 11 },
  brandPartners: [{ id: '1', name: 'Brand Partner 1', fee: 150000 }],
  communityPartners: [{ id: '2', name: 'Community Partner 1', fee: 40000, pairsPerPartner: 1, confirmedPlayers: 2 }],
  playerFee: 1000,
  sponsorship: {
    paidSponsor: { enabled: false, name: '', amount: 0 },
    barterShuttle: { enabled: false, name: '', value: 0 },
  },
  vendorStalls: { count: 0, feePerStall: 5000 },
  sundowner: { enabled: false, generalTicketPrice: 500, generalAttendees: 50, generalConversionPct: 75, vipEnabled: false, vipTicketPrice: 1500, vipAttendees: 10, vipConversionPct: 90 },
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
  const totalPlayers = s.communityPartners.reduce((a, p) => a + p.confirmedPlayers, 0);
  const playerFeeRev = totalPlayers * Math.min(s.playerFee, 1000);
  const regFeeRev = s.communityPartners.length * 5000;
  const sponsorRev = s.sponsorship.paidSponsor.enabled ? s.sponsorship.paidSponsor.amount : 0;
  const barterVal = s.sponsorship.barterShuttle.enabled ? s.sponsorship.barterShuttle.value : 0;
  const vendorRev = s.vendorStalls.count * s.vendorStalls.feePerStall;
  const sd = s.sundowner;
  const sdGeneralBilled = sd.enabled ? Math.floor(sd.generalAttendees * sd.generalConversionPct / 100) : 0;
  const sdVipBilled = (sd.enabled && sd.vipEnabled) ? Math.floor(sd.vipAttendees * sd.vipConversionPct / 100) : 0;
  const sundownerRev = sd.enabled
    ? sdGeneralBilled * sd.generalTicketPrice + (sd.vipEnabled ? sdVipBilled * sd.vipTicketPrice : 0)
    : 0;
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
  return { brandRev, commRev, playerFeeRev, regFeeRev, sponsorRev, barterVal, vendorRev, sundownerRev, sdGeneralBilled, sdVipBilled, totalRevenue, perDaySub, oneTimeSub, contingAmt, totalCosts, grossSurplus, prizePool, mgmtFee, rrcEarnings, totalPlayers };
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

function BrandPartnerCard({ partner, onChange, onDelete }: { partner: BrandPartner; onChange: (p: BrandPartner) => void; onDelete: () => void }) {
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
      <div><SLabel>Sponsorship Fee</SLabel><SInput type="number" value={partner.fee} onChange={v => onChange({ ...partner, fee: Number(v) })} /></div>
      <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>Revenue only — no players/jerseys</div>
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

function ShuttlecockIcon({ size = 20, color = '#D4AF37' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="18" r="3" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15" />
      <line x1="12" y1="15" x2="8" y2="4" stroke={color} strokeWidth="1.2" opacity="0.7" />
      <line x1="12" y1="15" x2="12" y2="3" stroke={color} strokeWidth="1.4" />
      <line x1="12" y1="15" x2="16" y2="4" stroke={color} strokeWidth="1.2" opacity="0.7" />
      <path d="M7.5 5.5 Q12 2 16.5 5.5" stroke={color} strokeWidth="1.2" fill="none" opacity="0.6" />
      <path d="M8.5 7.5 Q12 4.5 15.5 7.5" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
    </svg>
  );
}

function PanelHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 11, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 18px' }}>
      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 20, color: color ?? '#fff' }}>{value}</div>
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
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

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

  const updateBP = useCallback((id: string, p: BrandPartner) => update(s => ({ ...s, brandPartners: s.brandPartners.map(x => x.id === id ? p : x) })), []);
  const deleteBP = useCallback((id: string) => update(s => ({ ...s, brandPartners: s.brandPartners.filter(x => x.id !== id) })), []);
  const addBP = useCallback(() => update(s => ({ ...s, brandPartners: [...s.brandPartners, { id: newId(), name: `Brand Partner ${s.brandPartners.length + 1}`, fee: 150000 }] })), []);
  const updateCP = useCallback((id: string, p: Partner) => update(s => ({ ...s, communityPartners: s.communityPartners.map(x => x.id === id ? p : x) })), []);
  const deleteCP = useCallback((id: string) => update(s => ({ ...s, communityPartners: s.communityPartners.filter(x => x.id !== id) })), []);
  const addCP = useCallback(() => update(s => ({ ...s, communityPartners: [...s.communityPartners, { id: newId(), name: `Community Partner ${s.communityPartners.length + 1}`, fee: 40000, pairsPerPartner: 1, confirmedPlayers: 2 }] })), []);

  function setMode(mode: Mode) { update(s => ({ ...s, mode })); }
  function resetDefaults() {
    if (!confirm('Reset this tournament to default values? This cannot be undone until you re-save.')) return;
    update(s => ({ ...defaultState, eventName: s.eventName }));
    setActiveTab('overview');
  }
  function setSchedule(day: number, patch: Partial<ScheduleDay>) {
    update(s => ({ ...s, schedule: s.schedule.map(d => d.day === day ? { ...d, ...patch } : d) }));
  }
  // Normalise prize distribution so the three places always sum to 100
  function setPrizePct(key: keyof PrizeDistribution, value: number) {
    update(s => {
      const others = (['first', 'second', 'third'] as (keyof PrizeDistribution)[]).filter(k => k !== key);
      const v = Math.min(Math.max(value, 0), 100);
      const remaining = 100 - v;
      const prevOthersTotal = others.reduce((a, k) => a + s.prizeDistribution[k], 0) || 1;
      const next = { ...s.prizeDistribution, [key]: v } as PrizeDistribution;
      others.forEach(k => { next[k] = Math.round(remaining * (s.prizeDistribution[k] / prevOthersTotal)); });
      return { ...s, prizeDistribution: next };
    });
  }

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
          style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 17, letterSpacing: '0.06em', minWidth: 140 }}
        />

        {/* Mode selector */}
        <div style={{ display: 'flex', gap: 4 }}>
          {([
            { key: 'financial', label: '💰 Financial' },
            { key: 'tournament', label: '🏸 Tournament' },
            { key: 'casual', label: '🎮 Casual' },
          ] as { key: Mode; label: string }[]).map(opt => {
            const on = state.mode === opt.key;
            return (
              <button key={opt.key} type="button" onClick={() => setMode(opt.key)} style={{
                padding: '6px 11px', borderRadius: 8, cursor: 'pointer', fontSize: 11,
                fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.04em',
                border: on ? '1px solid rgba(212,175,55,0.35)' : '1px solid rgba(255,255,255,0.08)',
                background: on ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                color: on ? '#D4AF37' : 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap',
              }}>{opt.label}</button>
            );
          })}
        </div>

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

      {/* ── Tab navigation ── */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 28, overflowX: 'auto' }}>
        {([
          { key: 'overview', label: 'Overview', Icon: LayoutDashboard },
          { key: 'partners', label: 'Partners', Icon: Users },
          { key: 'finance', label: 'Finance', Icon: Wallet },
          { key: 'players', label: 'Players', Icon: UserCheck },
          { key: 'schedule', label: 'Schedule', Icon: Calendar },
          { key: 'prizes', label: 'Prizes', Icon: Trophy },
          { key: 'settings', label: 'Settings', Icon: SettingsIcon },
        ] as { key: TabKey; label: string; Icon: typeof Users }[]).map(({ key, label, Icon }) => {
          const on = activeTab === key;
          return (
            <button key={key} type="button" onClick={() => setActiveTab(key)} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: '8px 8px 0 0',
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', background: on ? 'rgba(212,175,55,0.1)' : 'transparent',
              borderBottom: on ? '2px solid #D4AF37' : '2px solid transparent',
              fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: on ? '#D4AF37' : 'rgba(255,255,255,0.4)', transition: 'all 0.15s',
            }}
              onMouseOver={e => { if (!on) e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
              onMouseOut={e => { if (!on) e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
            >
              <Icon size={13} /> {label}
            </button>
          );
        })}
      </div>

      {/* ════════════ OVERVIEW ════════════ */}
      {activeTab === 'overview' && (
        <div>
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

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 12 }}>
            <StatBox label="Total Players" value={String(m.totalPlayers)} />
            <StatBox label="Event Days" value={String(state.eventDays)} />
            <StatBox label="Partners" value={String(state.brandPartners.length + state.communityPartners.length)} />
            <StatBox label="RCC Earnings" value={fmt(m.rrcEarnings)} color={meetsTarget ? '#D4AF37' : '#f87171'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {/* Revenue */}
            <Card style={{ marginBottom: 0 }}>
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
            <Card style={{ marginBottom: 0 }}>
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
            <Card style={{ marginBottom: 0, background: meetsTarget ? 'rgba(212,175,55,0.05)' : 'rgba(194,24,24,0.05)', border: meetsTarget ? '1px solid rgba(212,175,55,0.2)' : '1px solid rgba(194,24,24,0.2)' }}>
              <SectionTitle>Earnings Summary</SectionTitle>
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
                {meetsTarget ? `+ ${fmt(m.rrcEarnings - state.targetEarnings)} above target` : `${fmt(state.targetEarnings - m.rrcEarnings)} below target`}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ════════════ PARTNERS ════════════ */}
      {activeTab === 'partners' && (
        <div>
          <Card>
            <SectionTitle>Brand Partners ({state.brandPartners.length})</SectionTitle>
            {state.brandPartners.map(p => (
              <BrandPartnerCard key={p.id} partner={p} onChange={u => updateBP(p.id, u)} onDelete={() => deleteBP(p.id)} />
            ))}
            <AddBtn onClick={addBP}>Add Brand Partner</AddBtn>
          </Card>
          <Card>
            <SectionTitle>Community Partners ({state.communityPartners.length})</SectionTitle>
            {state.communityPartners.map(p => (
              <PartnerCard key={p.id} partner={p} onChange={u => updateCP(p.id, u)} onDelete={() => deleteCP(p.id)} />
            ))}
            <AddBtn onClick={addCP}>Add Community Partner</AddBtn>
          </Card>
        </div>
      )}

      {/* ════════════ FINANCE ════════════ */}
      {activeTab === 'finance' && (
        <div>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                  <div><SLabel>Ticket Price</SLabel><SInput type="number" value={state.sundowner.generalTicketPrice} onChange={v => update(s => ({ ...s, sundowner: { ...s.sundowner, generalTicketPrice: Number(v) } }))} /></div>
                  <div><SLabel>Attendees (invited)</SLabel><SInput type="number" value={state.sundowner.generalAttendees} onChange={v => update(s => ({ ...s, sundowner: { ...s.sundowner, generalAttendees: Number(v) } }))} /></div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <SLabel>Billing Conversion %</SLabel>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 13, color: '#fff' }}>{state.sundowner.generalConversionPct}%</span>
                  </div>
                  <input type="range" min={0} max={100} step={5} value={state.sundowner.generalConversionPct}
                    onChange={e => update(s => ({ ...s, sundowner: { ...s.sundowner, generalConversionPct: Number(e.target.value) } }))}
                    style={{ width: '100%', accentColor: '#D4AF37', marginBottom: 4 }}
                  />
                  <div style={{ fontSize: 11, color: 'rgba(212,175,55,0.7)' }}>
                    → {m.sdGeneralBilled} billed @ ₹{state.sundowner.generalTicketPrice} = {fmt(m.sdGeneralBilled * state.sundowner.generalTicketPrice)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: state.sundowner.vipEnabled ? 10 : 0 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>VIP Tickets</span>
                  <Toggle on={state.sundowner.vipEnabled} onChange={v => update(s => ({ ...s, sundowner: { ...s.sundowner, vipEnabled: v } }))} />
                </div>
                {state.sundowner.vipEnabled && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                      <div><SLabel>VIP Price</SLabel><SInput type="number" value={state.sundowner.vipTicketPrice} onChange={v => update(s => ({ ...s, sundowner: { ...s.sundowner, vipTicketPrice: Number(v) } }))} /></div>
                      <div><SLabel>VIP Attendees (invited)</SLabel><SInput type="number" value={state.sundowner.vipAttendees} onChange={v => update(s => ({ ...s, sundowner: { ...s.sundowner, vipAttendees: Number(v) } }))} /></div>
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <SLabel>VIP Billing Conversion %</SLabel>
                        <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 13, color: '#fff' }}>{state.sundowner.vipConversionPct}%</span>
                      </div>
                      <input type="range" min={0} max={100} step={5} value={state.sundowner.vipConversionPct}
                        onChange={e => update(s => ({ ...s, sundowner: { ...s.sundowner, vipConversionPct: Number(e.target.value) } }))}
                        style={{ width: '100%', accentColor: '#D4AF37', marginBottom: 4 }}
                      />
                      <div style={{ fontSize: 11, color: 'rgba(212,175,55,0.7)' }}>
                        → {m.sdVipBilled} billed @ ₹{state.sundowner.vipTicketPrice} = {fmt(m.sdVipBilled * state.sundowner.vipTicketPrice)}
                      </div>
                    </div>
                  </>
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
      )}

      {/* ════════════ PLAYERS ════════════ */}
      {activeTab === 'players' && (
        <div>
          <PanelHeader>Confirmed Player Roster</PanelHeader>
          {state.communityPartners.length === 0 && (
            <Card><div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>No community partners yet. Add some in the Partners tab.</div></Card>
          )}
          {state.communityPartners.map(p => {
            const maxPlayers = p.pairsPerPartner * 2;
            return (
              <Card key={p.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 14, color: '#fff' }}>{p.name || 'Unnamed Partner'}</div>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 12, color: '#D4AF37' }}>{p.confirmedPlayers}/{maxPlayers} confirmed</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                  {Array.from({ length: p.pairsPerPartner }).map((_, i) => {
                    const filled = (i + 1) * 2 <= p.confirmedPlayers;
                    const partial = !filled && i * 2 < p.confirmedPlayers;
                    const inPair = filled ? 2 : partial ? p.confirmedPlayers - i * 2 : 0;
                    return (
                      <div key={i} style={{
                        background: filled ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${filled ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.07)'}`,
                        borderRadius: 10, padding: '12px 14px',
                      }}>
                        <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 12, color: filled ? '#D4AF37' : 'rgba(255,255,255,0.6)' }}>Pair {i + 1}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{inPair} player{inPair !== 1 ? 's' : ''}</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
          <Card style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total Confirmed Players</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 22, color: '#D4AF37' }}>{m.totalPlayers}</span>
            </div>
          </Card>
        </div>
      )}

      {/* ════════════ SCHEDULE ════════════ */}
      {activeTab === 'schedule' && (
        <div>
          <PanelHeader>Event Timeline ({state.eventDays} day{state.eventDays > 1 ? 's' : ''})</PanelHeader>
          {state.schedule.filter(d => d.day <= state.eventDays).map(d => (
            <Card key={d.day}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(194,24,24,0.12)', border: '1px solid rgba(194,24,24,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 16, color: '#C21818' }}>{d.day}</div>
                <div style={{ flex: 1 }}>
                  <SLabel>Estimated Date</SLabel>
                  <SInput type="date" value={d.date} onChange={v => setSchedule(d.day, { date: v })} />
                </div>
              </div>
              <SLabel>Per-Day Costs (this day)</SLabel>
              <div style={{ marginBottom: 12 }}>
                {state.costs.perDay.map(c => <MetaRow key={c.id} label={c.label} value={fmt(c.amount)} />)}
                <div style={{ marginTop: 6, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700 }}>Day total</span>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 13, color: '#f87171' }}>{fmt(state.costs.perDay.reduce((a, c) => a + c.amount, 0))}</span>
                </div>
              </div>
              <SLabel>Notes</SLabel>
              <textarea value={d.notes} onChange={e => setSchedule(d.day, { notes: e.target.value })} placeholder="Schedule notes for this day..."
                style={{ ...inp, minHeight: 64, resize: 'vertical' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.45)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </Card>
          ))}
        </div>
      )}

      {/* ════════════ PRIZES ════════════ */}
      {activeTab === 'prizes' && (
        <div>
          <Card>
            <SectionTitle>Prize Distribution</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
              {([
                { pos: '1st', key: 'first' as const, color: '#D4AF37', bg: 'rgba(212,175,55,0.08)', border: 'rgba(212,175,55,0.2)' },
                { pos: '2nd', key: 'second' as const, color: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)' },
                { pos: '3rd', key: 'third' as const, color: '#CD7F32', bg: 'rgba(205,127,50,0.08)', border: 'rgba(205,127,50,0.2)' },
              ]).map(({ pos, key, color, bg, border }) => (
                <div key={pos} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '14px 0', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 16, color }}>{pos}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{state.prizeDistribution[key]}%</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginTop: 4 }}>{fmt(Math.round(m.prizePool * state.prizeDistribution[key] / 100 / 1000) * 1000)}</div>
                </div>
              ))}
            </div>
            {([
              { label: '1st Place', key: 'first' as const, accent: '#D4AF37' },
              { label: '2nd Place', key: 'second' as const, accent: '#9ca3af' },
              { label: '3rd Place', key: 'third' as const, accent: '#CD7F32' },
            ]).map(({ label, key, accent }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <SLabel>{label}</SLabel>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 13, color: '#fff' }}>{state.prizeDistribution[key]}%</span>
                </div>
                <input type="range" min={0} max={100} step={1} value={state.prizeDistribution[key]}
                  onChange={e => setPrizePct(key, Number(e.target.value))}
                  style={{ width: '100%', accentColor: accent }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Prize Pool</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 16, color: '#fff' }}>{fmt(m.prizePool)}</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
              Prize pool is driven by the {'"'}Prize Pool{'"'} one-time cost in the Finance tab. Percentages always total 100%.
            </div>
          </Card>
        </div>
      )}

      {/* ════════════ SETTINGS ════════════ */}
      {activeTab === 'settings' && (
        <div>
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

          <Card>
            <SectionTitle>Mode</SectionTitle>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {([
                { key: 'financial' as Mode, label: '💰 Financial' },
                { key: 'tournament' as Mode, label: '🏸 Tournament' },
                { key: 'casual' as Mode, label: '🎮 Casual' },
              ]).map(opt => {
                const on = state.mode === opt.key;
                return (
                  <button key={opt.key} type="button" onClick={() => setMode(opt.key)} style={{
                    padding: '9px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 12,
                    fontFamily: 'var(--font-montserrat)', fontWeight: 700,
                    border: on ? '1px solid rgba(212,175,55,0.35)' : '1px solid rgba(255,255,255,0.08)',
                    background: on ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                    color: on ? '#D4AF37' : 'rgba(255,255,255,0.45)',
                  }}>{opt.label}</button>
                );
              })}
            </div>
          </Card>

          <Card style={{ background: 'rgba(194,24,24,0.05)', border: '1px solid rgba(194,24,24,0.2)' }}>
            <SectionTitle>Danger Zone</SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Reset all fields back to default values (keeps the event name).</div>
              <button type="button" onClick={resetDefaults} style={{
                padding: '9px 16px', borderRadius: 8, cursor: 'pointer', flexShrink: 0,
                border: '1px solid rgba(194,24,24,0.4)', background: 'rgba(194,24,24,0.15)', color: '#f87171',
                fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>Reset to Defaults</button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
