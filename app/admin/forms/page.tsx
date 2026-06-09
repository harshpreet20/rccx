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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-black text-2xl tracking-widest uppercase">Forms & Surveys</h1>
          <p className="text-white/40 text-sm mt-1">{forms.length} form{forms.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-bold rounded-lg text-sm tracking-widest uppercase transition-all hover:shadow-[0_0_20px_rgba(194,24,24,0.4)]"
        >
          <Plus size={14} />
          Create New Form
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-[#C21818]" />
        </div>
      ) : forms.length === 0 ? (
        <div className="bg-[#0A0E1A] border border-white/10 rounded-xl p-12 text-center">
          <div className="text-white/20 text-5xl mb-4">📋</div>
          <div className="text-white/40 text-sm tracking-wide">No forms yet. Create your first form to get started.</div>
        </div>
      ) : (
        <div className="grid gap-4">
          {forms.map((form) => (
            <div key={form.id} className="bg-[#0A0E1A] border border-white/10 rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-base truncate">{form.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold tracking-widest uppercase ${form.active ? 'bg-[#D9FF00]/10 text-[#D9FF00]' : 'bg-white/5 text-white/30'}`}>
                    {form.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/30 text-xs">
                  <span>/forms/{form.slug}</span>
                  <span>·</span>
                  <span>{Array.isArray(form.fields) ? form.fields.length : 0} field{Array.isArray(form.fields) && form.fields.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleActive(form)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
                  title={form.active ? 'Deactivate' : 'Activate'}
                >
                  {form.active ? <ToggleRight size={18} className="text-[#D9FF00]" /> : <ToggleLeft size={18} />}
                </button>
                <Link
                  href={`/admin/forms/${form.id}/responses`}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
                  title="View responses"
                >
                  <BarChart2 size={16} />
                </Link>
                <Link
                  href={`/admin/forms/${form.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Edit2 size={12} />
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#0A0E1A] border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-white font-black text-lg tracking-widest uppercase mb-5">Create New Form</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              {createError && (
                <div className="bg-[#C21818]/10 border border-[#C21818]/30 rounded-lg px-4 py-3 text-[#C21818] text-sm">
                  {createError}
                </div>
              )}
              <div>
                <label className="block text-white/60 text-xs tracking-widest uppercase mb-1.5">Form Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) setNewSlug(slugify(e.target.value));
                  }}
                  required
                  placeholder="e.g. RCC Tournament Registration"
                  className="bg-[#0F1520] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none w-full"
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs tracking-widest uppercase mb-1.5">URL Slug</label>
                <div className="flex items-center">
                  <span className="text-white/30 text-sm px-3 py-2 bg-[#0F1520] border border-r-0 border-white/10 rounded-l-lg">/forms/</span>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(slugify(e.target.value))}
                    required
                    placeholder="tournament-registration"
                    className="bg-[#0F1520] border border-white/10 rounded-r-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none flex-1"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-white/10 text-white/50 font-bold rounded-lg text-sm tracking-widest uppercase hover:text-white hover:border-white/30 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-bold rounded-lg text-sm tracking-widest uppercase disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating && <Loader2 size={14} className="animate-spin" />}
                  {creating ? 'Creating…' : 'Create Form'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
