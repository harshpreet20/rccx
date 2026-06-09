'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, CheckCircle } from 'lucide-react';
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
      // initialize checkbox fields as empty arrays
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

  const inputClass = (label: string) =>
    `bg-[#0F1520] border ${errors[label] ? 'border-[#C21818]' : 'border-white/10'} rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#C21818] outline-none w-full transition-colors`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#C21818]" />
      </div>
    );
  }

  if (notFound || !form) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-white/20 text-6xl mb-4">404</div>
          <h1 className="text-white font-black text-2xl tracking-widest uppercase mb-2">Form Not Found</h1>
          <p className="text-white/40 text-sm">This form doesn&#39;t exist or is no longer active.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D9FF00]/10 mb-5">
            <CheckCircle size={32} className="text-[#D9FF00]" />
          </div>
          <h1 className="text-white font-black text-2xl tracking-widest uppercase mb-3">Thank You!</h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Your response has been submitted successfully. We&#39;ll be in touch soon.
          </p>
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="text-white/20 text-xs mt-4 tracking-widest uppercase">Racquets Club Community</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050810] py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#C21818] to-[#D4AF37] mb-3">
            <span className="text-white font-black text-sm tracking-wider">RCC</span>
          </div>
          <div className="text-[#D4AF37] text-xs tracking-[0.3em] font-medium uppercase">Racquets Club Community</div>
        </div>

        <div className="bg-[#0A0E1A] border border-white/10 rounded-2xl p-6 sm:p-8">
          <h1 className="text-white font-black text-xl sm:text-2xl tracking-wide mb-2">{form.title}</h1>
          {form.description && (
            <p className="text-white/50 text-sm leading-relaxed mb-6">{form.description}</p>
          )}
          {!form.description && <div className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-5">
            {form.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  {field.label}
                  {field.required && <span className="text-[#C21818] ml-1">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    value={(values[field.label] as string) || ''}
                    onChange={(e) => setValue(field.label, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className={`${inputClass(field.label)} resize-none`}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={(values[field.label] as string) || ''}
                    onChange={(e) => setValue(field.label, e.target.value)}
                    className={inputClass(field.label)}
                  >
                    <option value="">{field.placeholder || 'Select an option'}</option>
                    {(field.options || []).map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'radio' ? (
                  <div className="space-y-2.5">
                    {(field.options || []).map((opt, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name={field.label}
                          value={opt}
                          checked={values[field.label] === opt}
                          onChange={() => setValue(field.label, opt)}
                          className="accent-[#C21818] w-4 h-4"
                        />
                        <span className="text-white/70 text-sm group-hover:text-white transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : field.type === 'checkbox' ? (
                  <div className="space-y-2.5">
                    {(field.options || []).map((opt, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          value={opt}
                          checked={((values[field.label] as string[]) || []).includes(opt)}
                          onChange={() => toggleCheckbox(field.label, opt)}
                          className="accent-[#C21818] w-4 h-4"
                        />
                        <span className="text-white/70 text-sm group-hover:text-white transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type={field.type === 'phone' ? 'tel' : field.type}
                    value={(values[field.label] as string) || ''}
                    onChange={(e) => setValue(field.label, e.target.value)}
                    placeholder={field.placeholder}
                    className={inputClass(field.label)}
                  />
                )}

                {errors[field.label] && (
                  <p className="text-[#C21818] text-xs mt-1">{errors[field.label]}</p>
                )}
              </div>
            ))}

            {submitError && (
              <div className="bg-[#C21818]/10 border border-[#C21818]/30 rounded-lg px-4 py-3 text-[#C21818] text-sm">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-black rounded-xl tracking-widest uppercase text-sm transition-all hover:shadow-[0_0_30px_rgba(194,24,24,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
