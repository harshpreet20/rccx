'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { storeApiFetch } from '@/lib/store-api-client';
import StoreTabs from '../StoreTabs';

type Settings = {
  tax_rate_pct: number;
  shipping_flat_rate: number;
  free_shipping_threshold: number | null;
};

const inp: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '10px 14px', color: '#e8e8ec', fontSize: 14, outline: 'none',
  boxSizing: 'border-box', fontFamily: 'var(--font-inter)',
};

const label: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10,
  letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8,
};

export default function StoreSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const json = await storeApiFetch('/api/store/settings');
        setSettings(json.settings);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const json = await storeApiFetch('/api/store/settings', { method: 'PATCH', body: JSON.stringify(settings) });
      setSettings(json.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <StoreTabs />
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Loader2 size={24} className="animate-spin" style={{ color: 'rgba(255,255,255,0.3)' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <StoreTabs />
      <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 26, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 32 }}>
        Store Settings
      </h1>

      {error && (
        <div style={{ background: 'rgba(194,24,24,0.1)', border: '1px solid rgba(194,24,24,0.25)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {settings && (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={label}>Tax rate (%)</label>
            <input type="number" min={0} style={inp} value={settings.tax_rate_pct}
              onChange={(e) => setSettings({ ...settings, tax_rate_pct: Number(e.target.value) })} />
          </div>
          <div>
            <label style={label}>Flat shipping fee (₹)</label>
            <input type="number" min={0} style={inp} value={settings.shipping_flat_rate}
              onChange={(e) => setSettings({ ...settings, shipping_flat_rate: Number(e.target.value) })} />
          </div>
          <div>
            <label style={label}>Free shipping threshold (₹, blank = none)</label>
            <input type="number" min={0} style={inp} value={settings.free_shipping_threshold ?? ''}
              onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value === '' ? null : Number(e.target.value) })} />
          </div>
          <button type="submit" disabled={saving} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px', background: 'linear-gradient(135deg, #C21818, #8B0000)',
            border: 'none', borderRadius: 10, color: '#fff', cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saved ? 'Saved' : saving ? 'Saving…' : 'Save Settings'}
          </button>
        </form>
      )}
    </div>
  );
}
