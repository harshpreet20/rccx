'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import { Trophy, FileText, LogOut, Loader2, LayoutDashboard, ShoppingBag } from 'lucide-react';

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
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(194,24,24,0.12) 0%, #050810 60%)' }}
    >
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
      }} />

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="text-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/rcc-logo.png" alt="RCC" width={72} height={72} className="mx-auto mb-5"
            style={{ filter: 'drop-shadow(0 0 24px rgba(212,175,55,0.35))' }} />
          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '22px', letterSpacing: '0.18em', color: '#ffffff', textTransform: 'uppercase', marginBottom: '6px' }}>
            Admin Portal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Authorized Personnel Only
          </p>
          <div style={{ margin: '16px auto 0', width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '32px', backdropFilter: 'blur(24px)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}>
          {error && (
            <div style={{
              background: 'rgba(194,24,24,0.08)', border: '1px solid rgba(194,24,24,0.3)',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              color: '#f87171', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ fontSize: '16px' }}>⚠</span>{error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: 'Email Address', type: 'email', val: email, set: setEmail, ph: 'admin@racquetsclubcommunity.com' },
              { label: 'Password', type: 'password', val: password, set: setPassword, ph: '••••••••••••' },
            ].map(({ label, type, val, set, ph }) => (
              <div key={label}>
                <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '10px', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</label>
                <input type={type} value={val} onChange={e => set(e.target.value)} required placeholder={ph}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'var(--font-inter)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            ))}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', marginTop: '4px',
              background: loading ? 'rgba(194,24,24,0.4)' : 'linear-gradient(135deg, #C21818 0%, #8B0000 100%)',
              border: '1px solid rgba(194,24,24,0.4)', borderRadius: '10px', color: '#ffffff',
              fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: '12px', letterSpacing: '0.18em',
              textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(194,24,24,0.3)',
            }}>
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

  const navItems = [
    { href: '/admin/tournament', label: 'Tournament', icon: Trophy },
    { href: '/admin/forms', label: 'Forms', icon: FileText },
    { href: '/admin/store', label: 'Store', icon: ShoppingBag },
    { href: '/enter/backend', label: 'Dashboard', icon: LayoutDashboard },
  ];

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <header style={{
      background: 'rgba(5,8,16,0.95)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      position: 'sticky', top: 0, zIndex: 40,
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        {/* Left: logo + nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link href="/admin/tournament" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/rcc-logo.png" alt="RCC" width={32} height={32} style={{ objectFit: 'contain' }} />
            <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '13px', letterSpacing: '0.14em', color: '#D4AF37', textTransform: 'uppercase' }}>
              RCC Admin
            </span>
          </Link>

          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />

          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname?.startsWith(href);
              return (
                <Link key={href} href={href} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8, textDecoration: 'none',
                  fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em',
                  textTransform: 'uppercase', transition: 'all 0.15s',
                  background: active ? 'rgba(194,24,24,0.15)' : 'transparent',
                  color: active ? '#C21818' : 'rgba(255,255,255,0.45)',
                  border: active ? '1px solid rgba(194,24,24,0.25)' : '1px solid transparent',
                }}>
                  <Icon size={12} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: sign out */}
        <button onClick={handleSignOut} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 8, border: '1px solid transparent',
          fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', background: 'none',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
          onMouseOver={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.borderColor = 'transparent'; }}
        >
          <LogOut size={12} />
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
          <Loader2 size={28} className="animate-spin text-[#C21818]" />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Checking auth…</p>
        </div>
      </div>
    );
  }

  if (!user || !isOrganizer) return <LoginForm />;

  return (
    <div className="min-h-screen bg-[#050810]">
      <AdminHeader />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px' }}>{children}</main>
    </div>
  );
}
