'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Plus, Trash2, ChevronUp, ChevronDown, Copy, Save, Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type FieldType = 'text' | 'number' | 'email' | 'phone' | 'select' | 'radio' | 'checkbox' | 'textarea';

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface RccForm {
  id: string;
  title: string;
  slug: string;
  description: string;
  fields: FormField[];
  active: boolean;
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Short Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkboxes' },
];

function hasOptions(type: FieldType) {
  return type === 'select' || type === 'radio' || type === 'checkbox';
}

function FieldPreview({ field }: { field: FormField }) {
  const inputClass = 'bg-[#050810] border border-white/10 rounded-lg px-3 py-2 text-white/50 text-sm w-full pointer-events-none';
  return (
    <div className="mb-4">
      <label className="block text-white/70 text-sm mb-1.5">
        {field.label || 'Untitled field'}
        {field.required && <span className="text-[#C21818] ml-1">*</span>}
      </label>
      {field.type === 'textarea' ? (
        <textarea className={`${inputClass} h-20 resize-none`} placeholder={field.placeholder || ''} readOnly />
      ) : field.type === 'select' ? (
        <select className={inputClass} disabled>
          <option>{field.placeholder || 'Select an option'}</option>
          {(field.options || []).map((o, i) => <option key={i}>{o}</option>)}
        </select>
      ) : field.type === 'radio' ? (
        <div className="space-y-2">
          {(field.options || []).map((o, i) => (
            <label key={i} className="flex items-center gap-2 text-white/60 text-sm cursor-not-allowed">
              <input type="radio" disabled className="accent-[#C21818]" />
              {o}
            </label>
          ))}
        </div>
      ) : field.type === 'checkbox' ? (
        <div className="space-y-2">
          {(field.options || []).map((o, i) => (
            <label key={i} className="flex items-center gap-2 text-white/60 text-sm cursor-not-allowed">
              <input type="checkbox" disabled className="accent-[#C21818]" />
              {o}
            </label>
          ))}
        </div>
      ) : (
        <input type={field.type} className={inputClass} placeholder={field.placeholder || ''} readOnly />
      )}
    </div>
  );
}

export default function FormEditorPage() {
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<RccForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadForm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadForm() {
    setLoading(true);
    const { data, error } = await supabase.from('rcc_forms').select('*').eq('id', id).single();
    if (!error && data) setForm(data as RccForm);
    setLoading(false);
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    setSaveError('');
    const { error } = await supabase
      .from('rcc_forms')
      .update({ title: form.title, description: form.description, fields: form.fields as unknown as Record<string, unknown>[], active: form.active })
      .eq('id', form.id);
    if (error) setSaveError(error.message);
    else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  function addField() {
    if (!form) return;
    const newField: FormField = { id: newId(), type: 'text', label: '', required: false, placeholder: '', options: [] };
    setForm({ ...form, fields: [...form.fields, newField] });
  }

  function updateField(id: string, updates: Partial<FormField>) {
    if (!form) return;
    setForm({ ...form, fields: form.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)) });
  }

  function deleteField(id: string) {
    if (!form) return;
    setForm({ ...form, fields: form.fields.filter((f) => f.id !== id) });
  }

  function moveField(index: number, dir: -1 | 1) {
    if (!form) return;
    const fields = [...form.fields];
    const target = index + dir;
    if (target < 0 || target >= fields.length) return;
    [fields[index], fields[target]] = [fields[target], fields[index]];
    setForm({ ...form, fields });
  }

  function copyPublicLink() {
    if (!form) return;
    navigator.clipboard.writeText(`${window.location.origin}/forms/${form.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#C21818]" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40">Form not found.</p>
        <Link href="/admin/forms" className="text-[#C21818] text-sm mt-2 inline-block">← Back to Forms</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/forms" className="text-white/40 hover:text-white transition-colors text-sm">← Forms</Link>
          <span className="text-white/20">/</span>
          <span className="text-white font-bold truncate">{form.title || 'Untitled Form'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyPublicLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold tracking-widest uppercase bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            {copied ? <CheckCircle size={12} className="text-[#D9FF00]" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <a
            href={`/forms/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold tracking-widest uppercase bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <ExternalLink size={12} />
            Preview
          </a>
          <Link
            href={`/admin/forms/${id}/responses`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold tracking-widest uppercase bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            Responses
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-bold rounded-lg text-xs tracking-widest uppercase disabled:opacity-50"
          >
            {saved ? <CheckCircle size={12} /> : <Save size={12} />}
            {saved ? 'Saved' : saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="bg-[#C21818]/10 border border-[#C21818]/30 rounded-lg px-4 py-3 text-[#C21818] text-sm mb-4">
          {saveError}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Editor */}
        <div className="lg:w-[55%] space-y-4">
          {/* Form metadata */}
          <div className="bg-[#0A0E1A] border border-white/10 rounded-xl p-5">
            <div className="text-white/60 text-xs tracking-widest uppercase mb-4">Form Details</div>
            <div className="space-y-3">
              <div>
                <label className="block text-white/60 text-xs tracking-widest uppercase mb-1.5">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="bg-[#0F1520] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none w-full"
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs tracking-widest uppercase mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="bg-[#0F1520] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none w-full resize-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs tracking-widest uppercase">Active</span>
                <button
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${form.active ? 'bg-[#D9FF00]' : 'bg-white/10'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 ${form.active ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="bg-[#0A0E1A] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white/60 text-xs tracking-widest uppercase">Fields ({form.fields.length})</div>
            </div>

            {form.fields.length === 0 && (
              <div className="text-center py-8 text-white/20 text-sm">No fields yet. Add your first field below.</div>
            )}

            {form.fields.map((field, index) => (
              <div key={field.id} className="bg-[#0F1520] border border-white/10 rounded-xl p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveField(index, -1)} disabled={index === 0} className="p-1 text-white/30 hover:text-white disabled:opacity-20 transition-colors">
                      <ChevronUp size={14} />
                    </button>
                    <button onClick={() => moveField(index, 1)} disabled={index === form.fields.length - 1} className="p-1 text-white/30 hover:text-white disabled:opacity-20 transition-colors">
                      <ChevronDown size={14} />
                    </button>
                    <span className="text-white/30 text-xs">#{index + 1}</span>
                  </div>
                  <button onClick={() => deleteField(field.id)} className="p-1.5 text-white/30 hover:text-[#C21818] transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-white/40 text-xs tracking-widest uppercase mb-1.5">Field Type</label>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, { type: e.target.value as FieldType, options: hasOptions(e.target.value as FieldType) ? (field.options?.length ? field.options : ['Option 1']) : [] })}
                      className="bg-[#050810] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none w-full"
                    >
                      {FIELD_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs tracking-widest uppercase mb-1.5">Label</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="Field label"
                      className="bg-[#050810] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  {!hasOptions(field.type) && (
                    <div>
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1.5">Placeholder</label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        className="bg-[#050810] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none w-full"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-auto">
                    <label className="text-white/40 text-xs tracking-widest uppercase">Required</label>
                    <button
                      onClick={() => updateField(field.id, { required: !field.required })}
                      className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${field.required ? 'bg-[#C21818]' : 'bg-white/10'}`}
                    >
                      <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-200 ${field.required ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>

                {hasOptions(field.type) && (
                  <div>
                    <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">Options</label>
                    {(field.options || []).map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const opts = [...(field.options || [])];
                            opts[oi] = e.target.value;
                            updateField(field.id, { options: opts });
                          }}
                          className="bg-[#050810] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:border-[#C21818] outline-none flex-1"
                        />
                        <button
                          onClick={() => {
                            const opts = (field.options || []).filter((_, i) => i !== oi);
                            updateField(field.id, { options: opts });
                          }}
                          className="p-1 text-white/30 hover:text-[#C21818] transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => updateField(field.id, { options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`] })}
                      className="text-xs text-white/40 hover:text-[#D4AF37] transition-colors flex items-center gap-1"
                    >
                      <Plus size={11} /> Add option
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={addField}
              className="w-full py-2.5 border border-dashed border-white/20 text-white/50 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-lg text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Plus size={14} /> Add Field
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:w-[45%]">
          <div className="bg-[#0A0E1A] border border-white/10 rounded-xl p-5 sticky top-20">
            <div className="text-white/60 text-xs tracking-widest uppercase mb-4">Live Preview</div>
            <div className="bg-[#050810] border border-white/5 rounded-xl p-5">
              <h2 className="text-white font-black text-lg mb-1">{form.title || 'Untitled Form'}</h2>
              {form.description && <p className="text-white/40 text-sm mb-5">{form.description}</p>}
              <div className={!form.description ? 'mt-4' : ''}>
                {form.fields.map((field) => (
                  <FieldPreview key={field.id} field={field} />
                ))}
              </div>
              {form.fields.length > 0 && (
                <button className="w-full py-3 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-bold rounded-lg text-sm tracking-widest uppercase mt-2 opacity-60 cursor-not-allowed">
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
