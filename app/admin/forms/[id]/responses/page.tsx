'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Download, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
}

interface RccForm {
  id: string;
  title: string;
  slug: string;
  fields: FormField[];
}

interface FormResponse {
  id: string;
  form_id: string;
  data: Record<string, unknown>;
  submitted_at: string;
}

export default function ResponsesPage() {
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<RccForm | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadData() {
    setLoading(true);
    const [{ data: formData }, { data: respData }] = await Promise.all([
      supabase.from('rcc_forms').select('*').eq('id', id).single(),
      supabase.from('rcc_form_responses').select('*').eq('form_id', id).order('submitted_at', { ascending: false }),
    ]);
    if (formData) setForm(formData as RccForm);
    if (respData) setResponses(respData as FormResponse[]);
    setLoading(false);
  }

  function exportCSV() {
    if (!form || responses.length === 0) return;
    const headers = ['Submitted At', ...form.fields.map((f) => f.label)];
    const rows = responses.map((r) => [
      new Date(r.submitted_at).toLocaleString(),
      ...form.fields.map((f) => {
        const v = r.data[f.label];
        return v !== undefined && v !== null ? String(v) : '';
      }),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title || 'responses'}-responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin/forms" className="text-white/40 hover:text-white transition-colors text-sm">← Forms</Link>
          <span className="text-white/20">/</span>
          <Link href={`/admin/forms/${id}`} className="text-white/40 hover:text-white transition-colors text-sm">{form.title}</Link>
          <span className="text-white/20">/</span>
          <span className="text-white font-bold">Responses</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-sm">{responses.length} response{responses.length !== 1 ? 's' : ''}</span>
          {responses.length > 0 && (
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-bold rounded-lg text-xs tracking-widest uppercase"
            >
              <Download size={12} />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="bg-[#0A0E1A] border border-white/10 rounded-xl p-12 text-center">
          <div className="text-white/20 text-5xl mb-4">📊</div>
          <div className="text-white/40 text-sm">No responses yet.</div>
        </div>
      ) : (
        <div className="bg-[#0A0E1A] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-3 text-white/40 text-xs tracking-widest uppercase whitespace-nowrap">Submitted At</th>
                  {form.fields.map((field) => (
                    <th key={field.id} className="text-left px-4 py-3 text-white/40 text-xs tracking-widest uppercase whitespace-nowrap">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map((response, i) => (
                  <tr key={response.id} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-4 py-3 text-white/50 whitespace-nowrap text-xs">
                      {new Date(response.submitted_at).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    {form.fields.map((field) => {
                      const value = response.data[field.label];
                      return (
                        <td key={field.id} className="px-4 py-3 text-white/70">
                          {value !== undefined && value !== null ? (
                            Array.isArray(value) ? value.join(', ') : String(value)
                          ) : (
                            <span className="text-white/20">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
