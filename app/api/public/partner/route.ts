import { createClient } from '@supabase/supabase-js';
import { corsJson, OPTIONS as corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const OPTIONS = corsOptions;

/** POST /api/public/partner — mirrors app/partner/page.tsx's inline insert into `partnership_inquiries`. */
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return corsJson({ error: 'Not configured' }, { status: 503 });

  let body: {
    company_name?: string; contact_name?: string; email?: string; phone?: string;
    website?: string; partnership_type?: string; description?: string;
  };
  try {
    body = await request.json();
  } catch {
    return corsJson({ error: 'Invalid JSON' }, { status: 400 });
  }

  const company_name = String(body.company_name || '').trim();
  const contact_name = String(body.contact_name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const partnership_type = String(body.partnership_type || '').trim();
  const description = String(body.description || '').trim();
  if (!company_name || !contact_name || !email || !partnership_type || !description) {
    return corsJson({ error: 'company_name, contact_name, email, partnership_type and description are required' }, { status: 400 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from('partnership_inquiries').insert({
    company_name, contact_name, email,
    phone: body.phone?.trim() || null,
    website: body.website?.trim() || null,
    partnership_type,
    description,
  });

  if (error) return corsJson({ error: 'Submission failed' }, { status: 500 });
  return corsJson({ ok: true });
}
