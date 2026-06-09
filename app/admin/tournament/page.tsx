'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trophy, ChevronRight, Trash2, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TournamentConfig {
  id: string;
  config_name: string;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
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
      targetEarnings?: number;
      brandPartners?: { fee: number }[];
      communityPartners?: { fee: number; confirmedPlayers: number }[];
      costs?: { oneTime?: { amount: number }[]; perDay?: { amount: number }[]; contingencyPct?: number };
      eventDays?: number;
    };
    const revenue = [
      ...(c.brandPartners ?? []),
      ...(c.communityPartners ?? []),
    ].reduce((s, p) => s + (p.fee || 0), 0);
    const players = (c.communityPartners ?? []).reduce((s, p) => s + (p.confirmedPlayers || 0), 0);
    const target = c.targetEarnings ?? 0;
    return { revenue, players, target };
  } catch {
    return { revenue: 0, players: 0, target: 0 };
  }
}

export default function TournamentListPage() {
  const [configs, setConfigs] = useState<TournamentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 26, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
            Tournament Planner
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
            Financial planning for each RCC event
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

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Loader2 size={24} className="animate-spin" style={{ color: 'rgba(255,255,255,0.3)' }} />
        </div>
      ) : configs.length === 0 ? (
        <div style={{
          border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16,
          padding: '60px 32px', textAlign: 'center',
        }}>
          <Trophy size={36} style={{ color: 'rgba(255,255,255,0.15)', margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 20 }}>No tournaments yet</p>
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
          {configs.map(config => {
            const { revenue, players, target } = getMetricsFromConfig(config.config);
            const hasData = revenue > 0;
            return (
              <Link key={config.id} href={`/admin/tournament/${config.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'all 0.2s',
                  position: 'relative',
                }}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(212,175,55,0.25)';
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
                  }}
                >
                  {/* Card header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: 'rgba(194,24,24,0.12)', border: '1px solid rgba(194,24,24,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Trophy size={16} color="#C21818" />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 14, color: '#fff', letterSpacing: '0.04em' }}>
                          {config.config_name}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>
                          Updated {new Date(config.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
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

                  {/* Metrics */}
                  {hasData ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Revenue</div>
                        <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 15, color: '#fff' }}>{formatINR(revenue)}</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Target</div>
                        <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 15, color: '#D4AF37' }}>{formatINR(target)}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '12px', marginBottom: 14, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
                      No data yet — open to configure
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {players > 0 ? (
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{players} players</span>
                    ) : <span />}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#D4AF37', fontSize: 12, fontWeight: 700 }}>
                      Open Planner <ChevronRight size={13} />
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
                  placeholder="e.g. RCC Doubles Cup – Season 2" autoFocus required
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
                  {creating ? <><Loader2 size={13} className="animate-spin" /> Creating…</> : 'Create & Open'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
