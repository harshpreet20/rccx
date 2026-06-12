'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Plus, Trash2, ChevronUp, ChevronDown, Copy, Save, Loader2, CheckCircle, ExternalLink, ArrowLeft } from 'lucide-react';
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

const inp: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none',
  boxSizing: 'border-box', fontFamily: 'var(--font-inter)', colorScheme: 'dark',
};

const inpFocus = 'rgba(212,175,55,0.45)';
const inpBlur = 'rgba(255,255,255,0.1)';

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 10, letterSpacing: '0.13em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 6 }}>
      {children}
    </div>
  );
}

function FieldPreview({ field }: { field: FormField }) {
  const previewInp: React.CSSProperties = {
    background: 'rgba(5,8,16,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
    padding: '8px 12px', color: 'rgba(255,255,255,0.3)', fontSize: 13, width: '100%',
    boxSizing: 'border-box', fontFamily: 'var(--font-inter)', pointerEvents: 'none',
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 13, marginBottom: 6, fontFamily: 'var(--font-inter)' }}>
        {field.label || 'Untitled field'}
        {field.required && <span style={{ color: '#C21818', marginLeft: 4 }}>*</span>}
      </label>
      {field.type === 'textarea' ? (
        <textarea style={{ ...previewInp, height: 72, resize: 'none' }} placeholder={field.placeholder || ''} readOnly />
      ) : field.type === 'select' ? (
        <select style={previewInp} disabled>
          <option>{field.placeholder || 'Select an option'}</option>
          {(field.options || []).map((o, i) => <option key={i}>{o}</option>)}
        </select>
      ) : field.type === 'radio' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(field.options || []).map((o, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'not-allowed', fontFamily: 'var(--font-inter)' }}>
              <input type="radio" disabled style={{ accentColor: '#C21818' }} /> {o}
            </label>
          ))}
        </div>
      ) : field.type === 'checkbox' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(field.options || []).map((o, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'not-allowed', fontFamily: 'var(--font-inter)' }}>
              <input type="checkbox" disabled style={{ accentColor: '#C21818' }} /> {o}
            </label>
          ))}
        </div>
      ) : (
        <input type={field.type} style={previewInp} placeholder={field.placeholder || ''} readOnly />
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

  function updateField(fid: string, updates: Partial<FormField>) {
    if (!form) return;
    setForm({ ...form, fields: form.fields.map((f) => (f.id === fid ? { ...f, ...updates } : f)) });
  }

  function deleteField(fid: string) {
    if (!form) return;
    setForm({ ...form, fields: form.fields.filter((f) => f.id !== fid) });
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
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'rgba(255,255,255,0.3)' }} />
      </div>
    );
  }

  if (!form) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 12 }}>Form not found.</p>
        <Link href="/admin/forms" style={{ color: '#C21818', fontSize: 13, textDecoration: 'none' }}>← Back to Forms</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Sticky top bar */}
      <div style={{
        position: 'sticky', top: 56, zIndex: 30,
        background: 'rgba(5,8,16,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        margin: '-28px -24px 28px', padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <Link href="/admin/forms" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
          <ArrowLeft size={14} /> Forms
        </Link>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 14, color: '#fff', letterSpacing: '0.04em' }}>
          {form.title || 'Untitled Form'}
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={copyPublicLink}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: copied ? '#D9FF00' : 'rgba(255,255,255,0.5)',
            cursor: 'pointer', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11,
            letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.15s',
          }}
        >
          {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        <a
          href={`/forms/${form.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11,
            letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
            transition: 'all 0.15s',
          }}
        >
          <ExternalLink size={12} /> Preview
        </a>
        <Link
          href={`/admin/forms/${id}/responses`}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11,
            letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
          }}
        >
          Responses
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px',
            background: saved ? 'rgba(74,222,128,0.15)' : 'linear-gradient(135deg, #C21818, #8B0000)',
            border: saved ? '1px solid rgba(74,222,128,0.3)' : 'none',
            borderRadius: 9, color: saved ? '#4ade80' : '#fff', cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
            boxShadow: saved ? 'none' : '0 4px 16px rgba(194,24,24,0.3)', opacity: saving ? 0.7 : 1,
          }}
        >
          {saved ? <><CheckCircle size={13} /> Saved</> : saving ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : <><Save size={13} /> Save</>}
        </button>
      </div>

      {saveError && (
        <div style={{ background: 'rgba(194,24,24,0.1)', border: '1px solid rgba(194,24,24,0.25)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 16 }}>
          {saveError}
        </div>
      )}

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Editor */}
        <div style={{ flex: '0 0 55%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Form metadata */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 16 }}>
              Form Details
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <SLabel>Title</SLabel>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={inp}
                  onFocus={e => (e.currentTarget.style.borderColor = inpFocus)}
                  onBlur={e => (e.currentTarget.style.borderColor = inpBlur)}
                />
              </div>
              <div>
                <SLabel>Description</SLabel>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  style={{ ...inp, resize: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderColor = inpFocus)}
                  onBlur={e => (e.currentTarget.style.borderColor = inpBlur)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <SLabel>Active</SLabel>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, active: !form.active })}
                  style={{
                    position: 'relative', width: 38, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer', flexShrink: 0,
                    background: form.active ? '#D9FF00' : 'rgba(255,255,255,0.1)', transition: 'background 0.2s',
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 2, width: 16, height: 16,
                    background: form.active ? '#050810' : '#fff', borderRadius: '50%',
                    transition: 'left 0.2s', left: form.active ? 20 : 2,
                  }} />
                </button>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                Fields ({form.fields.length})
              </div>
            </div>

            {form.fields.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
                No fields yet. Add your first field below.
              </div>
            )}

            {form.fields.map((field, index) => (
              <div key={field.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px', marginBottom: 10 }}>
                {/* Field header controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button onClick={() => moveField(index, -1)} disabled={index === 0}
                      style={{ padding: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', opacity: index === 0 ? 0.2 : 1 }}>
                      <ChevronUp size={14} />
                    </button>
                    <button onClick={() => moveField(index, 1)} disabled={index === form.fields.length - 1}
                      style={{ padding: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', opacity: index === form.fields.length - 1 ? 0.2 : 1 }}>
                      <ChevronDown size={14} />
                    </button>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginLeft: 4 }}>#{index + 1}</span>
                  </div>
                  <button onClick={() => deleteField(field.id)}
                    style={{ padding: 6, background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'color 0.15s' }}
                    onMouseOver={e => (e.currentTarget.style.color = '#C21818')}
                    onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div>
                    <SLabel>Field Type</SLabel>
                    <select value={field.type}
                      onChange={(e) => updateField(field.id, { type: e.target.value as FieldType, options: hasOptions(e.target.value as FieldType) ? (field.options?.length ? field.options : ['Option 1']) : [] })}
                      style={{ ...inp }}
                      onFocus={e => (e.currentTarget.style.borderColor = inpFocus)}
                      onBlur={e => (e.currentTarget.style.borderColor = inpBlur)}
                    >
                      {FIELD_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <SLabel>Label</SLabel>
                    <input type="text" value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="Field label"
                      style={inp}
                      onFocus={e => (e.currentTarget.style.borderColor = inpFocus)}
                      onBlur={e => (e.currentTarget.style.borderColor = inpBlur)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: !hasOptions(field.type) ? '1fr 1fr' : '1fr', gap: 10, marginBottom: hasOptions(field.type) ? 10 : 0 }}>
                  {!hasOptions(field.type) && (
                    <div>
                      <SLabel>Placeholder</SLabel>
                      <input type="text" value={field.placeholder || ''}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        style={inp}
                        onFocus={e => (e.currentTarget.style.borderColor = inpFocus)}
                        onBlur={e => (e.currentTarget.style.borderColor = inpBlur)}
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
                    <SLabel>Required</SLabel>
                    <button type="button"
                      onClick={() => updateField(field.id, { required: !field.required })}
                      style={{
                        position: 'relative', width: 32, height: 17, borderRadius: 10, border: 'none', cursor: 'pointer',
                        background: field.required ? '#C21818' : 'rgba(255,255,255,0.1)', transition: 'background 0.2s', flexShrink: 0,
                      }}
                    >
                      <span style={{
                        position: 'absolute', top: 2, width: 13, height: 13, background: '#fff', borderRadius: '50%',
                        transition: 'left 0.2s', left: field.required ? 17 : 2,
                      }} />
                    </button>
                  </div>
                </div>

                {hasOptions(field.type) && (
                  <div>
                    <SLabel>Options</SLabel>
                    {(field.options || []).map((opt, oi) => (
                      <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <input type="text" value={opt}
                          onChange={(e) => {
                            const opts = [...(field.options || [])];
                            opts[oi] = e.target.value;
                            updateField(field.id, { options: opts });
                          }}
                          style={{ ...inp, flex: 1 }}
                          onFocus={e => (e.currentTarget.style.borderColor = inpFocus)}
                          onBlur={e => (e.currentTarget.style.borderColor = inpBlur)}
                        />
                        <button onClick={() => {
                          const opts = (field.options || []).filter((_, i) => i !== oi);
                          updateField(field.id, { options: opts });
                        }}
                          style={{ padding: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'color 0.15s' }}
                          onMouseOver={e => (e.currentTarget.style.color = '#C21818')}
                          onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => updateField(field.id, { options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`] })}
                      style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', transition: 'color 0.15s', fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                      onMouseOver={e => (e.currentTarget.style.color = '#D4AF37')}
                      onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                    >
                      <Plus size={11} /> Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={addField}
              style={{
                width: '100%', padding: '10px', borderRadius: 8, border: '1px dashed rgba(255,255,255,0.15)',
                background: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 11,
                fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s', marginTop: 4,
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; e.currentTarget.style.color = '#D4AF37'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
            >
              <Plus size={13} /> Add Field
            </button>
          </div>
        </div>

        {/* Preview */}
        <div style={{ flex: 1, minWidth: 0, position: 'sticky', top: 112 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 16 }}>
              Live Preview
            </div>
            <div style={{ background: 'rgba(5,8,16,0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 18, color: '#fff', marginBottom: 6 }}>
                {form.title || 'Untitled Form'}
              </h2>
              {form.description && (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 20, fontFamily: 'var(--font-inter)' }}>
                  {form.description}
                </p>
              )}
              <div style={{ marginTop: form.description ? 0 : 16 }}>
                {form.fields.map((field) => (
                  <FieldPreview key={field.id} field={field} />
                ))}
              </div>
              {form.fields.length > 0 && (
                <button style={{
                  width: '100%', padding: '12px', background: 'linear-gradient(135deg, #C21818, #8B0000)',
                  border: 'none', borderRadius: 8, color: '#fff',
                  fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 12,
                  letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'not-allowed', opacity: 0.6, marginTop: 8,
                }}>
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
