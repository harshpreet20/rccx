'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, ShoppingBag, ToggleLeft, ToggleRight } from 'lucide-react';
import { storeApiFetch } from '@/lib/store-api-client';
import StoreTabs from '../StoreTabs';

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string | null;
  active: boolean;
  sold_out: boolean;
  stock: number | null;
};

const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '10px 14px', color: '#e8e8ec', fontSize: 13, outline: 'none',
  fontFamily: 'var(--font-inter)',
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const json = await storeApiFetch('/api/store/products');
      setProducts(json.products || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price) return;
    setCreating(true);
    setError('');
    try {
      const json = await storeApiFetch('/api/store/products', {
        method: 'POST',
        body: JSON.stringify({ slug: slugify(name), name: name.trim(), price: Number(price) }),
      });
      setProducts((prev) => [json.product, ...prev]);
      setName(''); setPrice('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create product');
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(p: Product) {
    try {
      await storeApiFetch(`/api/store/products/${p.id}`, { method: 'PATCH', body: JSON.stringify({ active: !p.active }) });
      setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update product');
    }
  }

  async function remove(id: string) {
    try {
      await storeApiFetch(`/api/store/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete product');
    }
  }

  return (
    <div>
      <StoreTabs />
      <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 26, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 32 }}>
        Products
      </h1>

      {error && (
        <div style={{ background: 'rgba(194,24,24,0.1)', border: '1px solid rgba(194,24,24,0.25)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        <input placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} style={{ ...inp, flex: '1 1 220px' }} />
        <input type="number" min={0} placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} style={{ ...inp, width: 120 }} />
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
      ) : products.length === 0 ? (
        <div style={{ border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16, padding: '60px 32px', textAlign: 'center' }}>
          <ShoppingBag size={32} style={{ opacity: 0.3, marginBottom: 16 }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>No products yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {products.map((p) => (
            <div key={p.id} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 14, color: '#fff', margin: 0 }}>{p.name}</h3>
                  {p.sold_out && (
                    <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(194,24,24,0.15)', color: '#f87171' }}>
                      Sold out
                    </span>
                  )}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                  /{p.slug} · ₹{p.price}{p.category ? ` · ${p.category}` : ''}{p.stock != null ? ` · stock ${p.stock}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => toggleActive(p)} title={p.active ? 'Deactivate' : 'Activate'} style={{
                  width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
                  background: 'none', color: p.active ? '#D9FF00' : 'rgba(255,255,255,0.3)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {p.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
                <button onClick={() => remove(p.id)} title="Delete" style={{
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
