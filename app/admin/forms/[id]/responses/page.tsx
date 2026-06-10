'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Download, Loader2, ArrowLeft, FileText, Clock } from 'lucide-react';
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

const S = {
  page: { padding: '28px 0' },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 16,
    flexWrap: 'wrap' as const,
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: 'rgba(255,255,255,0.4)',
    textDecoration: 'none',
    fontSize: 13,
    transition: 'color 0.15s',
  },
  sep: { color: 'rgba(255,255,255,0.15)', fontSize: 13 },
  pageTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.04em',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  count: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.08em',
    padding: '5px 10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6,
  },
  csvBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 14px',
    background: 'linear-gradient(135deg, #C21818, #8B0000)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(194,24,24,0.25)',
  },
  card: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  tableWrap: { overflowX: 'auto' as const },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 },
  thead: { borderBottom: '1px solid rgba(255,255,255,0.07)' },
  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.3)',
    whiteSpace: 'nowrap' as const,
    background: 'rgba(255,255,255,0.02)',
  },
  thFirst: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'rgba(212,175,55,0.6)',
    whiteSpace: 'nowrap' as const,
    background: 'rgba(255,255,255,0.02)',
  },
  td: {
    padding: '13px 16px',
    color: 'rgba(255,255,255,0.75)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    verticalAlign: 'top' as const,
    maxWidth: 240,
  },
  tdTime: {
    padding: '13px 16px',
    color: 'rgba(255,255,255,0.35)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    whiteSpace: 'nowrap' as const,
    fontSize: 12,
    verticalAlign: 'top' as const,
  },
  empty: {
    textAlign: 'center' as const,
    padding: '64px 24px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
};

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
        <Loader2 size={24} style={{ color: '#C21818', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!form) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 12 }}>Form not found.</p>
        <Link href="/admin/forms" style={{ color: '#C21818', fontSize: 13, textDecoration: 'none' }}>← Back to Forms</Link>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.topBar}>
        <div style={S.breadcrumb}>
          <Link href="/admin/forms" style={S.backLink}>
            <ArrowLeft size={14} />
            Forms
          </Link>
          <span style={S.sep}>/</span>
          <Link href={`/admin/forms/${id}`} style={{ ...S.backLink, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {form.title}
          </Link>
          <span style={S.sep}>/</span>
          <span style={S.pageTitle}>Responses</span>
        </div>

        <div style={S.meta}>
          <span style={S.count}>
            {responses.length} {responses.length === 1 ? 'response' : 'responses'}
          </span>
          {responses.length > 0 && (
            <button onClick={exportCSV} style={S.csvBtn}>
              <Download size={12} />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {responses.length === 0 ? (
        <div style={S.empty}>
          <div style={S.emptyIcon}>
            <FileText size={22} style={{ color: 'rgba(255,255,255,0.2)' }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14, marginBottom: 4 }}>No responses yet</p>
          <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>Submissions will appear here once the form is filled out.</p>
        </div>
      ) : (
        <div style={S.card}>
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead style={S.thead}>
                <tr>
                  <th style={S.thFirst}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Clock size={10} />
                      Submitted
                    </span>
                  </th>
                  {form.fields.map((field) => (
                    <th key={field.id} style={S.th}>{field.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map((response, i) => (
                  <tr
                    key={response.id}
                    style={{ background: i % 2 === 1 ? 'rgba(255,255,255,0.01)' : 'transparent' }}
                  >
                    <td style={S.tdTime}>
                      {new Date(response.submitted_at).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    {form.fields.map((field) => {
                      const value = response.data[field.label];
                      return (
                        <td key={field.id} style={S.td}>
                          {value !== undefined && value !== null ? (
                            Array.isArray(value)
                              ? (value as string[]).map((v, j) => (
                                  <span key={j} style={{
                                    display: 'inline-block', marginRight: 4, marginBottom: 3,
                                    padding: '2px 8px', borderRadius: 4,
                                    background: 'rgba(194,24,24,0.12)',
                                    border: '1px solid rgba(194,24,24,0.2)',
                                    fontSize: 11, color: 'rgba(255,255,255,0.7)',
                                  }}>
                                    {v}
                                  </span>
                                ))
                              : String(value)
                          ) : (
                            <span style={{ color: 'rgba(255,255,255,0.18)' }}>—</span>
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
