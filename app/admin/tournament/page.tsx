'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, ChevronRight, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TournamentConfig {
  id: string;
  config_name: string;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

type Mode = 'financial' | 'tournament' | 'casual';

const MODE_META: Record<Mode, { label: string; accent: string; chipBg: string; chipBorder: string }> = {
  financial: { label: 'Financial', accent: '#D4AF37', chipBg: 'rgba(212,175,55,0.12)', chipBorder: 'rgba(212,175,55,0.3)' },
  tournament: { label: 'Tournament', accent: '#C21818', chipBg: 'rgba(194,24,24,0.12)', chipBorder: 'rgba(194,24,24,0.3)' },
  casual: { label: 'Casual', accent: '#3B82F6', chipBg: 'rgba(59,130,246,0.12)', chipBorder: 'rgba(59,130,246,0.3)' },
};

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

function CourtAccent() {
  return (
    <svg width={120} height={80} viewBox="0 0 120 80" fill="none"
      style={{ position: 'absolute', top: 8, right: 8, opacity: 0.04, pointerEvents: 'none' }}>
      <rect x="2" y="2" width="116" height="76" stroke="#fff" strokeWidth="1.5" />
      <line x1="60" y1="2" x2="60" y2="78" stroke="#fff" strokeWidth="1.5" />
      <line x1="30" y1="2" x2="30" y2="78" stroke="#fff" strokeWidth="1" />
      <line x1="90" y1="2" x2="90" y2="78" stroke="#fff" strokeWidth="1" />
      <line x1="2" y1="40" x2="118" y2="40" stroke="#fff" strokeWidth="1" />
    </svg>
  );
}

function formatINR(n: number): string {
  if (!n || isNaN(n)) return '₹0';
  const abs = Math.abs(Math.round(n));
  const str = abs.toString();
  let result = '';
  if (str.length <= 3) result = str;
  else {
    const last3 = str.slice(-3);
    const rest = str.slice(0, -3);
    const groups: string[] = [];
    for (let i = rest.length; i > 0; i -= 2) groups.unshift(rest.slice(Math.max(0, i - 2), i));
    result = groups.join(',') + ',' + last3;
  }
  return (n < 0 ? '-₹' : '₹') + result;
}

function getMetricsFromConfig(config: Record<string, unknown>) {
  try {
    const c = config as {
      mode?: Mode;
      brandPartners?: { fee: number }[];
      communityPartners?: { fee: number; confirmedPlayers: number }[];
      eventDays?: number;
    };
    const revenue = [
      ...(c.brandPartners ?? []),
      ...(c.communityPartners ?? []),
    ].reduce((s, p) => s + (p.fee || 0), 0);
    const players = (c.communityPartners ?? []).reduce((s, p) => s + (p.confirmedPlayers || 0), 0);
    const days = c.eventDays ?? 0;
    const mode: Mode = c.mode ?? 'financial';
    return { revenue, players, days, mode };
  } catch {
    return { revenue: 0, players: 0, days: 0, mode: 'financial' as Mode };
  }
}

function daysAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d <= 0) return 'today';
  if (d === 1) return '1 day ago';
  return `${d} days ago`;
}

function StatChip({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10,
      padding: '12px 18px', minWidth: 130,
    }}>
      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 18, color: accent }}>{value}</div>
    </div>
  );
}

export default function TournamentListPage() {
  const [configs, setConfigs] = useState<TournamentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | Mode>('all');

  useEffect(() => { loadConfigs(); }, []);

  async function loadConfigs() {
    setLoading(true);
    const { data } = await supabase
      .from('rcc_tournament_configs')
      .select('*')
      .order('updated_at', { ascending: false });
    if (data) setConfigs(data as TournamentConfig[]);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setCreateError('');
    const { data, error } = await supabase
      .from('rcc_tournament_configs')
      .insert({ config_name: newName.trim(), config: {} })
      .select('id')
      .single();
    if (error) {
      setCreateError(error.message);
      setCreating(false);
    } else if (data) {
      window.location.href = `/admin/tournament/${data.id}`;
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this tournament config?')) return;
    setDeletingId(id);
    await supabase.from('rcc_tournament_configs').delete().eq('id', id);
    setConfigs(prev => prev.filter(c => c.id !== id));
    setDeletingId(null);
  }

  // Header stats
  const enriched = configs.map(c => ({ cfg: c, ...getMetricsFromConfig(c.config) }));
  const totalEvents = configs.length;
  const activeThisSeason = enriched.filter(e =>
    Date.now() - new Date(e.cfg.updated_at).getTime() < 120 * 86400000
  ).length;
  const totalPrizePool = enriched.reduce((s, e) => s + e.revenue, 0);

  const filtered = enriched.filter(e => filter === 'all' || e.mode === filter);

  const tabs: { key: 'all' | Mode; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'financial', label: 'Financial' },
    { key: 'tournament', label: 'Tournament' },
    { key: 'casual', label: 'Casual Play' },
  ];

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <ShuttlecockIcon size={30} color="#D4AF37" />
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 28, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
              Tournament Hub
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, letterSpacing: '0.08em' }}>
            Plan · Organise · Execute
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
            background: 'linear-gradient(135deg, #C21818, #8B0000)',
            border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer',
            fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 11,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            boxShadow: '0 4px 20px rgba(194,24,24,0.3)',
          }}
        >
          <Plus size={14} /> New Tournament
        </button>
      </div>

      {/* Header stat chips */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <StatChip label="Total Events" value={String(totalEvents)} accent="#fff" />
        <StatChip label="Active this Season" value={String(activeThisSeason)} accent="#4ade80" />
        <StatChip label="Total Prize Pool" value={formatINR(totalPrizePool)} accent="#D4AF37" />
      </div>

      {/* Mode filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(t => {
          const active = filter === t.key;
          return (
            <button key={t.key} onClick={() => setFilter(t.key)} style={{
              padding: '8px 18px', borderRadius: 999, cursor: 'pointer',
              fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
              background: active ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
              border: active ? '1px solid rgba(212,175,55,0.35)' : '1px solid rgba(255,255,255,0.08)',
              color: active ? '#D4AF37' : 'rgba(255,255,255,0.4)', transition: 'all 0.15s',
            }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Loader2 size={24} className="animate-spin" style={{ color: 'rgba(255,255,255,0.3)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16,
          padding: '60px 32px', textAlign: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <ShuttlecockIcon size={36} color="rgba(255,255,255,0.2)" />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 20 }}>
            {configs.length === 0 ? 'No tournaments yet' : 'No tournaments in this mode'}
          </p>
          <button onClick={() => setShowModal(true)} style={{
            padding: '10px 20px', background: 'rgba(194,24,24,0.15)', border: '1px solid rgba(194,24,24,0.3)',
            borderRadius: 8, color: '#C21818', cursor: 'pointer',
            fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            Create First Tournament
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map(({ cfg: config, revenue, players, days, mode }) => {
            const meta = MODE_META[mode];
            return (
              <Link key={config.id} href={`/admin/tournament/${config.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: '20px 20px 20px 24px', cursor: 'pointer', transition: 'all 0.2s',
                  position: 'relative', overflow: 'hidden',
                }}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLDivElement).style.border = `1px solid ${meta.chipBorder}`;
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
                  }}
                >
                  {/* Left accent bar */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: meta.accent }} />
                  <CourtAccent />

                  {/* Card header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: meta.chipBg, border: `1px solid ${meta.chipBorder}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <ShuttlecockIcon size={18} color={meta.accent} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 14, color: '#fff', letterSpacing: '0.04em' }}>
                          {config.config_name}
                        </div>
                        <span style={{
                          display: 'inline-block', marginTop: 5, padding: '2px 8px', borderRadius: 999,
                          background: meta.chipBg, border: `1px solid ${meta.chipBorder}`, color: meta.accent,
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                        }}>{meta.label}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(config.id, e)}
                      style={{
                        width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)',
                        background: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        transition: 'all 0.15s',
                      }}
                      onMouseOver={e => { e.currentTarget.style.color = '#C21818'; e.currentTarget.style.borderColor = 'rgba(194,24,24,0.3)'; }}
                      onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    >
                      {deletingId === config.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    </button>
                  </div>

                  {/* Mini stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14, position: 'relative' }}>
                    {[
                      { label: 'Revenue', value: formatINR(revenue), color: '#fff' },
                      { label: 'Players', value: String(players), color: '#fff' },
                      { label: 'Days', value: String(days), color: '#fff' },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{s.label}</div>
                        <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 14, color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Updated {daysAgo(config.updated_at)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#D4AF37', fontSize: 12, fontWeight: 700 }}>
                      Open <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'fixed', zIndex: 901, top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 'min(440px, calc(100vw - 32px))', background: '#0d0d18',
            border: '1px solid rgba(212,175,55,0.15)', borderRadius: 16,
            boxShadow: '0 32px 80px rgba(0,0,0,0.8)', padding: 32,
          }}>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
              New Tournament
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 24 }}>
              Give it a name — you can change it later inside the planner.
            </p>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Tournament Name
                </label>
                <input
                  type="text" value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. RCC Doubles Cup - Season 2" autoFocus required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
              </div>
              {createError && <p style={{ color: '#f87171', fontSize: 13 }}>{createError}</p>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                  fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>Cancel</button>
                <button type="submit" disabled={creating || !newName.trim()} style={{
                  flex: 2, padding: '12px', background: 'linear-gradient(135deg, #C21818, #8B0000)',
                  border: 'none', borderRadius: 10, color: '#fff', cursor: creating ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: creating ? 0.6 : 1,
                }}>
                  {creating ? <><Loader2 size={13} className="animate-spin" /> Creating</> : 'Create & Open'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
