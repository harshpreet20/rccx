'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, BarChart2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RccForm {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  fields: unknown[];
  active: boolean;
  created_at: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const inp: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '10px 14px', color: '#e8e8ec', fontSize: 14, outline: 'none',
  boxSizing: 'border-box', fontFamily: 'var(--font-inter)',
};

export default function FormsPage() {
  const [forms, setForms] = useState<RccForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    loadForms();
  }, []);

  async function loadForms() {
    setLoading(true);
    const { data, error } = await supabase
      .from('rcc_forms')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setForms(data as RccForm[]);
    setLoading(false);
  }

  async function toggleActive(form: RccForm) {
    const { error } = await supabase.from('rcc_forms').update({ active: !form.active }).eq('id', form.id);
    if (!error) setForms((prev) => prev.map((f) => (f.id === form.id ? { ...f, active: !f.active } : f)));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    setCreateError('');
    const slug = newSlug.trim() || slugify(newTitle);
    const { data, error } = await supabase
      .from('rcc_forms')
      .insert({ title: newTitle.trim(), slug, description: '', fields: [], active: true })
      .select()
      .single();
    if (error) {
      setCreateError(error.message);
      setCreating(false);
      return;
    }
    setForms((prev) => [data as RccForm, ...prev]);
    setShowModal(false);
    setNewTitle('');
    setNewSlug('');
    setCreating(false);
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 26, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
            Forms &amp; Surveys
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
            {forms.length} form{forms.length !== 1 ? 's' : ''}
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
          <Plus size={14} /> Create New Form
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Loader2 size={24} className="animate-spin" style={{ color: 'rgba(255,255,255,0.3)' }} />
        </div>
      ) : forms.length === 0 ? (
        <div style={{
          border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16,
          padding: '60px 32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>📋</div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 20 }}>
            No forms yet. Create your first form to get started.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {forms.map((form) => (
            <div key={form.id} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '18px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              transition: 'all 0.2s',
            }}
              onMouseOver={e => {
                (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(212,175,55,0.2)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 14, color: '#fff', margin: 0, letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {form.title}
                  </h3>
                  <span style={{
                    fontSize: 9, padding: '2px 8px', borderRadius: 10,
                    fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: form.active ? 'rgba(217,255,0,0.1)' : 'rgba(255,255,255,0.05)',
                    color: form.active ? '#D9FF00' : 'rgba(255,255,255,0.3)',
                  }}>
                    {form.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                  <span>/forms/{form.slug}</span>
                  <span style={{ opacity: 0.4 }}>·</span>
                  <span>{Array.isArray(form.fields) ? form.fields.length : 0} field{Array.isArray(form.fields) && form.fields.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => toggleActive(form)}
                  title={form.active ? 'Deactivate' : 'Activate'}
                  style={{
                    width: 34, height: 34, borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'none', color: form.active ? '#D9FF00' : 'rgba(255,255,255,0.3)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'none'; }}
                >
                  {form.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
                <Link
                  href={`/admin/forms/${form.id}/responses`}
                  title="View responses"
                  style={{
                    width: 34, height: 34, borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'none', color: 'rgba(255,255,255,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLAnchorElement).style.background = 'none'; }}
                >
                  <BarChart2 size={15} />
                </Link>
                <Link
                  href={`/admin/forms/${form.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px', borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11,
                    letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'; }}
                >
                  <Edit2 size={11} /> Edit
                </Link>
              </div>
            </div>
          ))}
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
              Create New Form
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 24 }}>
              Give your form a title and a URL slug.
            </p>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {createError && (
                <div style={{ background: 'rgba(194,24,24,0.1)', border: '1px solid rgba(194,24,24,0.25)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13 }}>
                  {createError}
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Form Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) setNewSlug(slugify(e.target.value));
                  }}
                  required
                  placeholder="e.g. RCC Tournament Registration"
                  autoFocus
                  style={inp}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                  URL Slug
                </label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRight: 'none', borderRadius: '8px 0 0 8px', whiteSpace: 'nowrap' }}>
                    /forms/
                  </span>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(slugify(e.target.value))}
                    required
                    placeholder="tournament-registration"
                    style={{ ...inp, borderRadius: '0 8px 8px 0', flex: 1 }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                  fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>Cancel</button>
                <button type="submit" disabled={creating || !newTitle.trim()} style={{
                  flex: 2, padding: '12px', background: 'linear-gradient(135deg, #C21818, #8B0000)',
                  border: 'none', borderRadius: 10, color: '#fff', cursor: creating ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: (creating || !newTitle.trim()) ? 0.6 : 1,
                }}>
                  {creating && <Loader2 size={13} className="animate-spin" />}
                  {creating ? 'Creating…' : 'Create Form'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
