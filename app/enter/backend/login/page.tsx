'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [btnHover, setBtnHover] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/enter/backend');
      else setCheckingSession(false);
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.replace('/enter/backend');
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    setResetError(null);
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/enter/backend/reset-password`,
    });
    setResetLoading(false);
    if (resetErr) {
      setResetError(resetErr.message);
    } else {
      setResetSent(true);
    }
  }

  if (checkingSession) {
    return (
      <div style={{ background: '#080810', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-montserrat)', color: '#888899', fontSize: 13, letterSpacing: '0.12em' }}>CHECKING SESSION…</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(24px) scale(0.95); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-18px) translateX(10px); }
          66% { transform: translateY(12px) translateX(-8px); }
        }
      `}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#080810', fontFamily: 'var(--font-inter)' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          flex: '0 0 60%',
          position: 'relative',
          overflow: 'hidden',
          background: '#080810',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
          className="rcc-left-panel"
        >
          {/* Radial gradient glows */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 60% at 20% 20%, rgba(212,175,55,0.13) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 85%, rgba(194,24,24,0.12) 0%, transparent 70%)',
          }} />

          {/* Animated floating circles */}
          <div style={{
            position: 'absolute', width: 340, height: 340, borderRadius: '50%',
            border: '1px solid rgba(212,175,55,0.08)',
            top: '-60px', left: '-80px',
            animation: 'floatA 9s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: 220, height: 220, borderRadius: '50%',
            border: '1px solid rgba(194,24,24,0.07)',
            bottom: '80px', right: '-50px',
            animation: 'floatB 11s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: 160, height: 160, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)',
            top: '40%', left: '10%',
            animation: 'floatC 13s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: 90, height: 90, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(194,24,24,0.08) 0%, transparent 70%)',
            top: '15%', right: '15%',
            animation: 'floatB 7s ease-in-out infinite',
            pointerEvents: 'none',
          }} />

          {/* Subtle grid overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '0 48px', textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/rcc-logo.png" alt="RCC Logo" style={{ height: 100, width: 'auto', marginBottom: 24, filter: 'drop-shadow(0 0 24px rgba(212,175,55,0.25))' }} />

            <div style={{
              fontFamily: 'Arial, "Helvetica Neue", sans-serif',
              fontWeight: 700,
              fontSize: 32,
              color: '#D4AF37',
              letterSpacing: '0.06em',
              lineHeight: 1.1,
              marginBottom: 8,
            }}>
              RACQUETS CLUB<br />COMMUNITY
            </div>

            <div style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: 14,
              color: '#888899',
              letterSpacing: '0.08em',
              marginBottom: 40,
            }}>
              Delhi&apos;s Elite Badminton Network
            </div>

            {/* Stat pills */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 56 }}>
              {[
                { label: '500+ Members' },
                { label: '50+ Events' },
                { label: '₹5L+ Prize Pool' },
              ].map(pill => (
                <div key={pill.label} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: 20,
                  padding: '7px 16px',
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 600,
                  fontSize: 12,
                  color: '#D4AF37',
                  letterSpacing: '0.04em',
                  backdropFilter: 'blur(8px)',
                }}>
                  {pill.label}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom left footer */}
          <div style={{
            position: 'absolute', bottom: 24, left: 36,
            fontFamily: 'var(--font-montserrat)',
            fontSize: 11,
            color: '#444455',
            letterSpacing: '0.06em',
          }}>
            Authorised access only · Admin Portal
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="rcc-right-panel" style={{
          flex: '0 0 40%',
          background: '#0d0d14',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '48px 40px',
        }}>
          {/* Subtle top border accent */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), rgba(194,24,24,0.3), transparent)',
          }} />

          <div style={{ width: '100%', maxWidth: 360 }}>

            {mode === 'login' ? (
              <>
                <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 28, color: '#e8e8ec', marginBottom: 6, lineHeight: 1.2 }}>
                  Welcome Back
                </div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 13, color: '#888899', marginBottom: 36, letterSpacing: '0.03em' }}>
                  Sign in to your admin account
                </div>

                <form onSubmit={handleLogin}>
                  {/* Email */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', color: '#888899', textTransform: 'uppercase', marginBottom: 8 }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                      required
                      autoComplete="email"
                      placeholder="admin@example.com"
                      style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10,
                        color: '#e8e8ec', padding: '13px 16px', width: '100%', fontFamily: 'var(--font-inter)', fontSize: 14,
                        outline: 'none', boxSizing: 'border-box', transition: 'box-shadow 0.2s',
                        boxShadow: emailFocus ? '0 0 0 2px rgba(212,175,55,0.25), inset 0 0 0 1px rgba(212,175,55,0.2)' : 'none',
                      }}
                    />
                  </div>

                  {/* Password */}
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', color: '#888899', textTransform: 'uppercase', marginBottom: 8 }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setPassFocus(true)}
                      onBlur={() => setPassFocus(false)}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10,
                        color: '#e8e8ec', padding: '13px 16px', width: '100%', fontFamily: 'var(--font-inter)', fontSize: 14,
                        outline: 'none', boxSizing: 'border-box', transition: 'box-shadow 0.2s',
                        boxShadow: passFocus ? '0 0 0 2px rgba(212,175,55,0.25), inset 0 0 0 1px rgba(212,175,55,0.2)' : 'none',
                      }}
                    />
                  </div>

                  {/* Forgot password link */}
                  <div style={{ textAlign: 'right', marginBottom: 24 }}>
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setResetEmail(email); setResetError(null); setResetSent(false); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)', fontSize: 11, color: '#D4AF37', letterSpacing: '0.04em', padding: 0 }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Error */}
                  {error && (
                    <div style={{ background: 'rgba(194,24,24,0.1)', border: '1px solid rgba(194,24,24,0.3)', borderRadius: 20, padding: '10px 18px', marginBottom: 20, fontFamily: 'var(--font-inter)', fontSize: 13, color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15 }}>⚠</span>{error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                    style={{
                      background: loading ? 'rgba(100,10,10,0.5)' : btnHover ? 'linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)' : 'linear-gradient(135deg, #C21818 0%, #8b0f0f 100%)',
                      color: '#fff', border: 'none', borderRadius: 10, padding: '14px 20px', width: '100%',
                      fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.08em',
                      cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.25s, box-shadow 0.25s',
                      boxShadow: btnHover && !loading ? '0 4px 20px rgba(212,175,55,0.3)' : '0 4px 16px rgba(194,24,24,0.3)',
                    }}
                  >
                    {loading ? 'SIGNING IN…' : 'SIGN IN'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <button
                  onClick={() => setMode('login')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)', fontSize: 12, color: '#888899', letterSpacing: '0.04em', padding: 0, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  ← Back to sign in
                </button>

                <div style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 26, color: '#e8e8ec', marginBottom: 6, lineHeight: 1.2 }}>
                  Reset Password
                </div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: 13, color: '#888899', marginBottom: 32, letterSpacing: '0.03em' }}>
                  Enter your admin email — we&apos;ll send a reset link.
                </div>

                {resetSent ? (
                  <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, padding: '20px 22px' }}>
                    <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 13, color: '#22c55e', marginBottom: 6 }}>✓ Reset link sent!</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#888899', lineHeight: 1.6 }}>
                      Check your inbox at <strong style={{ color: '#e8e8ec' }}>{resetEmail}</strong>.<br />
                      The link expires in 1 hour. Check your spam folder if you don&apos;t see it.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword}>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', color: '#888899', textTransform: 'uppercase', marginBottom: 8 }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={e => setResetEmail(e.target.value)}
                        required
                        autoComplete="email"
                        placeholder="admin@example.com"
                        style={{
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10,
                          color: '#e8e8ec', padding: '13px 16px', width: '100%', fontFamily: 'var(--font-inter)', fontSize: 14,
                          outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {resetError && (
                      <div style={{ background: 'rgba(194,24,24,0.1)', border: '1px solid rgba(194,24,24,0.3)', borderRadius: 20, padding: '10px 18px', marginBottom: 20, fontFamily: 'var(--font-inter)', fontSize: 13, color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>⚠</span>{resetError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={resetLoading}
                      style={{
                        background: resetLoading ? 'rgba(100,100,20,0.5)' : 'linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)',
                        color: '#000', border: 'none', borderRadius: 10, padding: '14px 20px', width: '100%',
                        fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.08em',
                        cursor: resetLoading ? 'not-allowed' : 'pointer', transition: 'background 0.25s',
                        boxShadow: '0 4px 20px rgba(212,175,55,0.25)',
                      }}
                    >
                      {resetLoading ? 'SENDING…' : 'SEND RESET LINK'}
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Footer text */}
            <div style={{ marginTop: 32, textAlign: 'center', fontFamily: 'var(--font-montserrat)', fontSize: 11, color: '#333344', letterSpacing: '0.06em' }}>
              Secure admin portal · RCC
            </div>
          </div>
        </div>

        {/* Mobile responsive styles */}
        <style>{`
          @media (max-width: 768px) {
            .rcc-left-panel { display: none !important; }
            .rcc-right-panel {
              flex: 1 !important;
              width: 100% !important;
              padding: 24px 20px !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
