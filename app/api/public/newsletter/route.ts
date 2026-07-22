import { createClient } from '@supabase/supabase-js';
import { corsJson, OPTIONS as corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const OPTIONS = corsOptions;

/** POST /api/public/newsletter — mirrors components/layout/Footer.tsx's inline insert into `newsletter_subscribers`. */
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return corsJson({ error: 'Not configured' }, { status: 503 });

  let body: { email?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return corsJson({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = String(body.email || '').trim();
  if (!email) return corsJson({ error: 'email is required' }, { status: 400 });

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from('newsletter_subscribers').insert({ email, source: body.source || 'rcc-website' });

  if (error) return corsJson({ error: 'Subscription failed' }, { status: 500 });
  return corsJson({ ok: true });
}
