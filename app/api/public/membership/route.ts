import { createClient } from '@supabase/supabase-js';
import { corsJson, OPTIONS as corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const OPTIONS = corsOptions;

/** POST /api/public/membership — membership application (mirrors app/membership/page.tsx's inline insert into `members`). */
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return corsJson({ error: 'Not configured' }, { status: 503 });

  let body: { name?: string; email?: string; phone?: string; skill_level?: string; membership_type?: string };
  try {
    body = await request.json();
  } catch {
    return corsJson({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const phone = String(body.phone || '').trim();
  const skill_level = String(body.skill_level || '').trim();
  const membership_type = String(body.membership_type || '').trim();
  if (!name || !email || !phone || !skill_level || !membership_type) {
    return corsJson({ error: 'name, email, phone, skill_level and membership_type are required' }, { status: 400 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from('members').insert({
    name, email, phone, skill_level, membership_type, status: 'pending',
  });

  if (error) {
    if ((error as { code?: string }).code === '23505') {
      return corsJson({ error: 'This email is already registered.' }, { status: 409 });
    }
    return corsJson({ error: 'Submission failed' }, { status: 500 });
  }
  return corsJson({ ok: true });
}
