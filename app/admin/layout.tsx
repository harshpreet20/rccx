'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import { Trophy, FileText, LogOut, Loader2 } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) setError(authError.message);
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(194,24,24,0.12) 0%, #050810 60%)',
      }}
    >
      {/* Decorative grid */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
        }}
      />

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Logo block */}
        <div className="text-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/rcc-logo.png"
            alt="RCC"
            width={72}
            height={72}
            className="mx-auto mb-5"
            style={{ filter: 'drop-shadow(0 0 24px rgba(212,175,55,0.35))' }}
          />
          <h1
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 900,
              fontSize: '22px',
              letterSpacing: '0.18em',
              color: '#ffffff',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            Admin Portal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Authorized Personnel Only
          </p>
          {/* Gold divider */}
          <div style={{ margin: '16px auto 0', width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
        </div>

        {/* Card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '32px',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {error && (
            <div
              style={{
                background: 'rgba(194,24,24,0.08)',
                border: '1px solid rgba(194,24,24,0.3)',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '20px',
                color: '#f87171',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '16px' }}>⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@racquetsclubcommunity.com"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-inter)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-inter)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading
                  ? 'rgba(194,24,24,0.4)'
                  : 'linear-gradient(135deg, #C21818 0%, #8B0000 100%)',
                border: '1px solid rgba(194,24,24,0.4)',
                borderRadius: '10px',
                color: '#ffffff',
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 800,
                fontSize: '12px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'opacity 0.2s, transform 0.1s',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(194,24,24,0.3)',
                marginTop: '4px',
              }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
              onMouseOut={e => { e.currentTarget.style.opacity = '1'; }}
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : null}
              {loading ? 'Authenticating…' : 'Access Portal'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'rgba(255,255,255,0.15)', fontSize: '11px', letterSpacing: '0.08em' }}>
          Racquets Club Community · Internal System
        </p>
      </div>
    </div>
  );
}

function AdminHeader() {
  const pathname = usePathname();

  const links = [
    { href: '/admin/tournament', label: 'Tournament', icon: Trophy },
    { href: '/admin/forms', label: 'Forms', icon: FileText },
  ];

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <header className="bg-[#0A0E1A] border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <span className="text-white font-black text-sm tracking-widest uppercase text-[#D4AF37]">
            RCC Admin
          </span>
          <nav className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200 ${
                  pathname?.startsWith(href)
                    ? 'bg-[#C21818]/20 text-[#C21818] border border-[#C21818]/30'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={13} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isOrganizer, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-[#C21818]" />
          <p className="text-white/40 text-sm tracking-widest uppercase">Checking auth…</p>
        </div>
      </div>
    );
  }

  if (!user || !isOrganizer) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-[#050810]">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}
