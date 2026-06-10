'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FormField {
  id: string;
  type: string;
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

const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #06080f 0%, #0a0d18 50%, #060810 100%)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
    fontFamily: 'var(--font-inter, system-ui, sans-serif)',
  },
  wrap: {
    width: '100%',
    maxWidth: 480,
  },
  header: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginBottom: 32,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: 'linear-gradient(135deg, #C21818 0%, #8B0000 60%, #D4AF37 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    boxShadow: '0 8px 32px rgba(194,24,24,0.35)',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 900,
    fontSize: 14,
    letterSpacing: '0.08em',
  },
  brand: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.35em',
    color: '#D4AF37',
    textTransform: 'uppercase' as const,
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '32px 28px',
    backdropFilter: 'blur(20px)',
  },
  titleBar: {
    borderLeft: '3px solid #C21818',
    paddingLeft: 14,
    marginBottom: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
    margin: 0,
  },
  desc: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    lineHeight: 1.6,
    marginTop: 6,
    margin: '6px 0 0',
  },
  divider: {
    height: 1,
    background: 'linear-gradient(to right, rgba(212,175,55,0.3), transparent)',
    marginBottom: 24,
  },
  fieldWrap: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
  },
  req: {
    color: '#C21818',
    marginLeft: 3,
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
    colorScheme: 'dark' as const,
  },
  inputError: {
    borderColor: '#C21818',
  },
  errorMsg: {
    fontSize: 11,
    color: '#C21818',
    marginTop: 5,
    letterSpacing: '0.02em',
  },
  selectWrap: {
    position: 'relative' as const,
  },
  selectIcon: {
    position: 'absolute' as const,
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const,
    color: 'rgba(255,255,255,0.4)',
  },
  select: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '12px 36px 12px 14px',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box' as const,
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
    cursor: 'pointer',
    colorScheme: 'dark' as const,
    transition: 'border-color 0.2s',
  },
  optionGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  optionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    transition: 'border-color 0.15s',
  },
  optionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #C21818 0%, #8B0000 100%)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    boxShadow: '0 4px 20px rgba(194,24,24,0.3)',
    transition: 'opacity 0.2s, box-shadow 0.2s',
  },
  submitBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed' as const,
  },
  errBanner: {
    background: 'rgba(194,24,24,0.08)',
    border: '1px solid rgba(194,24,24,0.25)',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#C21818',
    fontSize: 13,
    marginTop: 4,
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: 20,
    fontSize: 11,
    letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.15)',
    textTransform: 'uppercase' as const,
  },
};

function CustomSelect({ value, onChange, options, placeholder, hasError }: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  hasError: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${hasError ? '#C21818' : open ? 'rgba(194,24,24,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 10,
          padding: '12px 36px 12px 14px',
          color: value ? '#fff' : 'rgba(255,255,255,0.35)',
          fontSize: 14,
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          size={15}
          style={{
            color: 'rgba(255,255,255,0.4)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
            flexShrink: 0,
          }}
        />
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          background: '#0d1120',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10,
          overflow: 'hidden',
          zIndex: 100,
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        }}>
          {options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                width: '100%',
                padding: '11px 14px',
                background: value === opt ? 'rgba(194,24,24,0.12)' : 'transparent',
                border: 'none',
                borderBottom: i < options.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                color: value === opt ? '#fff' : 'rgba(255,255,255,0.7)',
                fontSize: 14,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={(e) => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PublicFormPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [form, setForm] = useState<RccForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    loadForm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function loadForm() {
    setLoading(true);
    const { data, error } = await supabase
      .from('rcc_forms')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single();
    if (error || !data) {
      setNotFound(true);
    } else {
      setForm(data as RccForm);
      const init: Record<string, unknown> = {};
      (data as RccForm).fields.forEach((f) => {
        if (f.type === 'checkbox') init[f.label] = [];
      });
      setValues(init);
    }
    setLoading(false);
  }

  function setValue(label: string, value: unknown) {
    setValues((prev) => ({ ...prev, [label]: value }));
    if (errors[label]) setErrors((prev) => { const e = { ...prev }; delete e[label]; return e; });
  }

  function toggleCheckbox(label: string, option: string) {
    const current = (values[label] as string[]) || [];
    const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
    setValue(label, next);
  }

  function validate(): boolean {
    if (!form) return false;
    const newErrors: Record<string, string> = {};
    form.fields.forEach((field) => {
      if (!field.required) return;
      const v = values[field.label];
      if (field.type === 'checkbox') {
        if (!Array.isArray(v) || v.length === 0) newErrors[field.label] = 'Please select at least one option';
      } else {
        if (!v || String(v).trim() === '') newErrors[field.label] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form || !validate()) return;
    setSubmitting(true);
    setSubmitError('');
    const { error } = await supabase.from('rcc_form_responses').insert({
      form_id: form.id,
      data: values,
    });
    if (error) {
      setSubmitError(error.message);
      setSubmitting(false);
    } else {
      setSubmitted(true);
      setSubmitting(false);
    }
  }

  const getInputStyle = (label: string) => ({
    ...S.input,
    ...(errors[label] ? S.inputError : {}),
  });

  const getSelectStyle = (label: string) => ({
    ...S.select,
    ...(errors[label] ? S.inputError : {}),
  });

  if (loading) {
    return (
      <div style={{ ...S.page }}>
        <Loader2 size={28} style={{ color: '#C21818', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (notFound || !form) {
    return (
      <div style={S.page}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, fontWeight: 900, color: 'rgba(255,255,255,0.08)', lineHeight: 1, marginBottom: 16 }}>404</div>
          <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Form Not Found</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>This form does not exist or is no longer active.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={S.page}>
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(212,175,55,0.1)', border: '2px solid rgba(212,175,55,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 40px rgba(212,175,55,0.15)',
          }}>
            <CheckCircle2 size={32} style={{ color: '#D4AF37' }} />
          </div>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Submitted!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            Your response has been received. We will be in touch soon.
          </p>
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)', marginBottom: 20 }} />
          <p style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>Racquets Club Community</p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={S.header}>
          <div style={S.badge}>
            <span style={S.badgeText}>RCC</span>
          </div>
          <span style={S.brand}>Racquets Club Community</span>
        </div>

        <div style={S.card}>
          <div style={S.titleBar}>
            <h1 style={S.title}>{form.title}</h1>
            {form.description && <p style={S.desc}>{form.description}</p>}
          </div>

          <div style={S.divider} />

          <form onSubmit={handleSubmit}>
            {form.fields.map((field) => (
              <div key={field.id} style={S.fieldWrap}>
                <label style={S.label}>
                  {field.label}
                  {field.required && <span style={S.req}>*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    value={(values[field.label] as string) || ''}
                    onChange={(e) => setValue(field.label, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    style={{ ...getInputStyle(field.label), resize: 'none' as const }}
                  />
                ) : field.type === 'select' ? (
                  <CustomSelect
                    value={(values[field.label] as string) || ''}
                    onChange={(v) => setValue(field.label, v)}
                    options={field.options || []}
                    placeholder={field.placeholder || 'Select an option'}
                    hasError={!!errors[field.label]}
                  />
                ) : field.type === 'radio' ? (
                  <div style={S.optionGroup}>
                    {(field.options || []).map((opt, i) => (
                      <label key={i} style={{
                        ...S.optionLabel,
                        borderColor: values[field.label] === opt ? 'rgba(194,24,24,0.5)' : 'rgba(255,255,255,0.06)',
                        background: values[field.label] === opt ? 'rgba(194,24,24,0.06)' : 'rgba(255,255,255,0.02)',
                      }}>
                        <input
                          type="radio"
                          name={field.label}
                          value={opt}
                          checked={values[field.label] === opt}
                          onChange={() => setValue(field.label, opt)}
                          style={{ accentColor: '#C21818', width: 16, height: 16 }}
                        />
                        <span style={S.optionText}>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : field.type === 'checkbox' ? (
                  <div style={S.optionGroup}>
                    {(field.options || []).map((opt, i) => {
                      const checked = ((values[field.label] as string[]) || []).includes(opt);
                      return (
                        <label key={i} style={{
                          ...S.optionLabel,
                          borderColor: checked ? 'rgba(194,24,24,0.5)' : 'rgba(255,255,255,0.06)',
                          background: checked ? 'rgba(194,24,24,0.06)' : 'rgba(255,255,255,0.02)',
                        }}>
                          <input
                            type="checkbox"
                            value={opt}
                            checked={checked}
                            onChange={() => toggleCheckbox(field.label, opt)}
                            style={{ accentColor: '#C21818', width: 16, height: 16 }}
                          />
                          <span style={S.optionText}>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    type={field.type === 'phone' ? 'tel' : field.type}
                    value={(values[field.label] as string) || ''}
                    onChange={(e) => setValue(field.label, e.target.value)}
                    placeholder={field.placeholder}
                    style={getInputStyle(field.label)}
                  />
                )}

                {errors[field.label] && (
                  <p style={S.errorMsg}>{errors[field.label]}</p>
                )}
              </div>
            ))}

            {submitError && (
              <div style={S.errBanner}>{submitError}</div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{ ...S.submitBtn, ...(submitting ? S.submitBtnDisabled : {}) }}
            >
              {submitting && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </form>
        </div>

        <p style={S.footer}>Racquets Club Community &middot; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
