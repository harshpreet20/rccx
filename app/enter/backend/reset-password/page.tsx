'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError(null);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setDone(true);
      setTimeout(() => router.replace('/enter/backend'), 2500);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 10,
    color: '#e8e8ec',
    padding: '13px 16px',
    width: '100%',
    fontFamily: 'var(--font-inter)',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ background: '#080810', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
      <div style={{
        background: '#0d0d14',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 400,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), rgba(194,24,24,0.3), transparent)' }} />

        <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#D4AF37', marginBottom: 12, textTransform: 'uppercase' }}>
          RCC Admin Portal
        </div>
        <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 24, color: '#e8e8ec', marginBottom: 6 }}>
          Set New Password
        </div>
        <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 13, color: '#888899', marginBottom: 32 }}>
          Choose a strong password for your admin account.
        </div>

        {done ? (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, padding: '20px 22px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 14, color: '#22c55e', marginBottom: 4 }}>Password updated!</div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#888899' }}>Redirecting you to the dashboard…</div>
          </div>
        ) : !ready ? (
          <div style={{ textAlign: 'center', color: '#888899', fontFamily: 'var(--font-montserrat)', fontSize: 13 }}>
            Verifying reset link…
          </div>
        ) : (
          <form onSubmit={handleReset}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', color: '#888899', textTransform: 'uppercase', marginBottom: 8 }}>
                New Password
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 8 characters" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', color: '#888899', textTransform: 'uppercase', marginBottom: 8 }}>
                Confirm Password
              </label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Repeat password" style={inputStyle} />
            </div>

            {error && (
              <div style={{ background: 'rgba(194,24,24,0.1)', border: '1px solid rgba(194,24,24,0.3)', borderRadius: 20, padding: '10px 18px', marginBottom: 20, fontFamily: 'var(--font-inter)', fontSize: 13, color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚠</span>{error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? 'rgba(100,100,20,0.5)' : 'linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)',
                color: '#000', border: 'none', borderRadius: 10, padding: '14px 20px', width: '100%',
                fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.08em',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.25s',
                boxShadow: '0 4px 20px rgba(212,175,55,0.25)',
              }}
            >
              {loading ? 'UPDATING…' : 'UPDATE PASSWORD'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
