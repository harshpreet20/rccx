import { createClient } from '@supabase/supabase-js';
import { corsJson, OPTIONS as corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const OPTIONS = corsOptions;

/** POST /api/public/join — community onboarding (mirrors lib/supabase.ts's submitMemberOnboarding -> community_members). */
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return corsJson({ error: 'Not configured' }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return corsJson({ error: 'Invalid JSON' }, { status: 400 });
  }

  const full_name = String(body.full_name || '').trim();
  const skill_level = String(body.skill_level || '').trim();
  const agree_guidelines = Boolean(body.agree_guidelines);
  if (!full_name || !skill_level || !agree_guidelines) {
    return corsJson({ error: 'full_name, skill_level and agree_guidelines are required' }, { status: 400 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from('community_members').insert([{
    full_name,
    phone: body.phone ? String(body.phone).trim() : undefined,
    email: body.email ? String(body.email).trim() : undefined,
    birthday: body.birthday ? String(body.birthday) : undefined,
    skill_level,
    court_preference: body.court_preference ? String(body.court_preference) : undefined,
    years_playing: Number(body.years_playing) || 0,
    how_heard: body.how_heard ? String(body.how_heard) : undefined,
    agree_guidelines,
  }]);

  if (error) return corsJson({ error: 'Submission failed' }, { status: 500 });
  return corsJson({ ok: true });
}
