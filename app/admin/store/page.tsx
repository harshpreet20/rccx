'use client';

import { useState, useEffect } from 'react';
import { Loader2, Package } from 'lucide-react';
import { storeApiFetch } from '@/lib/store-api-client';
import StoreTabs from './StoreTabs';

type Order = {
  id: string;
  order_ref: string;
  amount: number;
  status: string;
  customer_name: string;
  customer_phone: string;
  created_at: string;
};

const STATUSES = ['awaiting_confirmation', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
  awaiting_confirmation: '#D9FF00',
  confirmed: '#4ade80',
  shipped: '#60a5fa',
  delivered: '#a78bfa',
  cancelled: 'rgba(255,255,255,0.3)',
};

export default function StoreOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const qs = filter ? `?status=${filter}` : '';
      const json = await storeApiFetch(`/api/store/orders${qs}`);
      setOrders(json.orders || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      await storeApiFetch(`/api/store/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update order');
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <StoreTabs />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 26, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
            Store Orders
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '10px 14px', color: '#e8e8ec', fontSize: 13,
          }}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {error && (
        <div style={{ background: 'rgba(194,24,24,0.1)', border: '1px solid rgba(194,24,24,0.25)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Loader2 size={24} className="animate-spin" style={{ color: 'rgba(255,255,255,0.3)' }} />
        </div>
      ) : orders.length === 0 ? (
        <div style={{ border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16, padding: '60px 32px', textAlign: 'center' }}>
          <Package size={32} style={{ opacity: 0.3, marginBottom: 16 }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>No orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((o) => (
            <div key={o.id} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 14, color: '#fff', margin: 0 }}>
                    {o.order_ref}
                  </h3>
                  <span style={{
                    fontSize: 9, padding: '2px 8px', borderRadius: 10,
                    fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    background: 'rgba(255,255,255,0.06)', color: STATUS_COLORS[o.status] || '#fff',
                  }}>
                    {o.status.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                  {o.customer_name} · {o.customer_phone} · ₹{o.amount}
                </div>
              </div>
              <select
                value={o.status}
                disabled={updating === o.id}
                onChange={(e) => updateStatus(o.id, e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '8px 12px', color: '#e8e8ec', fontSize: 12,
                }}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
