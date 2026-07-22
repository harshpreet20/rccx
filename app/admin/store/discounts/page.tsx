'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Ticket } from 'lucide-react';
import { storeApiFetch } from '@/lib/store-api-client';
import StoreTabs from '../StoreTabs';

type Discount = {
  id: string;
  code: string;
  type: 'percent' | 'flat';
  value: number;
  active: boolean;
  usage_limit: number | null;
  times_used: number;
  min_order_amount: number;
};

const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '10px 14px', color: '#e8e8ec', fontSize: 13, outline: 'none',
  fontFamily: 'var(--font-inter)',
};

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'flat'>('percent');
  const [value, setValue] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const json = await storeApiFetch('/api/store/discounts');
      setDiscounts(json.discounts || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load discounts');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !value) return;
    setCreating(true);
    setError('');
    try {
      const json = await storeApiFetch('/api/store/discounts', {
        method: 'POST',
        body: JSON.stringify({ code: code.trim(), type, value: Number(value) }),
      });
      setDiscounts((prev) => [json.discount, ...prev]);
      setCode(''); setValue('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create discount');
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(d: Discount) {
    try {
      await storeApiFetch(`/api/store/discounts/${d.id}`, { method: 'PATCH', body: JSON.stringify({ active: !d.active }) });
      setDiscounts((prev) => prev.map((x) => (x.id === d.id ? { ...x, active: !x.active } : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update discount');
    }
  }

  async function remove(id: string) {
    try {
      await storeApiFetch(`/api/store/discounts/${id}`, { method: 'DELETE' });
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete discount');
    }
  }

  return (
    <div>
      <StoreTabs />
      <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 26, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 32 }}>
        Discount Codes
      </h1>

      {error && (
        <div style={{ background: 'rgba(194,24,24,0.1)', border: '1px solid rgba(194,24,24,0.25)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        <input placeholder="CODE" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} style={{ ...inp, flex: '1 1 140px' }} />
        <select value={type} onChange={(e) => setType(e.target.value as 'percent' | 'flat')} style={inp}>
          <option value="percent">% off</option>
          <option value="flat">₹ off</option>
        </select>
        <input type="number" min={1} placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} style={{ ...inp, width: 100 }} />
        <button type="submit" disabled={creating} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
          background: 'linear-gradient(135deg, #C21818, #8B0000)', border: 'none', borderRadius: 8,
          color: '#fff', cursor: creating ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />} Add
        </button>
      </form>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Loader2 size={24} className="animate-spin" style={{ color: 'rgba(255,255,255,0.3)' }} />
        </div>
      ) : discounts.length === 0 ? (
        <div style={{ border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16, padding: '60px 32px', textAlign: 'center' }}>
          <Ticket size={32} style={{ opacity: 0.3, marginBottom: 16 }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>No discount codes yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {discounts.map((d) => (
            <div key={d.id} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 14, color: '#fff', margin: 0, letterSpacing: '0.06em' }}>{d.code}</h3>
                  <span style={{
                    fontSize: 9, padding: '2px 8px', borderRadius: 10,
                    fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    background: d.active ? 'rgba(217,255,0,0.1)' : 'rgba(255,255,255,0.05)',
                    color: d.active ? '#D9FF00' : 'rgba(255,255,255,0.3)',
                  }}>{d.active ? 'Active' : 'Inactive'}</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                  {d.type === 'percent' ? `${d.value}% off` : `₹${d.value} off`} · used {d.times_used}{d.usage_limit ? `/${d.usage_limit}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => toggleActive(d)} style={{
                  padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                  fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>{d.active ? 'Deactivate' : 'Activate'}</button>
                <button onClick={() => remove(d.id)} title="Delete" style={{
                  width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
                  background: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
